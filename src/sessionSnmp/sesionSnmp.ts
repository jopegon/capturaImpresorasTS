// src/Snmp/sesionSnmp.ts
import * as snmp from "net-snmp";
import type { IImpresora } from "../Impresoras/IImpresora.js";

export type VersionSnmp = typeof snmp.Version1 | typeof snmp.Version2c;

export interface ConfigSnmp {
    community: string;
    port: number;
    retries: number;
    timeout: number;
}

export const CONFIG_SNMP: Readonly<ConfigSnmp> = {
    community: process.env["SNMP_COMMUNITY"] ?? "public",
    port: 161,
    retries: 2,
    timeout: 500,
};

export function crearSesion(
    impresora: IImpresora,
    version: VersionSnmp = impresora.versionSnmp,
    config: Readonly<ConfigSnmp> = CONFIG_SNMP,
): snmp.Session {
    const { community, ...opciones } = config;
    return snmp.createSession(impresora.ip, community, { ...opciones, version });
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
                return;
            }

            resolve(varbinds ?? []);
        }
        );
    });
}