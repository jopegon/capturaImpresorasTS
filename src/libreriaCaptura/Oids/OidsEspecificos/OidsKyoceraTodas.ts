import { OidsGenericos } from "./OidsGenericos.js";


export class OidsKyoceraTodas extends OidsGenericos {

    constructor(){
        super();
        this.oidContadorImpresiones ='1.3.6.1.4.1.1347.43.10.1.1.12.1.1';
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro,
                this.oidFullCapacityNegro];
    }

    
    
}

