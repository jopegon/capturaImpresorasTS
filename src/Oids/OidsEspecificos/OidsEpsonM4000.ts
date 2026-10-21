import { OidsGenericos } from "./OidsGenericos.js";

export class OidsEpsonM4000 extends OidsGenericos {

    constructor() {
        super(); 
        this.oidNumeroDeSerie='1.3.6.1.4.1.11.2.3.9.4.2.1.1.3.3.0';
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro, 
                this.oidFullCapacityNegro];
    }   

}