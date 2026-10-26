import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as snmp from "net-snmp";
import type { ValorSnmp } from "../src/libreriaCaptura/Impresoras/AbstractConsultaImpresora.js";
import { ConsultaBizhub5020i } from "../src/libreriaCaptura/Impresoras/ConsultaBizhub5020i.js";
import { ConsultaGenerica } from "../src/libreriaCaptura/Impresoras/ConsultaGenerica.js";
import { ConsultaL6910DN } from "../src/libreriaCaptura/Impresoras/ConsultaL6910DN.js";
import { Impresora } from "../src/libreriaCaptura/Impresoras/Impresora.js";
import { Oids5020i } from "../src/libreriaCaptura/Oids/OidsEspecificos/Oids5020i.js";
import { OidsGenericos } from "../src/libreriaCaptura/Oids/OidsEspecificos/OidsGenericos.js";
import { OidsL6910 } from "../src/libreriaCaptura/Oids/OidsEspecificos/OidsL6910DN.js";

/** Expone los métodos protegidos de la consulta genérica. */
class GenericaExpuesta extends ConsultaGenerica {
    mapa(varbinds: snmp.Varbind[]): Map<string, ValorSnmp> { return this.varbindsToMap(varbinds); }
    serie(resultados: Map<string, ValorSnmp>): void { this.setNumeroSerie(resultados); }
    get oidSerie(): string { return this.oids.oidNumeroDeSerie; }
}

class KonicaExpuesta extends ConsultaBizhub5020i {
    // La firma de ConsultaBizhub5020i.setNivelNegro sigue siendo Map<string, string | number>
    nivelNegro(valor: string | number): void { this.setNivelNegro(new Map([[this.oids.oidTonerLevelNegro, valor]])); }
}

class BrotherExpuesta extends ConsultaL6910DN {
    nivelNegro(valor: ValorSnmp): void { this.setNivelNegro(new Map([[this.oids.oidTonerLevelNegro, valor]])); }
}

/** Blob binario de ejemplo del OID privado de Brother: marcador 81 01 04 00 00 00 + porcentaje + relleno. */
function blobBrother(porcentaje: number): Buffer {
    return Buffer.from([0x01, 0x02, 0x81, 0x01, 0x04, 0x00, 0x00, 0x00, porcentaje, 0xff]);
}

describe("número de serie (OctetString)", () => {

    it("varbindsToMap conserva el Buffer tal como lo entrega net-snmp", () => {
        const consulta = new GenericaExpuesta(new Impresora("1.1.1.1"), new OidsGenericos());
        const valor = Buffer.from("J5T12345678");
        const mapa = consulta.mapa([{ oid: consulta.oidSerie, type: snmp.ObjectType.OctetString, value: valor }]);

        assert.ok(Buffer.isBuffer(mapa.get(consulta.oidSerie)));
    });

    it("el número de serie se guarda como texto, no como hexadecimal", () => {
        const impresora = new Impresora("1.1.1.1");
        const consulta = new GenericaExpuesta(impresora, new OidsGenericos());
        const mapa = consulta.mapa([
            { oid: consulta.oidSerie, type: snmp.ObjectType.OctetString, value: Buffer.from("J5T12345678") },
        ]);

        consulta.serie(mapa);

        assert.equal(impresora.numeroDeSerie, "J5T12345678");
    });

    it("descarta los varbinds con error (noSuchObject)", () => {
        const consulta = new GenericaExpuesta(new Impresora("1.1.1.1"), new OidsGenericos());
        const mapa = consulta.mapa([
            { oid: consulta.oidSerie, type: snmp.ObjectType.NoSuchObject, value: null } as unknown as snmp.Varbind,
        ]);

        assert.equal(mapa.size, 0);
    });
});

describe("Konica Minolta bizhub 5020i: el OID ya devuelve un porcentaje", () => {

    const casos: [string, string | number, number | undefined][] = [
        ["55 es un porcentaje válido", 55, 55],
        ["0 es un vacío real", 0, 0],
        ["100 es el máximo válido", 100, 100],
        ["-2 (desconocido) no es un dato", -2, undefined],
        ["140 (fuera de rango) no es un dato", 140, undefined],
        ["un texto no numérico no es un dato (antes: NaN)", "abc", undefined],
    ];

    for (const [descripcion, valor, esperado] of casos) {
        it(descripcion, () => {
            const impresora = new Impresora("1.1.1.1");
            new KonicaExpuesta(impresora, new Oids5020i()).nivelNegro(valor);

            assert.equal(impresora.negro, esperado);
        });
    }
});

describe("Brother MFC-L6910DN: nivel de tóner en un blob binario", () => {

    it("extrae el porcentaje tras el marcador cuando llega como Buffer", () => {
        const impresora = new Impresora("1.1.1.1");
        new BrotherExpuesta(impresora, new OidsL6910()).nivelNegro(blobBrother(55));

        assert.equal(impresora.negro, 55);
    });

    it("también acepta el blob ya convertido a hexadecimal", () => {
        const impresora = new Impresora("1.1.1.1");
        new BrotherExpuesta(impresora, new OidsL6910()).nivelNegro(blobBrother(37).toString("hex"));

        assert.equal(impresora.negro, 37);
    });

    it("un blob sin el marcador no es un dato", () => {
        const impresora = new Impresora("1.1.1.1");
        new BrotherExpuesta(impresora, new OidsL6910()).nivelNegro(Buffer.from([0x01, 0x02, 0x03, 0x04]));

        assert.equal(impresora.negro, undefined);
    });

    it("un porcentaje mayor que 100 no es un dato", () => {
        const impresora = new Impresora("1.1.1.1");
        new BrotherExpuesta(impresora, new OidsL6910()).nivelNegro(blobBrother(200));

        assert.equal(impresora.negro, undefined);
    });

    it("parseBrotherBlackToner rechaza cadenas vacías, impares o no hexadecimales", () => {
        const consulta = new BrotherExpuesta(new Impresora("1.1.1.1"), new OidsL6910());

        assert.equal(consulta.parseBrotherBlackToner(""), null);
        assert.equal(consulta.parseBrotherBlackToner("abc"), null);
        assert.equal(consulta.parseBrotherBlackToner("zz"), null);
    });
});
