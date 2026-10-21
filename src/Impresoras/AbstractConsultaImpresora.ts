import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import type { Impresora } from "./Impresora.js";
import * as snmp from "net-snmp";
import { crearSesion, snmpGet } from "../sessionSnmp/sesionSnmp.js";

export type ValorContador = number | string | undefined;

export abstract class AbstractConsultaImpresora {

    protected impresora: Impresora;

    protected oids: IOidsIniciales;

    constructor(impresora: Impresora, oids: IOidsIniciales) {
        this.impresora = impresora;
        this.oids = oids;
    }


    /**
     * Obtiene el modelo de la impresora mediante SNMP.
     *
     * Es necesario conocer el modelo antes de generar los OID
     * específicos de cada fabricante/modelo.
     */
    public async getModelo(): Promise<string> {

        const session = crearSesion(this.impresora);


        try {

            const varbinds = await snmpGet(session, [this.oids.oidModelo]);

            if (varbinds.length === 0 || !varbinds[0]) {
                return "";
            }

            const varbind = varbinds[0];

            this.impresora.modelo = varbind.value?.toString() ?? "";

            return this.impresora.modelo;

        } finally {
            session.close();
        }

    }

    protected setNumeroSerie(resultados: Map<string, string | number>) {

        this.impresora.numeroDeSerie = resultados.get(this.oids.oidNumeroDeSerie)?.toString() ?? '';

    }

    /**
     * Obtiene el modelo de la impresora mediante SNMP.
     *
     * Es necesario conocer el modelo antes de generar los OID
     * específicos de cada fabricante/modelo.
     */
    private async obtenerDatosV2c(listaOids: string[]): Promise<snmp.Varbind[]> {


        const session = crearSesion(this.impresora);

        try {
            return await snmpGet(session, listaOids);;

        } finally {
            session.close();
        }

    }

    /**
     * Obtiene el modelo de la impresora mediante SNMP.
     *
     * Es necesario conocer el modelo antes de generar los OID
     * específicos de cada fabricante/modelo.
     */
    private async obtenerDatosV1(listaOids: string[]): Promise<snmp.Varbind[]> {

        const session = crearSesion(this.impresora);
        try {

            // Primero intentamos obtener todos los OID
            // en una única petición.
            return await snmpGet(session, listaOids);

        } catch (error) {

            // Si falla la petición completa, hacemos
            // las consultas individualmente.
            const resultados: snmp.Varbind[] = [];

            for (const oid of listaOids) {

                try {

                    const varbinds = await snmpGet(session, [oid]);

                    if (varbinds.length > 0) {
                        resultados.push(...varbinds);
                    }

                } catch (errorIndividual) {

                    // Este OID no está disponible.
                    // Continuamos con el siguiente.
                    console.warn(
                        `OID no disponible: ${oid}`
                    );
                }
            }

            return resultados;
        }

    }

    protected setContadorPaginas(resultados: Map<string, string | number>) {

        const valor: number | string | undefined = resultados.get(this.oids.oidContadorImpresiones);

        // Validamos que el valor exista y que sea estrictamente de tipo 'number'
        if (typeof valor === 'number' && !Number.isNaN(valor)) {
            this.impresora.contador = valor;
        }
    }

    protected calcularPorcentaje(capacidadRaw: ValorContador,
        nivelRaw: ValorContador): number | undefined {
        if (capacidadRaw === undefined || nivelRaw === undefined) {
            return undefined;
        }

        const capacidad = Number(capacidadRaw);
        const nivel = Number(nivelRaw);

        if (
            !Number.isFinite(capacidad) ||
            !Number.isFinite(nivel) ||
            capacidad <= 0
        ) {
            return undefined;
        }

        return Math.round((nivel / capacidad) * 100);
    }



    protected setNivelNegro(resultados: Map<string, string | number>) {
        const porcentaje = this.calcularPorcentaje(
            resultados.get(this.oids.oidFullCapacityNegro),
            resultados.get(this.oids.oidTonerLevelNegro)
        );

        if (porcentaje === undefined) {
            return;
        }

        this.impresora.negro = porcentaje;
    }


    protected setNivelAmarillo(resultados: Map<string, string | number>) {
        const porcentaje = this.calcularPorcentaje(
            resultados.get(this.oids.oidFullCapacityAmarillo),
            resultados.get(this.oids.oidTonerLevelAmarillo)
        );

        if (porcentaje === undefined) {
            return;
        }

        this.impresora.amarillo = porcentaje;
    }


    protected setNivelCyan(resultados: Map<string, string | number>) {
        const porcentaje = this.calcularPorcentaje(
            resultados.get(this.oids.oidFullCapacityCyan),
            resultados.get(this.oids.oidTonerLevelCyan)
        );

        if (porcentaje === undefined) {
            return;
        }

        this.impresora.cyan = porcentaje;
    }


    protected setNivelMagenta(resultados: Map<string, string | number>) {
        const porcentaje = this.calcularPorcentaje(
            resultados.get(this.oids.oidFullCapacityMagenta),
            resultados.get(this.oids.oidTonerLevelMagenta)
        );

        if (porcentaje === undefined) {
            return;
        }

        this.impresora.magenta = porcentaje;
    }




    protected varbindsToMap(
        varbinds: snmp.Varbind[]
    ): Map<string, string | number> {

        return varbinds.reduce<Map<string, string | number>>(
            (map, varbind) => {

                if (!snmp.isVarbindError(varbind)) {

                    const valor = Buffer.isBuffer(varbind.value)
                        ? varbind.value.toString('hex')
                        : varbind.value;

                    map.set(varbind.oid, valor as string | number);
                }

                return map;
            },
            new Map<string, string | number>()
        );
    }
    public async getDatos(): Promise<Impresora> {
        try {
            let varbinds: snmp.Varbind[];

            if (this.impresora.versionSnmp === snmp.Version2c) {
                varbinds = await this.obtenerDatosV2c(this.oids.listaOids);
            } else {
                varbinds = await this.obtenerDatosV1(this.oids.listaOids);
            }

            const mapVarbinds = this.varbindsToMap(varbinds);
            this.setNumeroSerie(mapVarbinds);
            this.setContadorPaginas(mapVarbinds);
            this.setNivelNegro(mapVarbinds);
            this.setNivelAmarillo(mapVarbinds);
            this.setNivelCyan(mapVarbinds);
            this.setNivelMagenta(mapVarbinds);
            if (this.impresora.magenta !== undefined && this.impresora.amarillo !== undefined && this.impresora.cyan !== undefined) {
                this.impresora.color = true;
            }
        } catch (error) {
            console.warn(`No se pudieron obtener niveles de ${this.impresora.ip}:`, (error as Error).message);
        }

        return this.impresora;
    }


}
