import * as snmp from "net-snmp";
import { Impresora } from "./Impresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import { OidsGenericos } from "../Oids/OidsEspecificos/OidsGenericos.js";
import { SessionSnmp } from "../sessionSnmp/SessionSnmp.js";

export class IdentificadorImpresora {

    protected oids: IOidsIniciales;

    protected construirSesion: SessionSnmp;

    protected impresora:Impresora;

    constructor( timeout?:number, retries?:number) {

        this.impresora=new Impresora('','');
        

        this.construirSesion = new SessionSnmp();

        if(timeout){
            this.construirSesion.CONFIG_SNMP.timeout=timeout;
        }

        if(retries){
            this.construirSesion.CONFIG_SNMP.retries=retries;
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

            return this.impresora.modelo;

        } finally {
            session.close();
        }

    }


    public async identificar(impresora:Impresora): Promise<Impresora> {

        const versiones = [snmp.Version2c, snmp.Version1];

        this.impresora=impresora;

        for (const version of versiones) {
            try {
                await this.getModelo(impresora,version);
                if (this.impresora.modelo.length > 0) {
                    this.impresora.conectada = true;
                    this.impresora.versionSnmp = version;
                    break;
                }
            } catch {
                // timeout o error de red con esta versión; probamos la siguiente
            }

        }

        return this.impresora;
    }
}