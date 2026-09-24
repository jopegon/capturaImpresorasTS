import * as snmp from "net-snmp";

export abstract class IClientOptions {

    protected readonly clientOptions = {
        port: 161,
        retries: 3,
        timeout: 250,
        version: snmp.Version2c,
        community: "public"
    };


    getClientOptions(){
        return this.clientOptions;
    }

    getClientOptionsCommunity(){
        return this.clientOptions.community;
    }
}