import { OidsGenericos } from "./OidsGenericos.js";


export class OidsL6910 extends OidsGenericos {

    constructor(){
        super();
        this.oidTonerLevelNegro = '1.3.6.1.4.1.2435.2.3.9.4.2.1.5.5.8.0';
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro];
    }

}