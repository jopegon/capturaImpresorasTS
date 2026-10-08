import type { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";
import { ConsultaImpresora } from "./ConsultaImpresora.js";
import type { Impresora } from "./Impresora.js";

export class ConstructorConsultaImpresora {
  

    async construyeConsultaImpresora(impresora:Impresora):Promise<AbstractConsultaImpresora>{

        let mapaObjetos = new Map<string, AbstractConsultaImpresora>;
        //mapaObjetos.set("B430", new ConsultaImpresora(impresora));

        return mapaObjetos.get(impresora.modelo) ?? new ConsultaImpresora(impresora);
    }

}