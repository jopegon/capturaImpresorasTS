import { OidIniciales } from "../OidsIniciales.js";


export class OidsM201dw extends OidIniciales {

    constructor() {
        super();
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro,
        this.oidFullCapacityNegro];
    }

}