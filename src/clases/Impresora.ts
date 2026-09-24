import type { IImpresora } from "./IImpresora.js";

export class Impresora implements IImpresora{

  protected _modelo: string = "";
  protected _ip: string = "";
  protected _numeroDeSerie: string = "";
  protected _localizacion: string = "";
  protected _observaciones: string = "";

  protected _negro: number = 0;
  protected _magenta: number = 0;
  protected _cyan: number = 0;
  protected _amarillo: number = 0;

  protected _color: boolean = false;
  protected _conectada: boolean = false;
  protected _contador: number = 0;
  protected _contadorFotocopias: number = 0;


  constructor(ip: string, localizacion: string) {
    this._ip = ip;
    this._localizacion = localizacion;
  }

  // --- GETTERS Y SETTERS NATIVOS DE TYPESCRIPT ---

  // Modelo
  public get modelo(): string {
    return this._modelo;
  }
  public set modelo(value: string) {
    this._modelo = value;
  }

  // IP
  public get ip(): string {
    return this._ip;
  }
  public set ip(value: string) {
    this._ip = value;
  }

  // Número de Serie
  public get numeroDeSerie(): string {
    return this._numeroDeSerie;
  }
  public set numeroDeSerie(value: string) {
    this._numeroDeSerie = value;
  }

  // Localización
  public get localizacion(): string {
    return this._localizacion;
  }
  public set localizacion(value: string) {
    this._localizacion = value;
  }

  // Observaciones
  public get observaciones(): string {
    return this._observaciones;
  }
  public set observaciones(value: string) {
    this._observaciones = value;
  }

  // Tóner Negro
  public get negro(): number {
    return this._negro;
  }
  public set negro(value: number) {
    this._negro = value;
  }

  // Tóner Magenta
  public get magenta(): number {
    return this._magenta;
  }
  public set magenta(value: number) {
    this._magenta = value;
  }

  // Tóner Cyan
  public get cyan(): number {
    return this._cyan;
  }
  public set cyan(value: number) {
    this._cyan = value;
  }

  // Tóner Amarillo
  public get amarillo(): number {
    return this._amarillo;
  }
  public set amarillo(value: number) {
    this._amarillo = value;
  }

  // Color
  public get color(): boolean {
    return this._color;
  }
  public set color(value: boolean) {
    this._color = value;
  }

  // Conectada
  public get conectada(): boolean {
    return this._conectada;
  }
  public set conectada(value: boolean) {
    this._conectada = value;
  }

  // Contador de Impresiones
  public get contador(): number {
    return this._contador;
  }
  public set contador(value: number) {
    this._contador = value;
  }

  // Contador de Fotocopias
  public get contadorFotocopias(): number {
    return this._contadorFotocopias;
  }
  public set contadorFotocopias(value: number) {
    this._contadorFotocopias = value;
  }

  // --- MÉTODOS DE LÓGICA Y UTILIDAD ---

  // Impresión en cadena formateada (Actualizada para leer las nuevas propiedades)
  public toString(): string {
    let cadena = `Modelo: ${this.modelo} s/n ${this.numeroDeSerie} IP: ${this.ip} Localización: ${this.localizacion} Contador: ${this.contador} ContadorFotocopias: ${this.contadorFotocopias} Observaciones: ${this.observaciones} Tinta Negra: ${this.negro} %  Color: ${this.color} Conectada: ${this.conectada} Tinta Magenta: ${this.magenta} Tinta Cyan: ${this.cyan} Tinta Amarilla: ${this.amarillo}`;
        
    return cadena + ` \n`;
  }
}
