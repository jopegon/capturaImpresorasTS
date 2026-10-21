
import { AbstractConsultaImpresora } from "../Impresoras/AbstractConsultaImpresora.js";
import { ConsultaBizhub5020i } from "../Impresoras/ConsultaBizhub5020i.js";
import { ConsultaGenerica } from "../Impresoras/ConsultaGenerica.js";
import { ConsultaL6910DN } from "../Impresoras/ConsultaL6910DN.js";
import { Impresora } from "../Impresoras/Impresora.js";
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
import { OidsGenericos } from "../Oids/OidsEspecificos/OidsGenericos.js";
import type { ConfigSnmp } from "../sessionSnmp/sesionSnmp.js";


export type TPerfilImpresora = {

    /** Factory de la estrategia de consulta (puede especializar setNivelNegro, etc.) */
    consulta: (impresora: Impresora) => AbstractConsultaImpresora;
};

const consultaDefault = (impresora: Impresora) => new ConsultaGenerica(impresora, new OidsGenericos);

/** Perfil genérico cuando el modelo no está registrado */
export const perfilGenerico: TPerfilImpresora = {

    consulta: consultaDefault,

};

export const registroPerfiles = new Map<string, TPerfilImpresora>([

    ["B430",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsB430())
        }
    ],
    ["EPSON AL-M4000",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsEpsonM4000())
        }
    ],
    ["KONICA MINOLTA bizhub 5020i",
        {
            consulta: (imp) => new ConsultaBizhub5020i(imp, new Oids5020i()),
        },
    ],
    ["Xerox VersaLink C405 DN Multifunction Printer",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsC405())
        }
    ],
    ["HP LaserJet Professional P1606dn",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new Oids1606dn())
        }
    ],
    ["HP LaserJet Flow MFP E52645",
        { 
            consulta: (imp) => new ConsultaGenerica(imp, new Oids_HP_E52645()) 
        }
    ],
    ["HP LaserJet Pro M201dw",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsM201dw())
        }
    ],
    ["C8800",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsC8800())
        }
    ],
    ["ECOSYS M3655idn",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsKyoceraTodas())
        }
    ],
    ["ECOSYS MA5500ifx",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsKyoceraTodas())
        }
    ],
    ["FS-4200DN",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsKyoceraTodas())
        }
    ],
    ["d-COPIA 6001MF",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsKyoceraTodas())
        }
    ],
    ["Generic 28BW-5e",
        {
            consulta: (imp) => new ConsultaGenerica(imp, new Oids28BW5e())
        }
    ],
    ["SHARP MX-B427PW",

        {
            consulta: (imp) => new ConsultaGenerica(imp, new OidsMXB427PW())
        }
    ],
    ["Brother MFC-L6910DN series",
        {
            consulta: (imp) => new ConsultaL6910DN(imp, new OidsL6910())
        }]
]);