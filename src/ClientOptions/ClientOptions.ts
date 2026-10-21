import * as snmp from "net-snmp";

export class ClientOptions {

    protected clientOptions: snmp.SessionOptions = {
        port: 161,
        retries: 3,
        timeout: 1000,
        version: snmp.Version2c,
    }

    public static community: string = "public";

    public get version(): typeof snmp.Version1 | typeof snmp.Version2c {
        return this.clientOptions.version ?? snmp.Version2c;
    }

    public set version(value: typeof snmp.Version1 | typeof snmp.Version2c) {
        this.clientOptions.version = value;
    }

    public getClientOptionsV1(): ClientOptions {
        this.clientOptions.version = snmp.Version1;
        return this;
    }

    public getClientOptionsV2c(): ClientOptions {
        this.clientOptions.version = snmp.Version2c;
        return this;
    }



}