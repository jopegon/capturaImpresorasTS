import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora } from "./AbstractConsultaImpresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";



export class ConsultaBizhub5020i extends AbstractConsultaImpresora {

    constructor(impresora: Impresora, oids: IOidsIniciales) {
        super(impresora, oids);
    }


    protected setNivelNegro(resultados: Map<string, string | number>) {

        let nivel: string | number | undefined;
        nivel = resultados.get(this.oids.oidTonerLevelNegro);

        if (nivel === undefined) {
            return undefined;
        }

        if (nivel === -3 || nivel === -2 || nivel === -1) {
            return undefined;
        }

        if (typeof nivel === "number") {
            if (nivel > 100) {
                return undefined
            }
        }else{
            return undefined;
        }
    

        this.impresora.negro = +nivel;
    }
}
