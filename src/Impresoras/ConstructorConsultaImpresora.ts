import type { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";
import { ConsultaImpresoraV1 } from "./ConsultaImpresoraV1.js";
import { ConsultaImpresoraV2c } from "./ConsultaImpresoraV2c.js";
import type { Impresora } from "./Impresora.js";

export class ConstructorConsultaImpresora {
  

    construyeConsultaImpresora(impresora:Impresora):AbstractConsultaImpresora{
        let mapaObjetos = new Map<string, AbstractConsultaImpresora>;
        mapaObjetos.set("B430", new ConsultaImpresoraV1(impresora));
        mapaObjetos.set("EPSON AL-M4000", new ConsultaImpresoraV1(impresora));

        return mapaObjetos.get(impresora.modelo) ?? new ConsultaImpresoraV2c(impresora);
    }


}