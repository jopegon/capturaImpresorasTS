import type { IImpresora } from "../Impresoras/IImpresora.js";

import * as snmp from "net-snmp";
import { ConfigSnmp } from "./ConfigSnmp.js";

export type VersionSnmp = typeof snmp.Version1 | typeof snmp.Version2c;



export class SessionSnmp {

    configSnmp:ConfigSnmp;

    constructor(){
        this.configSnmp=new ConfigSnmp();
    }

    setTimeOut(timeout:number){
        this.configSnmp.timeout=timeout;
    }
    
    setRetries(retries:number){
        this.configSnmp.retries=retries
    }

    setPort(port:number){
        this.configSnmp.port=port;
    }


    crearSesion(impresora: IImpresora, version: VersionSnmp = impresora.versionSnmp,
        config: Readonly<ConfigSnmp> = this.configSnmp,): snmp.Session {

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