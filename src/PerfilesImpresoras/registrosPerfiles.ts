
import { AbstractConsultaImpresora } from "../Impresoras/AbstractConsultaImpresora.js";
import { ConsultaBizhub5020i } from "../Impresoras/ConsultaBizhub5020i.js";
import { ConsultaGenerica } from "../Impresoras/ConsultaGenerica.js";
import { ConsultaL6910DN } from "../Impresoras/ConsultaL6910DN.js";
import { Impresora } from "../Impresoras/Impresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import { Oids1606dn } from "../Oids/OidsEspecificos/Oids1606dn.js";
import { Oids28BW5e } from "../Oids/OidsEspecificos/Oids28BW5e.js";
import { Oids5020i } from "../Oids/OidsEspecificos/Oids5020i.js";
import { Oids_HP_E52645 } from "../Oids/OidsEspecificos/Oids_HP_E52645.js";
import { OidsB430 } from "../Oids/OidsEspecificos/OidsB430.js";
import { OidsC405 } from "../Oids/OidsEspecificos/OidsC405.js";
import { OidsC8800 } from "../Oids/OidsEspecificos/OidsC8800.js";
import { OidsEpsonM4000 } from "../Oids/OidsEspecificos/OidsEpsonM4000.js";
import { OidsKyoceraTodas } from "../Oids/OidsEspecificos/OidsKyoceraTodas.js";
import { OidsL6910 } from "../Oids/OidsEspecificos/OidsL6910DN.js";
import { OidsM201dw } from "../Oids/OidsEspecificos/OidsM201dw.js";
import { OidsMXB427PW } from "../Oids/OidsEspecificos/OidsMXB427PW.js";
import { OidIniciales } from "../Oids/OidsIniciales.js";
import type { ConfigSnmp } from "../sessionSnmp/sesionSnmp.js";


export type TPerfilImpresora = {
    /** Factory de OIDs (se llama cuando ya se conoce el modelo) */
    oids: () => IOidsIniciales;

    /** Factory de la estrategia de consulta (puede especializar setNivelNegro, etc.) */
    consulta?: (impresora: Impresora) => AbstractConsultaImpresora;
};

const consultaDefault = (impresora: Impresora) => new ConsultaGenerica(impresora);

/** Perfil genérico cuando el modelo no está registrado */
export const perfilGenerico: TPerfilImpresora = {
    oids: () => new OidIniciales(),
    consulta: consultaDefault,

};

export const registroPerfiles = new Map<string, TPerfilImpresora>([

    ["B430",
        {
            oids: () => new OidsB430()
        }
    ],
    ["EPSON AL-M4000",
        {
            oids: () => new OidsEpsonM4000()
        }
    ],
    ["KONICA MINOLTA bizhub 5020i",
        {
            oids: () => new Oids5020i(),
            consulta: (imp) => new ConsultaBizhub5020i(imp),
        },
    ],
    ["Xerox VersaLink C405 DN Multifunction Printer",
        { oids: () => new OidsC405() }
    ],
    ["HP LaserJet Professional P1606dn", {
        oids: () => new Oids1606dn()
    }],
    ["HP LaserJet Flow MFP E52645",
        { oids: () => new Oids_HP_E52645() }
    ],
    ["HP LaserJet Pro M201dw",
        {
            oids: () => new OidsM201dw()
        }
    ],
    ["C8800",
        { oids: () => new OidsC8800() }
    ],
    ["ECOSYS M3655idn",
        { oids: () => new OidsKyoceraTodas() }
    ],
    ["ECOSYS MA5500ifx",
        { oids: () => new OidsKyoceraTodas() }
    ],
    ["FS-4200DN",
        { oids: () => new OidsKyoceraTodas() }
    ],
    ["d-COPIA 6001MF",
        { oids: () => new OidsKyoceraTodas() }
    ],
    ["Generic 28BW-5e",
        { oids: () => new Oids28BW5e() }
    ],
    ["SHARP MX-B427PW",
        { oids: () => new OidsMXB427PW() }
    ],
    ["Brother MFC-L6910DN series",
        { oids: () => new OidsL6910(), consulta: (imp) => new ConsultaL6910DN(imp) }]
]);