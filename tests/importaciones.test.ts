import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const ejecutar = promisify(execFile);
// ANTES (Subía dos niveles y se salía del proyecto)
// const raizProyecto = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// AHORA (Sube un solo nivel desde la carpeta "tests")
const raizProyecto = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");


const libreria = path.join(raizProyecto, "src/libreriaCaptura");

/**
 * Cada módulo se importa en un proceso nuevo y vacío, siendo el PRIMERO que se carga.
 * Un ciclo de importaciones entre módulos que dependan del orden de carga lanza
 * «ReferenceError: Cannot access ... before initialization» (y hace imposible escribir tests).
 */
const modulos = [
    "Impresoras/AbstractConsultaImpresora",
    "Impresoras/ConsultaGenerica",
    "Impresoras/ConsultaL6910DN",
    "Impresoras/ConsultaBizhub5020i",
    "Impresoras/IdentificadorImpresora",
    "PerfilesImpresoras/registrosPerfiles",
    "PerfilesImpresoras/OperacionesPerfiles",
    "servicioCaptura/ServicioCaptura",
    "sessionSnmp/SessionSnmp",
];

describe("importaciones sin ciclos", () => {

    for (const modulo of modulos) {
        it(`se puede importar ${modulo} el primero`, async () => {
            const url = pathToFileURL(path.join(libreria, `${modulo}.js`)).href;

            await assert.doesNotReject(
                ejecutar(
                    process.execPath,
                    ["--import", "tsx", "--input-type=module", "-e", "await import(process.argv[1])", url],
                    { cwd: raizProyecto },
                ),
                `ciclo de importaciones al cargar ${modulo} el primero`,
            );
        });
    }
});
