import { IClientOptions } from "./IClientOptions.js";
import * as snmp from "net-snmp";

export class ClientOptionsVersion1 extends IClientOptions{

    constructor(){
        super();
        this.clientOptions.version=snmp.Version1;        
    }
    
}