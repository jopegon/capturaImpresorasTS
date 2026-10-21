import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";



export class ConsultaBizhub5020i extends AbstractConsultaImpresora {

    constructor(impresora: Impresora, oids: IOidsIniciales) {
        super(impresora, oids);
    }


    protected setNivelNegro(resultados: Map<string, string | number>) {

        let nivel:string|number|undefined;
        nivel = resultados.get(this.oids.oidTonerLevelNegro);

        if (nivel === undefined) {
            return;
        }

        this.impresora.negro = +nivel;
    }
}
