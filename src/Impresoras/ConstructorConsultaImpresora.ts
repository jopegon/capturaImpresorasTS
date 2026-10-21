import type { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";
import { ConsultaImpresora } from "./ConsultaImpresora.js";
import { ConsultaImpresoraBizhub5020i } from "./ConsultaImpresoraBizhub5020i.js";
import { ConsultaImpresoraL6910DN } from "./ConsultaImpresoraL6910DN.js";
import type { Impresora } from "./Impresora.js";

export class ConstructorConsultaImpresora {
  

    async construyeConsultaImpresora(impresora:Impresora):Promise<AbstractConsultaImpresora>{

        let mapaImpresoras = new Map<string, AbstractConsultaImpresora>;

        mapaImpresoras.set("KONICA MINOLTA bizhub 5020i", new ConsultaImpresoraBizhub5020i(impresora));
        mapaImpresoras.set("Brother MFC-L6910DN series", new ConsultaImpresoraL6910DN(impresora));


        return mapaImpresoras.get(impresora.modelo) ?? new ConsultaImpresora(impresora);
    }

}