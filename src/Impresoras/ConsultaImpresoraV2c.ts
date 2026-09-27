import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";



export class ConsultaImpresoraV2c  extends AbstractConsultaImpresora{

    constructor(impresora: Impresora) {
        super(impresora);
    }

}
