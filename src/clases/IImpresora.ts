export interface IImpresora {
  // Propiedades básicas (Datos de red e identificación)
  modelo: string;
  ip: string;
  numeroDeSerie: string;
  localizacion: string;
  observaciones: string;

  // Niveles de consumibles
  negro: number;
  magenta: number;
  cyan: number;
  amarillo: number;

  // Estados y contadores
  color: boolean;
  conectada: boolean;
  contador: number;
  contadorFotocopias: number;

  // Métodos de comportamiento
  toString(): string;
}
