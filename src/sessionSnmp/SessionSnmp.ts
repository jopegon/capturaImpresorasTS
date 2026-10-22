import type { IImpresora } from "../Impresoras/IImpresora.js";

import * as snmp from "net-snmp";

export type VersionSnmp = typeof snmp.Version1 | typeof snmp.Version2c;

export interface ConfigSnmp {
    community: string;
    port: number;
    retries: number;
    timeout: number;
}


export class SessionSnmp {

    CONFIG_SNMP: ConfigSnmp = {
        community: process.env["SNMP_COMMUNITY"] ?? "public",
        port: 161,
        retries: 2,
        timeout: 500,
    };

    setTimeOut(timeout:number){
        this.CONFIG_SNMP.timeout=timeout;
    }
    
    setRetries(retries:number){
        this.CONFIG_SNMP.retries=retries
    }

    setPort(port:number){
        this.CONFIG_SNMP.port=port;
    }


    crearSesion(impresora: IImpresora, version: VersionSnmp = impresora.versionSnmp,
        config: Readonly<ConfigSnmp> = this.CONFIG_SNMP,): snmp.Session {

        const { community, ...opciones } = config;
        return snmp.createSession(impresora.ip, community, { ...opciones, version });
    }


    snmpGet(session: snmp.Session, oids: string[]): Promise<snmp.Varbind[]> {

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
}