import type { AbstractConsultaImpresora } from "../Impresoras/AbstractConsultaImpresora.js";
import { ConsultaGenerica } from "../Impresoras/ConsultaGenerica.js";
import type { Impresora } from "../Impresoras/Impresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import { perfilGenerico, registroPerfiles, type TPerfilImpresora } from "./registrosPerfiles.js";


export class OperacionesPerfiles {
    get(modelo?: string): TPerfilImpresora {
        if (!modelo) return perfilGenerico;
        return registroPerfiles.get(modelo) ?? perfilGenerico;
    }

    getOids(modelo: string): IOidsIniciales {
        return (registroPerfiles.get(modelo) ?? perfilGenerico).oids();
    }

    getConsulta(impresora: Impresora): AbstractConsultaImpresora {
        return registroPerfiles.get(impresora.modelo)?.consulta?.(impresora) ?? new ConsultaGenerica(impresora);
    }

    /** Útil para tests o para listar modelos soportados */
    knownModels(): string[] {
        return [...registroPerfiles.keys()];
    }
}