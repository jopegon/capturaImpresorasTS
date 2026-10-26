import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ConsultaBizhub5020i } from "../src/libreriaCaptura/Impresoras/ConsultaBizhub5020i.js";
import { ConsultaGenerica } from "../src/libreriaCaptura/Impresoras/ConsultaGenerica.js";
import { ConsultaL6910DN } from "../src/libreriaCaptura/Impresoras/ConsultaL6910DN.js";
import { Impresora } from "../src/libreriaCaptura/Impresoras/Impresora.js";
import type { IOidsIniciales } from "../src/libreriaCaptura/Oids/IOidsIniciales.js";
import { OperacionesPerfiles } from "../src/libreriaCaptura/PerfilesImpresoras/OperacionesPerfiles.js";

const OID_VALIDO = /^\d+(\.\d+)+$/;
const operaciones = new OperacionesPerfiles();

function consultaDe(modelo: string) {
    const impresora = new Impresora("1.1.1.1");
    impresora.modelo = modelo;
    return operaciones.getConsulta(impresora);
}

/** Los OID son un detalle interno (protegido): se leen solo para verificar el registro. */
function oidsDe(modelo: string): IOidsIniciales {
    return (consultaDe(modelo) as unknown as { oids: IOidsIniciales }).oids;
}

describe("registro de perfiles", () => {

    const modelos = operaciones.knownModels();

    it("tiene modelos registrados", () => {
        assert.ok(modelos.length > 0);
    });

    it("la Brother MFC-L6910DN usa su consulta especializada", () => {
        assert.ok(consultaDe("Brother MFC-L6910DN series") instanceof ConsultaL6910DN);
    });

    it("la Konica Minolta bizhub 5020i usa su consulta especializada", () => {
        assert.ok(consultaDe("KONICA MINOLTA bizhub 5020i") instanceof ConsultaBizhub5020i);
    });

    it("un modelo no registrado usa la consulta genérica con los OID estándar", () => {
        const consulta = consultaDe("Modelo desconocido XYZ");

        assert.ok(consulta instanceof ConsultaGenerica);
        assert.equal(oidsDe("Modelo desconocido XYZ").listaOids.length, 10);
    });

    it("un modelo vacío usa la consulta genérica", () => {
        assert.ok(consultaDe("") instanceof ConsultaGenerica);
    });

    for (const modelo of modelos) {

        describe(modelo, () => {

            it("todos sus OID son numéricos válidos", () => {
                // Un OID inválido hace que net-snmp lance «argument is not a valid OID string»
                // y se pierde la consulta ENTERA de la impresora.
                for (const oid of oidsDe(modelo).listaOids) {
                    assert.match(oid, OID_VALIDO, `OID inválido: ${oid}`);
                }
            });

            it("la lista de OID no tiene duplicados", () => {
                const lista = oidsDe(modelo).listaOids;
                assert.equal(new Set(lista).size, lista.length, `error en ${lista.toString()}`);
            });

            it("pide al menos el número de serie y el contador de páginas", () => {
                const oids = oidsDe(modelo);

                assert.ok(oids.listaOids.includes(oids.oidNumeroDeSerie), "falta el número de serie");
                assert.ok(oids.listaOids.includes(oids.oidContadorImpresiones), "falta el contador");
            });
        });
    }
});
