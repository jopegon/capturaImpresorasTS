import  { ClientOptions } from "../ClientOptions/ClientOptions.js";
import type { AbstractConsultaImpresora } from "../Impresoras/AbstractConsultaImpresora.js";
import { ConsultaGenerica } from "../Impresoras/ConsultaGenerica.js";
import type { Impresora } from "../Impresoras/Impresora.js";
import type { IOidsIniciales } from "../Oids/IOidsIniciales.js";
import { OidIniciales } from "../Oids/OidsIniciales.js";
import {  perfilGenerico, registroPerfiles,  type TPerfilImpresora } from "./registrosPerfiles.js";


export class OperacionesPerfiles {
  static get(modelo?: string): TPerfilImpresora {
    if (!modelo) return perfilGenerico;
    return registroPerfiles.get(modelo) ?? perfilGenerico;
  }

  static getOids(modelo?: string): IOidsIniciales {
    return this.get(modelo).oids() ?? new OidIniciales();
  }

  static getClientOptions(modelo: string): ClientOptions {
    return registroPerfiles.get(modelo)?.clientOptions?.() ?? new ClientOptions().getClientOptionsV2c() ;
  }

  getConsulta(impresora: Impresora): AbstractConsultaImpresora  {
    return registroPerfiles.get(impresora.modelo)?.consulta?.(impresora) ?? new ConsultaGenerica(impresora);;
  }

  /** Útil para tests o para listar modelos soportados */
  static knownModels(): string[] {
    return [...registroPerfiles.keys()];
  }
}