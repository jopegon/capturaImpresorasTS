import * as snmp from "net-snmp";
import type { Impresora } from "./Impresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import { crearSesion, snmpGet } from "./utilidadesSesion.js";
import { OperacionesPerfiles } from "../PerfilesImpresoras/OperacionesPerfiles.js";

export class IdentificadorImpresora {


    protected oids: IOidsIniciales;

    protected clientOptions: snmp.SessionOptions;

    protected impresora: Impresora;

    constructor(impresora: Impresora) {
        this.impresora = impresora;

        // Por defecto carga la conf para version2c
        this.clientOptions =  OperacionesPerfiles.getClientOptions(this.impresora.modelo)

        // Inicialmente desconocemos el modelo de impresora.
        // Estos OID permiten realizar la identificación inicial.
        this.oids = OperacionesPerfiles.getOids('');
    }



    /**
 * Obtiene el modelo de la impresora mediante SNMP.
 *
 * Es necesario conocer el modelo antes de generar los OID
 * específicos de cada fabricante/modelo.
 */
    protected async getModelo(): Promise<string> {

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


    public async identificar(): Promise<Impresora> {

        const versiones = [snmp.Version2c, snmp.Version1];

        for (const version of versiones) {
            this.clientOptions.version = version;
            try {
                await this.getModelo();
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