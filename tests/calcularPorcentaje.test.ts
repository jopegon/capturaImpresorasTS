import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ConsultaGenerica } from "../src/libreriaCaptura/Impresoras/ConsultaGenerica.js";
import type { ValorContador } from "../src/libreriaCaptura/Impresoras/AbstractConsultaImpresora.js";
import { Impresora } from "../src/libreriaCaptura/Impresoras/Impresora.js";
import { OidsGenericos } from "../src/libreriaCaptura/Oids/OidsEspecificos/OidsGenericos.js";

/** Expone el método protegido para poder probarlo directamente. */
class ConsultaExpuesta extends ConsultaGenerica {
    porcentaje(capacidad: ValorContador, nivel: ValorContador): number | undefined {
        return this.calcularPorcentaje(capacidad, nivel);
    }
}

const consulta = new ConsultaExpuesta(new Impresora("1.1.1.1"), new OidsGenericos());

describe("calcularPorcentaje", () => {

    it("calcula el porcentaje de un nivel normal", () => {
        assert.equal(consulta.porcentaje(100, 55), 55);
        assert.equal(consulta.porcentaje(5000, 2500), 50);
    });

    it("conserva el 0: una impresora vacía de verdad debe aparecer vacía", () => {
        assert.equal(consulta.porcentaje(100, 0), 0);
        assert.equal(consulta.porcentaje(5000, 0), 0);
    });

    it("sin capacidad o sin nivel no hay dato", () => {
        assert.equal(consulta.porcentaje(undefined, 50), undefined);
        assert.equal(consulta.porcentaje(100, undefined), undefined);
    });

    it("una capacidad no positiva (-1 sin restricción, -2 desconocida, 0) no es un dato", () => {
        assert.equal(consulta.porcentaje(-1, 40), undefined);
        assert.equal(consulta.porcentaje(-2, 40), undefined);
        assert.equal(consulta.porcentaje(0, 40), undefined);
    });

    it("valores no numéricos no son un dato", () => {
        assert.equal(consulta.porcentaje(100, "abc"), undefined);
        assert.equal(consulta.porcentaje("abc", 50), undefined);
    });

    describe("valores especiales de nivel de la Printer-MIB (RFC 3805)", () => {

        for (const [codigo, significado] of [[-1, "otro"], [-2, "desconocido"], [-3, "queda algo, sin precisión"]] as const) {
            it(`nivel ${codigo} («${significado}») no es un porcentaje`, () => {
                assert.equal(consulta.porcentaje(100, codigo), undefined);
            });
        }

        it("con capacidad grande, un nivel desconocido no se convierte en un «0 %» falso", () => {
            // (-2 / 5000) × 100 = -0,04 → Math.round → -0 → se mostraría como "0" (vacío)
            assert.equal(consulta.porcentaje(5000, -2), undefined);
            assert.equal(consulta.porcentaje(5000, -3), undefined);
        });
    });

    it("limita a 100 un nivel mayor que la capacidad", () => {
        assert.equal(consulta.porcentaje(100, 150), undefined);
    });
    
});
