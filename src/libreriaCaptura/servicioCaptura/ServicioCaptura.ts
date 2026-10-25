import { IdentificadorImpresora } from "../Impresoras/IdentificadorImpresora.js";
import { Impresora } from "../Impresoras/Impresora.js";
import { OperacionesPerfiles } from "../PerfilesImpresoras/OperacionesPerfiles.js";

export class ServicioCaptura {

    timeout:number=500;
    retries:number=1;
    identificadorImpresora:IdentificadorImpresora;
    constructor(timeout?:number, retries?:number){
        if (timeout){
           this.timeout=timeout; 
        }
        if(retries){
            this.retries=retries;
        }
        this.identificadorImpresora=new IdentificadorImpresora(this.timeout,this.retries);
        
    }

    public async capturaImpresora(impresora: Impresora): Promise<Impresora> {
        try {
            const identificada = await new IdentificadorImpresora(this.timeout, this.retries).identificar(impresora);
            if (!identificada.conectada) {
                return identificada;
            }
            const consulta = new OperacionesPerfiles().getConsulta(identificada);
            consulta.timeout=this.timeout;
            return await consulta.getDatos();
        } catch (error) {
            return impresora;
        }
    }

    // capturaImpresora nunca rechaza, así que Promise.all es seguro
    public async capturaListaImpresoras(lista: Impresora[]): Promise<Impresora[]> {
        return Promise.all(lista.map(i => this.capturaImpresora(i)));
    }
}