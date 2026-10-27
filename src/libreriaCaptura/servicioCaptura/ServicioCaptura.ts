import { IdentificadorImpresora } from "../Impresoras/IdentificadorImpresora.js";
import { Impresora } from "../Impresoras/Impresora.js";
import { OperacionesPerfiles } from "../PerfilesImpresoras/OperacionesPerfiles.js";

export class ServicioCaptura {


    private identificadorImpresora:IdentificadorImpresora;
    private operacionesPerfiles:OperacionesPerfiles;
/*
    propiedades de parámetros (Parameter Properties) combinada con valores por defecto.

    En lugar de declarar las propiedades explícitamente al inicio de la clase y luego escribir this.timeout = timeout dentro del constructor, TypeScript automatiza todo ese proceso en una sola línea.
*/
    constructor(private readonly timeout = 500, private readonly retries = 1){
        this.identificadorImpresora=new IdentificadorImpresora(this.timeout,this.retries);
        this.operacionesPerfiles=new OperacionesPerfiles();
        
    }

    public async capturaImpresora(impresora: Impresora): Promise<Impresora> {
        try {
            impresora.conectada=false;
            const identificada = await this.identificadorImpresora.identificar(impresora);
            if (!identificada.conectada) {
                return identificada;
            }
 
            const consulta = this.operacionesPerfiles.getConsulta(identificada);
            consulta.timeout=this.timeout;
            consulta.retries=this.retries;
            return await consulta.getDatos();
        } catch (error) {
            impresora.error = error instanceof Error ? error.message : String(error);
            return impresora;
        }
    }

    // capturaImpresora nunca rechaza, así que Promise.all es seguro
    public capturaListaImpresoras(lista: Impresora[]): Promise<Impresora[]> {
        return Promise.all(lista.map(i => this.capturaImpresora(i)));
    }
}