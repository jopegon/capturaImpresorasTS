import * as snmp from "net-snmp";
import { Impresora } from "./Impresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import { OidsGenericos } from "../Oids/OidsEspecificos/OidsGenericos.js";
import { SessionSnmp } from "../sessionSnmp/SessionSnmp.js";

export class IdentificadorImpresora {

    protected oids: IOidsIniciales;

    protected construirSesion: SessionSnmp;


    constructor( timeout?:number, retries?:number) {
        

        this.construirSesion = new SessionSnmp();

        if(timeout){
            this.construirSesion.configSnmp.timeout=timeout;
        }

        if(retries!== undefined){
            this.construirSesion.configSnmp.retries=retries;
        }

        // Inicialmente desconocemos el modelo de impresora.
        // Estos OID permiten realizar la identificación inicial.
        this.oids = new OidsGenericos();
    }


    /**
 * Obtiene el modelo de la impresora mediante SNMP.
 *
 * Es necesario conocer el modelo antes de generar los OID
 * específicos de cada fabricante/modelo.
 */
    protected async getModelo(impresora:Impresora, version: typeof snmp.Version1 | typeof snmp.Version2c): Promise<string> {


        const session = this.construirSesion.crearSesion(impresora, version);


        try {

            const varbinds = await this.construirSesion.snmpGet(session, [this.oids.oidModelo]);

            if (varbinds.length === 0 || !varbinds[0]) {
                return "";
            }

            const varbind = varbinds[0];

            impresora.modelo = varbind.value?.toString() ?? "";

            return impresora.modelo;

        } finally {
            session.close();
        }

    }


    public async identificar(impresora:Impresora): Promise<Impresora> {

        impresora.inicializaValores();
        for (const version of [snmp.Version2c, snmp.Version1]) {
            try {
                await this.getModelo(impresora,version);
                if (impresora.modelo.length > 0) {
                    impresora.conectada = true;
                    impresora.versionSnmp = version;
                    break;
                }
            } catch {
                // timeout o error de red con esta versión; probamos la siguiente
            }

        }

        return impresora;
    }
}