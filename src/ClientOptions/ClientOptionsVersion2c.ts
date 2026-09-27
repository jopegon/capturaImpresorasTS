import { IClientOptions } from "./IClientOptions.js";
import * as snmp from "net-snmp";

export class ClientOptionsVersion2c extends IClientOptions{

    constructor(){
        super();
        this.clientOptions.version=snmp.Version2c;        
    }
    
}