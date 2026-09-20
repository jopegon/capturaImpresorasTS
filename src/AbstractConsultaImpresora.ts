import type { Impresora } from "./clases/Impresora.js";
import * as snmp from "net-snmp";
import type { IOidsIniciales } from "./clases/IOidsIniciales.js";
import { ConstructorOids } from "./clases/ConstructorOids.js";

export type ValorContador = number | string | undefined;

export abstract class AbstractConsultaImpresora {

    protected impresora: Impresora;

    protected oids: IOidsIniciales;

    protected readonly clientOptions = {
        port: 161,
        retries: 3,
        timeout: 250,
        version: snmp.Version2c,
        community: "public"
    };

    constructor(impresora: Impresora) {
        this.impresora = impresora;

        // Inicialmente desconocemos el modelo de impresora.
        // Estos OID permiten realizar la identificación inicial.
        this.oids = new ConstructorOids().OidsInicialesDe();
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

        const session = snmp.createSession(
            this.impresora.ip,
            this.clientOptions.community,
            this.clientOptions
        );

        try {

            const varbinds = await this.snmpGet(
                session,
                [this.oids.oidModelo]
            );

            if (varbinds.length === 0 || !varbinds[0]) {
                this.impresora.modelo = "";
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
    async getNiveles(listaOids: string[]): Promise<snmp.Varbind[]> {

        const session = snmp.createSession(
            this.impresora.ip,
            this.clientOptions.community,
            this.clientOptions
        );

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
            console.warn("No se pudo calcular el nivel de tóner negro.");
            return;
        }

        this.impresora.negro = porcentaje;
    }





    protected varbindsToMap(varbinds: snmp.Varbind[]): Map<string, string | number> {

        return varbinds.reduce<Map<string, string | number>>((map, varbind) => {
            if (!snmp.isVarbindError(varbind)) {
                map.set(varbind.oid, varbind.value as string | number);
            }

            return map;
        }, new Map());
    }

    public async getDatos(): Promise<Impresora> {

        await this.getModelo();
        if (this.impresora.modelo.length > 0) {
            this.impresora.conectada = true
        }

        const oids: IOidsIniciales = new ConstructorOids().OidsInicialesDe(this.impresora.modelo);

        const varbinds: snmp.Varbind[] = await this.getNiveles(oids.listaOids);

        // Convierto el array de resultados en un mapa en el que el índice es el oid
        const mapVarbinds = this.varbindsToMap(varbinds);

        this.setNumeroSerie(mapVarbinds);

        this.setContadorPaginas(mapVarbinds);

        this.setNivelNegro(mapVarbinds);
        



        return this.impresora;
    }


}
