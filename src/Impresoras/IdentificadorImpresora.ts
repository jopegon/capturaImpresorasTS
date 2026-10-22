import * as snmp from "net-snmp";
import type { Impresora } from "./Impresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import { OidsGenericos } from "../Oids/OidsEspecificos/OidsGenericos.js";
import { SessionSnmp } from "../sessionSnmp/SessionSnmp.js";

export class IdentificadorImpresora {

    protected oids: IOidsIniciales;

    protected impresora: Impresora;

    protected construirSesion: SessionSnmp;

    constructor(impresora: Impresora) {
        this.impresora = impresora;

        this.construirSesion = new SessionSnmp();

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
    protected async getModelo(version: typeof snmp.Version1 | typeof snmp.Version2c): Promise<string> {


        const session = this.construirSesion.crearSesion(this.impresora, version);


        try {

            const varbinds = await this.construirSesion.snmpGet(session, [this.oids.oidModelo]);

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
            try {
                await this.getModelo(version);
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