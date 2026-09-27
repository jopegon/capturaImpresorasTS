import * as snmp from "net-snmp";


export abstract class IClientOptions {

    protected clientOptions: snmp.SessionOptions = {
        port: 161,
        retries: 3,
        timeout: 250,
        version: snmp.Version2c,
    }


    private _community:string= "public";


    // --- Puerto ---
    public get port(): number {
        return this.clientOptions.port!;
    }

    public set port(value: number) {
        this.clientOptions.port = value;
    }

    // --- Reintentos (Retries) ---
    public get retries(): number {
        return this.clientOptions.retries!;
    }

    public set retries(value: number) {
        this.clientOptions.retries = value;
    }

    public get timeout(): number {
        return this.clientOptions.timeout!;
    }

    public set timeout(value: number) {
        this.clientOptions.timeout = value;
    }

    public get version(): typeof snmp.Version1 | typeof snmp.Version2c {
        return this.clientOptions.version ?? snmp.Version2c;
    }

    public set version(value: typeof snmp.Version1 | typeof snmp.Version2c) {
        this.clientOptions.version=value;
    }

    public get options():snmp.SessionOptions{
        return this.clientOptions;
    }


	public get community(): string {
		return this._community;
	}

}