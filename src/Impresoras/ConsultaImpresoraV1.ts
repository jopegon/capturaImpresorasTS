import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";



export class ConsultaImpresoraV1  extends AbstractConsultaImpresora{

    constructor(impresora: Impresora) {
        super(impresora);
    }

}
