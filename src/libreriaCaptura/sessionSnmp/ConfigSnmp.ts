export class ConfigSnmp{

    community: string;
    port: number;
    retries: number;
    timeout: number;

    constructor(){
        this.community="public";
        this.port=161;
        this.retries=1;
        this.timeout=250;
    }

    set Community(value: string){
        this.community=value;
    }

    get Community():string{
        return this.community;
    }

    set Port(value:number){
        this.port=value;
    }

    get Port():number{
        return this.port;
    }

    set Retries(value:number){
        this.retries=value;
    }

    get Retries():number{
        return this.retries;
    }

    set Timeout(value:number){
        this.timeout=value;
    }

    get Timeout():number{
        return this.timeout;
    }
}