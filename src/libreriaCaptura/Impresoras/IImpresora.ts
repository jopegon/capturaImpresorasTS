import * as snmp from "net-snmp";

export interface IImpresora {
  // Propiedades básicas (Datos de red e identificación)
  modelo: string;
  ip: string;
  numeroDeSerie: string;
  localizacion: string;
  observaciones: string;

  versionSnmp:typeof snmp.Version1 | typeof snmp.Version2c;


  // Niveles de consumibles
  negro: number | undefined;
  magenta: number | undefined;
  cyan: number | undefined;
  amarillo: number | undefined;

  // Estados y contadores
  color: boolean | undefined;
  conectada: boolean;
  contador: number;
  contadorFotocopias: number;

  error: string | undefined;
  // Métodos de comportamiento
  toString(): string;
}
