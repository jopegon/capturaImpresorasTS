import { Oids1606dn } from "./OidsEspecificos/Oids1606dn.js";
import { Oids28BW5e } from "./OidsEspecificos/Oids28BW5e.js";
import { Oids5020i } from "./OidsEspecificos/Oids5020i.js";
import { Oids_HP_E52645 } from "./OidsEspecificos/Oids_HP_E52645.js";
import { OidsB430 } from "./OidsEspecificos/OidsB430.js";
import { OidsC405 } from "./OidsEspecificos/OidsC405.js";
import { OidsC8800 } from "./OidsEspecificos/OidsC8800.js";
import { OidsEpsonM4000 } from "./OidsEspecificos/OidsEpsonM4000.js";
import { OidsKyoceraTodas } from "./OidsEspecificos/OidsKyoceraTodas.js";
import { OidsL6910 } from "./OidsEspecificos/OidsL6910DN.js";
import { OidsMXB427PW } from "./OidsEspecificos/OidsMXB427PW.js";
import { OidIniciales } from "./OidsIniciales.js";



export class ConstructorOids {

    /*
    Esta clase se encarga de obtener el objeto de datos iniciales
    con las particularidades de cada modelo de impresora
    */

    MapaObjetos = new Map<string, OidIniciales>([
        ["B430", new OidsB430()],
        ["EPSON AL-M4000", new OidsEpsonM4000()],
        ["KONICA MINOLTA bizhub 5020i", new Oids5020i()],
        ["Xerox VersaLink C405 DN Multifunction Printer", new OidsC405()],
        ["HP LaserJet Professional P1606dn", new Oids1606dn()],
        ["HP LaserJet Flow MFP E52645", new Oids_HP_E52645()],
        ["C8800", new OidsC8800()],
        ["ECOSYS M3655idn", new OidsKyoceraTodas()],
        ["ECOSYS MA5500ifx", new OidsKyoceraTodas()],
        ["FS-4200DN", new OidsKyoceraTodas()],
        ["d-COPIA 6001MF", new OidsKyoceraTodas()],
        ["Generic 28BW-5e", new Oids28BW5e()],
        ["SHARP MX-B427PW", new OidsMXB427PW()],
        ["Brother MFC-L6910DN series", new OidsL6910()]
    ]);




    /**
     * Obtiene los OID iniciales correspondientes al modelo de impresora.
     *
     * Si no se especifica ningún modelo, devuelve una configuración de OID vacía.
     * Si el modelo no está registrado en el mapa, devuelve la configuración genérica.
     *
     * @param modelo Modelo de la impresora. Es opcional.
     * @returns Los OID iniciales asociados al modelo o una configuración genérica.
     */
    OidsInicialesDe(modelo?: string): OidIniciales {

        
        // Para el caso en el que no se proporciona ningún parámetro
        if (!modelo) {
            return new OidIniciales();
        }

        // Si no encuentra el modelo, devuelve la configuración genérica
        console.log(` el modelo es  ${this.MapaObjetos.get(modelo)?.oidTonerLevelCyan}`)
        return this.MapaObjetos.get(modelo) ?? new OidIniciales();
    }





}