import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";



export class ConsultaGenerica  extends AbstractConsultaImpresora{

    constructor(impresora: Impresora, oids: IOidsIniciales) {
        super(impresora, oids);
    }
}
