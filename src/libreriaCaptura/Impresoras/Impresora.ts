import type { IImpresora } from "./IImpresora.js";
import * as snmp from "net-snmp";

export class Impresora implements IImpresora {

  modelo: string = "";
  ip: string = "";
  numeroDeSerie: string = "";
  localizacion: string = "";
  observaciones: string = "";

  versionSnmp: typeof snmp.Version1 | typeof snmp.Version2c = snmp.Version2c;

  negro: number | undefined = undefined;
  magenta: number | undefined = undefined;
  cyan: number | undefined = undefined;
  amarillo: number | undefined = undefined;

  color: boolean | undefined = undefined;
  conectada: boolean = false;
  contador: number = 0;
  contadorFotocopias: number = 0;


  constructor(ip: string, localizacion?: string) {
    this.ip = ip;
    this.localizacion = localizacion ?? '';
  }

  public inicializaValores():Impresora{
    this.conectada=false;
    this.modelo="";
    this.numeroDeSerie="";
    this.color=false;
    this.negro=undefined;
    this.amarillo=undefined;
    this.cyan=undefined;
    this.magenta=undefined;
    this.contador=0;
    return this;
  }

  public toString(): string {
    let cadena = `Modelo: ${this.modelo} s/n ${this.numeroDeSerie} snmp: ${this.versionSnmp} IP: ${this.ip} Localización: ${this.localizacion} Contador: ${this.contador} ContadorFotocopias: ${this.contadorFotocopias} Observaciones: ${this.observaciones} Tinta Negra: ${this.negro} %  Color: ${this.color} Conectada: ${this.conectada} Tinta Magenta: ${this.magenta} % Tinta Cyan: ${this.cyan} % Tinta Amarilla: ${this.amarillo} %`;

    return cadena + ` \n`;
  }
}
