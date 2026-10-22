import type { Impresora } from "./Impresora.js";
import { AbstractConsultaImpresora, type ValorSnmp } from "./AbstractConsultaImpresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";



export class ConsultaL6910DN extends AbstractConsultaImpresora {

    constructor(impresora: Impresora, oids: IOidsIniciales) {
        super(impresora, oids);
    }


parseBrotherBlackToner(value: string): number | null {

    if (
        value.length === 0 ||
        value.length % 2 !== 0 ||
        !/^[0-9a-fA-F]+$/.test(value)
    ) {
        return null;
    }

    const bytes: number[] = [];

    for (let i = 0; i < value.length; i += 2) {
        bytes.push(Number.parseInt(value.slice(i, i + 2), 16));
    }

    const marker = [0x81, 0x01, 0x04, 0x00, 0x00, 0x00];

    for (let i = 0; i <= bytes.length - 7; i++) {

        const coincide = marker.every(
            (byte, index) => bytes[i + index] === byte
        );

        if (coincide) {
            const porcentaje = bytes[i + 6];

            if (porcentaje !== undefined && porcentaje <= 100) {
                return porcentaje;
            }
        }
    }

    return null;
}

protected setNivelNegro(resultados: Map<string, ValorSnmp>): void {

    const nivel = resultados.get(this.oids.oidTonerLevelNegro);

    if (nivel === undefined) {
        return;
    }

    // El OID de la Brother es un blob binario: llega como Buffer
    const hex = Buffer.isBuffer(nivel) ? nivel.toString("hex") : nivel;

    if (typeof hex !== "string") {
        return;
    }

    const percentage = this.parseBrotherBlackToner(hex);

    if (percentage === null) {
        return;
    }
    this.impresora.negro = percentage;
}
}
