import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import * as snmp from "net-snmp";
import { Impresora } from "../src/libreriaCaptura/Impresoras/Impresora.js";
import { ServicioCaptura } from "../src/libreriaCaptura/servicioCaptura/ServicioCaptura.js";
import { conSimulador, RedSimulada, SUMINISTROS_COLOR, type Suministro } from "./simuladorImpresora.js";

/**
 * Pruebas de extremo a extremo: identificación → perfil → consulta → datos,
 * contra una impresora SNMP simulada (ver simuladorImpresora.ts).
 */
describe("ServicioCaptura (impresora simulada)", () => {

    let red: RedSimulada;

    before(async () => { red = await RedSimulada.iniciar(); });
    after(async () => { await red.cerrar(); });

    describe("una impresora", () => {

        it("identifica y lee todos los datos", async () => {
            await conSimulador({ serie: "J5T12345678", contador: 12345 }, async simulador => {
                red.conectar("10.0.0.1", simulador);

                const impresora = await new ServicioCaptura(300, 1)
                    .capturaImpresora(new Impresora("10.0.0.1", "Despacho 1"));

                assert.equal(impresora.conectada, true);
                assert.equal(impresora.modelo, "Impresora de prueba");
                assert.equal(impresora.versionSnmp, snmp.Version2c);
                assert.equal(impresora.numeroDeSerie, "J5T12345678");
                assert.equal(impresora.contador, 12345);
                assert.equal(impresora.negro, 55);
                assert.equal(impresora.cyan, 30);
                assert.equal(impresora.magenta, 40);
                assert.equal(impresora.amarillo, 70);
                assert.equal(impresora.color, true);
            });
        });

        it("un tóner «desconocido» (-2) no se guarda como dato ni cuenta como color", async () => {
            const suministros: Suministro[] = SUMINISTROS_COLOR.map(s => s.indice === 2 ? { ...s, nivel: -2 } : s);

            await conSimulador({ suministros }, async simulador => {
                red.conectar("10.0.0.2", simulador);

                const impresora = await new ServicioCaptura(300, 1).capturaImpresora(new Impresora("10.0.0.2"));

                assert.equal(impresora.cyan, undefined);
                assert.notEqual(impresora.color, true);
                assert.equal(impresora.negro, 55);                          // lo demás se lee con normalidad
            });
        });

        it("un tóner vacío de verdad (0) sí es un dato", async () => {
            const suministros: Suministro[] = SUMINISTROS_COLOR.map(s => s.indice === 1 ? { ...s, nivel: 0 } : s);

            await conSimulador({ suministros }, async simulador => {
                red.conectar("10.0.0.3", simulador);

                const impresora = await new ServicioCaptura(300, 1).capturaImpresora(new Impresora("10.0.0.3"));

                assert.equal(impresora.negro, 0);
            });
        });

        it("Brother MFC-L6910DN: lee el nivel de tóner del blob binario", async () => {
            const blobBrother = Buffer.from([0x01, 0x81, 0x01, 0x04, 0x00, 0x00, 0x00, 55, 0xff]);

            await conSimulador({ modelo: "Brother MFC-L6910DN series", serie: "BRO123", blobBrother }, async simulador => {
                red.conectar("10.0.0.4", simulador);

                const impresora = await new ServicioCaptura(300, 1).capturaImpresora(new Impresora("10.0.0.4"));

                assert.equal(impresora.conectada, true);
                assert.equal(impresora.numeroDeSerie, "BRO123");
                assert.equal(impresora.negro, 55);
            });
        });

        it("una impresora que solo habla SNMPv1 se identifica y se consulta con v1", async () => {
            await conSimulador({ soloV1: true, serie: "V1-0001" }, async simulador => {
                red.conectar("10.0.0.5", simulador);

                const impresora = await new ServicioCaptura(300, 1).capturaImpresora(new Impresora("10.0.0.5"));

                assert.equal(impresora.conectada, true);
                assert.equal(impresora.versionSnmp, snmp.Version1);
                assert.equal(impresora.numeroDeSerie, "V1-0001");
                assert.equal(impresora.negro, 55);
            });
        });

        it("una impresora muda queda como desconectada, sin lanzar y sin tardar demasiado", async () => {
            const inicio = Date.now();

            const impresora = await new ServicioCaptura(150, 0).capturaImpresora(new Impresora("10.0.0.99"));

            assert.equal(impresora.conectada, false);
            assert.equal(impresora.modelo, "");
            assert.ok(Date.now() - inicio < 3000, "tardó demasiado en rendirse");
        });

        it("conserva la IP y la localización", async () => {
            await conSimulador({}, async simulador => {
                red.conectar("10.0.0.6", simulador);

                const impresora = await new ServicioCaptura(300, 1)
                    .capturaImpresora(new Impresora("10.0.0.6", "Pasillo 2"));

                assert.equal(impresora.ip, "10.0.0.6");
                assert.equal(impresora.localizacion, "Pasillo 2");
            });
        });
    });

    describe("varias impresoras a la vez", () => {

        it("16 impresoras distintas en paralelo devuelven 16 resultados distintos y en orden", async () => {
            await conSimulador({ serie: "J5T12345678" }, async simulador => {
                const entrada = Array.from({ length: 16 }, (_, i) => {
                    const ip = `10.0.1.${i + 1}`;
                    red.conectar(ip, simulador);
                    return new Impresora(ip, `Impresora ${i + 1}`);
                });

                const salida = await new ServicioCaptura(300, 1).capturaListaImpresoras(entrada);

                assert.equal(new Set(salida).size, 16, "se devolvió el mismo objeto más de una vez");
                salida.forEach((resultado, i) => assert.equal(resultado, entrada[i], `posición ${i}`));
                entrada.forEach((impresora, i) => {
                    assert.equal(impresora.conectada, true, `impresora ${i + 1} sin conectar`);
                    assert.equal(impresora.numeroDeSerie, "J5T12345678", `impresora ${i + 1} sin serie`);
                    assert.equal(impresora.negro, 55, `impresora ${i + 1} sin tóner`);
                });
            });
        });

        it("una impresora apagada no impide capturar las demás", async () => {
            await conSimulador({}, async simulador => {
                red.conectar("10.0.2.1", simulador);
                red.conectar("10.0.2.3", simulador);
                const entrada = [new Impresora("10.0.2.1"), new Impresora("10.0.2.2"), new Impresora("10.0.2.3")];

                await new ServicioCaptura(150, 0).capturaListaImpresoras(entrada);

                assert.deepEqual(entrada.map(i => i.conectada), [true, false, true]);
            });
        });
    });

    describe("recapturar el mismo objeto", () => {

        it("si la impresora ya no responde, no conserva los datos de la captura anterior", async () => {
            await conSimulador({ serie: "J5T12345678" }, async simulador => {
                red.conectar("10.0.3.1", simulador);
                const servicio = new ServicioCaptura(150, 0);
                const impresora = new Impresora("10.0.3.1", "Archivo");

                await servicio.capturaImpresora(impresora);
                assert.equal(impresora.conectada, true, "precondición: la primera captura debe funcionar");

                red.desconectar("10.0.3.1");                                // la impresora se apaga
                const segunda = await servicio.capturaImpresora(impresora);

                assert.equal(segunda.conectada, false);
                assert.equal(segunda.modelo, "");
                assert.equal(segunda.numeroDeSerie, "");
                assert.equal(segunda.negro, undefined);
                assert.equal(segunda.ip, "10.0.3.1");                       // lo que no se lee, se conserva
                assert.equal(segunda.localizacion, "Archivo");
            });
        });

        it("si vuelve a responder, se capturan los datos nuevos", async () => {
            await conSimulador({ serie: "NUEVA-01" }, async simulador => {
                const servicio = new ServicioCaptura(150, 0);
                const impresora = new Impresora("10.0.3.2");

                await servicio.capturaImpresora(impresora);                 // apagada
                assert.equal(impresora.conectada, false);

                red.conectar("10.0.3.2", simulador);                        // se enciende
                await servicio.capturaImpresora(impresora);

                assert.equal(impresora.conectada, true);
                assert.equal(impresora.numeroDeSerie, "NUEVA-01");
            });
        });
    });

    describe("tiempos de espera", () => {

        for (const [timeout, reintentos] of [[300, 1], [300, 0], [200, 2]] as const) {
            it(`ServicioCaptura(${timeout}, ${reintentos}): todas las sesiones usan ${timeout}/${reintentos}`, async () => {
                await conSimulador({}, async simulador => {
                    red.conectar("10.0.4.1", simulador);
                    red.reiniciarRegistro();

                    await new ServicioCaptura(timeout, reintentos).capturaImpresora(new Impresora("10.0.4.1"));

                    assert.ok(red.sesiones.length >= 2, "debería abrir al menos una sesión de identificación y otra de datos");
                    assert.deepEqual([...new Set(red.sesiones)], [`${timeout}/${reintentos}`]);
                });
            });
        }

        it("tolera una latencia dentro de la ventana timeout × (reintentos + 1)", async () => {
            await conSimulador({}, async simulador => {
                red.conectar("10.0.4.2", simulador);
                simulador.retrasoMs = 200;                                  // ventana = 300 × 2 = 600 ms

                const impresora = await new ServicioCaptura(300, 1).capturaImpresora(new Impresora("10.0.4.2"));

                assert.equal(impresora.conectada, true);
            });
        });

        it("da por desconectada una impresora más lenta que la ventana", async () => {
            await conSimulador({}, async simulador => {
                red.conectar("10.0.4.3", simulador);
                simulador.retrasoMs = 900;                                  // ventana = 300 × 2 = 600 ms

                const impresora = await new ServicioCaptura(300, 1).capturaImpresora(new Impresora("10.0.4.3"));

                assert.equal(impresora.conectada, false);
            });
        });
    });
});
