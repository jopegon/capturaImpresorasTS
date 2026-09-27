import { ConstructorClientOptions } from "../ClientOptions/ConstructorClientOptions.js";
import type { IClientOptions } from "../ClientOptions/IClientOptions.js";
import { ConstructorOids } from "../Oids/ConstructorOids.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import type { Impresora } from "./Impresora.js";
import * as snmp from "net-snmp";

export type ValorContador = number | string | undefined;

export abstract class AbstractConsultaImpresora {

    protected impresora: Impresora;

    protected oids: IOidsIniciales;

    protected clientOptions: IClientOptions;


    constructor(impresora: Impresora) {
        this.impresora = impresora;

        // Por defecto carga la conf para version2c
        this.clientOptions = new ConstructorClientOptions().clientOptions();

        // Inicialmente desconocemos el modelo de impresora.
        // Estos OID permiten realizar la identificación inicial.
        this.oids = new ConstructorOids().OidsInicialesDe();
    }

    protected crearSesion(): snmp.Session {
        return snmp.createSession(
            this.impresora.ip,
            this.clientOptions.community,
            this.clientOptions // mismo objeto en TODOS los createSession
        );
    }

    /**
     * Realiza una consulta SNMP utilizando la sesión proporcionada.
     *
     * @param session Sesión SNMP activa.
     * @param oids OID que se desean consultar.
     * @returns Lista de Varbind obtenidos.
     */
    protected async snmpGet(session: snmp.Session, oids: string[]): Promise<snmp.Varbind[]> {

        return new Promise<snmp.Varbind[]>((resolve, reject) => {

            session.get(oids, (error: Error | null, varbinds?: snmp.Varbind[]) => {

                if (error) {
                    reject(error instanceof Error ? error : new Error(String(error)));
                    //reject(varbinds ?? [])
                    return;
                }

                resolve(varbinds ?? []);
            }
            );
        });
    }

    /**
     * Obtiene el modelo de la impresora mediante SNMP.
     *
     * Es necesario conocer el modelo antes de generar los OID
     * específicos de cada fabricante/modelo.
     */
    protected async getModelo(): Promise<string> {

        const session = this.crearSesion();


        try {

            const varbinds = await this.snmpGet(
                session,
                [this.oids.oidModelo]
            );

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
    private async obtenerDatos(listaOids: string[]): Promise<snmp.Varbind[]> {


        const session = this.crearSesion();

        try {

            const varbinds: snmp.Varbind[] = await this.snmpGet(session, listaOids);
            return varbinds;

        } finally {
            session.close();
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

        return (nivel / capacidad) * 100;
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




    protected varbindsToMap(varbinds: snmp.Varbind[]): Map<string, string | number> {
        return varbinds.reduce<Map<string, string | number>>((map, varbind) => {
            if (!snmp.isVarbindError(varbind)) {
                const valor = Buffer.isBuffer(varbind.value)
                    ? varbind.value.toString('utf8')
                    : varbind.value;
                map.set(varbind.oid, valor as string | number);
            }
            return map;
        }, new Map());
    }

    public async getDatos(): Promise<Impresora> {

        const versiones = [snmp.Version2c, snmp.Version1];

        for (const version of versiones) {
            this.clientOptions.version = version;
            try {
                await this.getModelo();
                if (this.impresora.modelo.length > 0) {
                    this.impresora.conectada = true;
                    break;
                }
            } catch {
                // timeout o error de red con esta versión; probamos la siguiente
            }
        }


        if (!this.impresora.conectada) {
            return this.impresora;
        }

        const oids = new ConstructorOids().OidsInicialesDe(this.impresora.modelo);

        try {
            const varbinds = await this.obtenerDatos(oids.listaOids);
            const mapVarbinds = this.varbindsToMap(varbinds);
            this.setNumeroSerie(mapVarbinds);
            this.setContadorPaginas(mapVarbinds);
            this.setNivelNegro(mapVarbinds);
            this.setNivelAmarillo(mapVarbinds);
            this.setNivelCyan(mapVarbinds);
            this.setNivelMagenta(mapVarbinds);
            if (this.impresora.magenta !== undefined) {
                this.impresora.color = true;
            }
        } catch (error) {
            console.warn(`No se pudieron obtener niveles de ${this.impresora.ip}:`, (error as Error).message);
        }

        return this.impresora;
    }


}
