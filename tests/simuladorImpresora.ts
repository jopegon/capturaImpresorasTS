import * as dgram from "node:dgram";
import * as snmp from "net-snmp";
import type { IImpresora } from "../src/libreriaCaptura/Impresoras/IImpresora.js";
import type { ConfigSnmp } from "../src/libreriaCaptura/sessionSnmp/ConfigSnmp.js";
import {
    SessionSnmp,
    type VersionSnmp,
} from "../src/libreriaCaptura/sessionSnmp/SessionSnmp.js";
/**
 * Infraestructura de pruebas: una impresora SNMP simulada (agente de net-snmp con las tablas
 * reales de la Printer-MIB) y una «red» que redirige las sesiones de la aplicación hacia ella.
 *
 * No requiere permisos de administrador (usa puertos libres) ni modifica el código de producción.
 */

export interface Suministro {
    /** Posición en la prtMarkerSuppliesTable: 1 negro, 2 cyan, 3 magenta, 4 amarillo. */
    indice: number;
    capacidad: number;
    /** Nivel. Valores especiales de la Printer-MIB: -1 otro, -2 desconocido, -3 «queda algo». */
    nivel: number;
}

export interface OpcionesSimulador {
    modelo?: string;
    serie?: string;
    contador?: number;
    suministros?: Suministro[];
    /** Blob binario del OID privado de Brother (nivel de tóner negro). */
    blobBrother?: Buffer;
    /** Si es true, ignora los paquetes SNMPv2c, como una impresora que solo habla v1. */
    soloV1?: boolean;
}

export const SUMINISTROS_COLOR: Suministro[] = [
    { indice: 1, capacidad: 100, nivel: 55 },   // negro
    { indice: 2, capacidad: 100, nivel: 30 },   // cyan
    { indice: 3, capacidad: 100, nivel: 40 },   // magenta
    { indice: 4, capacidad: 100, nivel: 70 },   // amarillo
];

const OID_BROTHER_NIVEL_NEGRO = "1.3.6.1.4.1.2435.2.3.9.4.2.1.5.5.8";   // escalar: la instancia es «.0»

async function puertoLibre(): Promise<number> {
    const socket = dgram.createSocket("udp4");
    await new Promise<void>(resolve => socket.bind(0, "127.0.0.1", resolve));
    const puerto = socket.address().port;
    await new Promise<void>(resolve => socket.close(() => resolve()));
    return puerto;
}

/** Versión SNMP de un paquete: 0 = v1, 1 = v2c. */
function versionDelPaquete(mensaje: Buffer): number {
    let posicion = 1;                                                       // tras 0x30 (SEQUENCE)
    posicion += (mensaje[posicion]! & 0x80) ? 1 + (mensaje[posicion]! & 0x7f) : 1;
    return mensaje[posicion + 2]!;                                          // 0x02 0x01 <versión>
}

export class SimuladorImpresora {

    /** Latencia añadida a cada respuesta, en ms. Puede cambiarse durante el test. */
    retrasoMs = 0;

    private cerrado = false;

    private constructor(
        /** Puerto UDP en el que «escucha» la impresora. */
        readonly puerto: number,
        private readonly agente: any,
        private readonly proxy: dgram.Socket,
        private readonly salidas: Map<number, dgram.Socket>,
    ) { }

