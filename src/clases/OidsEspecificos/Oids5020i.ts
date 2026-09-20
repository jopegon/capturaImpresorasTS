import { OidIniciales } from "../OidsIniciales.js";

export class Oids5020i extends OidIniciales {

    // Pongo el mismo oid porque el oidFullNegro no existe y tiene que tener uno que exista

    constructor() {
        super();
        this.oidTonerLevelNegro = '1.3.6.1.4.1.18334.1.1.1.5.7.4.4.1.3.1';
        this.oidFullCapacityNegro = '1.3.6.1.4.1.18334.1.1.1.5.7.4.4.1.3.1';
    }
}

