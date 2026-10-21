import * as snmp from "net-snmp";
import type { IImpresora } from "./IImpresora.js";
import { ClientOptions } from "../ClientOptions/ClientOptions.js";
import { OperacionesPerfiles } from "../PerfilesImpresoras/OperacionesPerfiles.js";

export function crearSesion(impresora: IImpresora): snmp.Session {

    return snmp.createSession(
        impresora.ip,
        ClientOptions.community,
        OperacionesPerfiles.getClientOptions(impresora.modelo)
    );
}

/**
 * Realiza una consulta SNMP utilizando la sesión proporcionada.
 *
 * @param session Sesión SNMP activa.
 * @param oids OID que se desean consultar.
 * @returns Lista de Varbind obtenidos.
 */
export async function snmpGet(session: snmp.Session, oids: string[]): Promise<snmp.Varbind[]> {

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