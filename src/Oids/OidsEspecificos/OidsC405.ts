import { OidsGenericos } from "./OidsGenericos.js";

export class OidsC405 extends OidsGenericos {

    constructor() {
        super();
        this.oidTonerLevelCyan = '1.3.6.1.2.1.43.11.1.1.9.1.4';
        this.oidFullCapacityCyan = '1.3.6.1.2.1.43.11.1.1.8.1.4';
        this.oidTonerLevelAmarillo = '1.3.6.1.2.1.43.11.1.1.9.1.2';
        this.oidFullCapacityAmarillo = '1.3.6.1.2.1.43.11.1.1.8.1.2';
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro,
                this.oidFullCapacityNegro, this.oidFullCapacityAmarillo, this.oidTonerLevelAmarillo,
                this.oidFullCapacityCyan, this.oidTonerLevelCyan, this.oidFullCapacityMagenta, this.oidTonerLevelMagenta];
    }

}