    static async iniciar(opciones: OpcionesSimulador = {}): Promise<SimuladorImpresora> {
        const {
            modelo = "Impresora de prueba",
            serie = "J5T12345678",
            contador = 12345,
            suministros = SUMINISTROS_COLOR,
        } = opciones;

        const puertoAgente = await puertoLibre();
        const puertoProxy = await puertoLibre();

        // --- Agente SNMP con las tablas de la Printer-MIB ---
        const agente: any = snmp.createAgent(
            { port: puertoAgente, accessControlModelType: snmp.AccessControlModelType.Simple },
            () => { },
        );
        const autorizador = agente.getAuthorizer();
        autorizador.addCommunity("public");
        autorizador.getAccessControlModel().setCommunityAccess("public", snmp.AccessLevel.ReadOnly);

        const mib = agente.getMib();
        const SOLO_LECTURA = snmp.MaxAccess["read-only"];
        const NO_ACCESIBLE = snmp.MaxAccess["not-accessible"];
        const T = snmp.ObjectType;

        const tabla = (nombre: string, oid: string, columnas: [number, string, number][],
            indice: string[], filas: (string | number)[][]): void => {
            mib.registerProvider({
                name: nombre,
                type: snmp.MibProviderType.Table,
                oid,
                maxAccess: NO_ACCESIBLE,
                tableColumns: columnas.map(([number, name, type]) => ({ number, name, type, maxAccess: SOLO_LECTURA })),
                tableIndex: indice.map(columnName => ({ columnName })),
            });
            filas.forEach(fila => mib.addTableRow(nombre, fila));
        };

        tabla("hrDevice", "1.3.6.1.2.1.25.3.2.1",
            [[1, "hrDeviceIndex", T.Integer], [3, "hrDeviceDescr", T.OctetString]],
            ["hrDeviceIndex"], [[1, modelo]]);

        tabla("prtGeneral", "1.3.6.1.2.1.43.5.1.1",
            [[1, "prtGeneralIndex", T.Integer], [17, "prtGeneralSerialNumber", T.OctetString]],
            ["prtGeneralIndex"], [[1, serie]]);

        tabla("prtMarker", "1.3.6.1.2.1.43.10.2.1",
            [[1, "prtMarkerDev", T.Integer], [2, "prtMarkerIndex", T.Integer], [4, "prtMarkerLifeCount", T.Counter32]],
            ["prtMarkerDev", "prtMarkerIndex"], [[1, 1, contador]]);

        tabla("prtSupplies", "1.3.6.1.2.1.43.11.1.1",
            [[1, "prtSuppliesDev", T.Integer], [2, "prtSuppliesIndex", T.Integer],
            [8, "prtSuppliesMaxCapacity", T.Integer], [9, "prtSuppliesLevel", T.Integer]],
            ["prtSuppliesDev", "prtSuppliesIndex"],
            suministros.map(s => [1, s.indice, s.capacidad, s.nivel]));

        if (opciones.blobBrother) {
            mib.registerProvider({
                name: "brotherNivelNegro",
                type: snmp.MibProviderType.Scalar,
                oid: OID_BROTHER_NIVEL_NEGRO,
                scalarType: T.OctetString,
                maxAccess: SOLO_LECTURA,
            });
            mib.setScalarValue("brotherNivelNegro", opciones.blobBrother);
        }

        // --- Proxy delante del agente: añade latencia y puede filtrar v2c ---
        const proxy = dgram.createSocket("udp4");
        const salidas = new Map<number, dgram.Socket>();
        const simulador = new SimuladorImpresora(puertoProxy, agente, proxy, salidas);

        proxy.on("message", (mensaje, cliente) => {
            if (opciones.soloV1 && versionDelPaquete(mensaje) !== 0) {
                return;                                                     // un agente solo-v1 ignora v2c
            }

            let salida = salidas.get(cliente.port);
            if (!salida) {
                salida = dgram.createSocket("udp4");
                salidas.set(cliente.port, salida);
                salida.on("message", respuesta => {
                    setTimeout(() => {
                        if (!simulador.cerrado) {
                            proxy.send(respuesta, cliente.port, cliente.address);
                        }
                    }, simulador.retrasoMs).unref();
                });
            }
            salida.send(mensaje, puertoAgente, "127.0.0.1");
        });

        await new Promise<void>(resolve => proxy.bind(puertoProxy, "127.0.0.1", resolve));
        await new Promise<void>(resolve => setTimeout(resolve, 50));        // el agente termina de arrancar
        return simulador;
    }

    async cerrar(): Promise<void> {
        this.cerrado = true;
        this.salidas.forEach(socket => socket.close());
        await new Promise<void>(resolve => this.proxy.close(() => resolve()));
        await new Promise<void>(resolve => this.agente.close(() => resolve()));
    }
}

/**
 * Red simulada: redirige las sesiones SNMP de la aplicación hacia los simuladores.
 *
 * Cada IP «lógica» se asocia a un simulador; una IP sin asociar (o desconectada) no contesta nunca.
 * Registra además el «timeout/reintentos» de cada sesión abierta.
 */
export class RedSimulada {

    /** Un elemento «timeout/reintentos» por cada sesión SNMP abierta. */
    readonly sesiones: string[] = [];

    private readonly destinos = new Map<string, number>();
    private readonly original = SessionSnmp.prototype.crearSesion;

    private constructor(private readonly silencio: dgram.Socket, private readonly puertoMudo: number) {
        const red = this;
        const original = this.original;

        SessionSnmp.prototype.crearSesion = function (
            this: SessionSnmp,
            impresora: IImpresora,
            version?: VersionSnmp,
            config?: Readonly<ConfigSnmp>,
        ) {
            const configuracion = config ?? this.configSnmp;
            red.sesiones.push(`${configuracion.timeout}/${configuracion.retries}`);

            const destino = Object.assign(Object.create(impresora) as IImpresora, { ip: "127.0.0.1" });
            return original.call(
                this,
                destino,
                version ?? impresora.versionSnmp,
                { ...configuracion, port: red.destinos.get(impresora.ip) ?? red.puertoMudo },
            );
        };
    }

    static async iniciar(): Promise<RedSimulada> {
        const puertoMudo = await puertoLibre();
        const silencio = dgram.createSocket("udp4");
        await new Promise<void>(resolve => silencio.bind(puertoMudo, "127.0.0.1", resolve));
        silencio.on("message", () => { /* nadie contesta */ });
        return new RedSimulada(silencio, puertoMudo);
    }

    conectar(ip: string, simulador: SimuladorImpresora): void {
        this.destinos.set(ip, simulador.puerto);
    }

    /** La impresora «se apaga»: deja de contestar. */
    desconectar(ip: string): void {
        this.destinos.delete(ip);
    }

    reiniciarRegistro(): void {
        this.sesiones.length = 0;
    }

    async cerrar(): Promise<void> {
        SessionSnmp.prototype.crearSesion = this.original;
        await new Promise<void>(resolve => this.silencio.close(() => resolve()));
    }
}

/** Arranca un simulador, ejecuta el cuerpo del test y lo cierra siempre. */
export async function conSimulador<T>(
    opciones: OpcionesSimulador,
    cuerpo: (simulador: SimuladorImpresora) => Promise<T>,
): Promise<T> {
    const simulador = await SimuladorImpresora.iniciar(opciones);
    try {
        return await cuerpo(simulador);
    } finally {
        await simulador.cerrar();
    }
}
