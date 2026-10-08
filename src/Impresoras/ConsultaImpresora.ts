import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";



export class ConsultaImpresora  extends AbstractConsultaImpresora{

    constructor(impresora: Impresora) {
        super(impresora);
    }

}
