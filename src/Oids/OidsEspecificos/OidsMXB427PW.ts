import { OidsGenericos } from "./OidsGenericos.js";

export class OidsMXB427PW extends OidsGenericos {


    constructor(){
        super();
        this.oidTonerLevelNegro = '1.3.6.1.2.1.43.11.1.1.9.1.2';
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro,
                this.oidFullCapacityNegro];
    }

    
}

