import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";



export class ConsultaImpresoraBizhub5020i extends AbstractConsultaImpresora {

    constructor(impresora: Impresora) {
        super(impresora);
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
