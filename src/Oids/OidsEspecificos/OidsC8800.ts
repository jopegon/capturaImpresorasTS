import { OidIniciales } from "../OidsIniciales.js";


export class OidsC8800 extends OidIniciales {

    constructor(){
        super();
        this.oidNumeroDeSerie='1.3.6.1.4.1.2001.1.1.1.1.11.1.10.45.0';
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro,
                this.oidFullCapacityNegro, this.oidFullCapacityAmarillo, this.oidTonerLevelAmarillo,
                this.oidFullCapacityCyan, this.oidTonerLevelCyan, this.oidFullCapacityMagenta, this.oidTonerLevelMagenta];
    }
    
}




