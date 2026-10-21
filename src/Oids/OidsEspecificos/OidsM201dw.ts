import { OidsGenericos } from "./OidsGenericos.js";


export class OidsM201dw extends OidsGenericos {

    constructor() {
        super();
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro,
        this.oidFullCapacityNegro];
    }

}