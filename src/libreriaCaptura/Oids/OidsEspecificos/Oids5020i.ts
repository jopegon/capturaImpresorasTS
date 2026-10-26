import { OidsGenericos } from "./OidsGenericos.js";

export class Oids5020i extends OidsGenericos {

    // Pongo el mismo oid porque el oidFullNegro no existe y tiene que tener uno que exista

    constructor() {
        super();

        // esta impresora tiene una consulta especial no necesita fullCapacity
        this.oidTonerLevelNegro =   '1.3.6.1.4.1.18334.1.1.1.5.7.4.4.1.3.1';
        
        this.listaOids = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro];
    }
}

