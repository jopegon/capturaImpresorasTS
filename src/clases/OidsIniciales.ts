import type { IOidsIniciales } from "./IOidsIniciales.js";

export class OidIniciales implements IOidsIniciales {

    protected _oidModelo: string = '1.3.6.1.2.1.25.3.2.1.3.1';
    protected _oidLocalizacion: string = '1.3.6.1.2.1.1.6.0';
    protected _oidNumeroDeSerie: string = '1.3.6.1.2.1.43.5.1.1.17.1';

    protected _oidContadorImpresiones: string = '1.3.6.1.2.1.43.10.2.1.4.1.1';
    protected _oidContadorFotocopias: string = '1.3.6.1.4.1.11.2.3.9.4.2.1.1.16.1.26.1.26.0';

    protected _oidTonerLevelNegro: string = '1.3.6.1.2.1.43.11.1.1.9.1.1';
    protected _oidFullCapacityNegro: string = '1.3.6.1.2.1.43.11.1.1.8.1.1';

    protected _oidTonerLevelCyan: string = '1.3.6.1.2.1.43.11.1.1.9.1.2';
    protected _oidFullCapacityCyan: string = '1.3.6.1.2.1.43.11.1.1.8.1.2';

    protected _oidTonerLevelMagenta: string = '1.3.6.1.2.1.43.11.1.1.9.1.3';
    protected _oidFullCapacityMagenta: string = '1.3.6.1.2.1.43.11.1.1.8.1.3';

    protected _oidTonerLevelAmarillo: string = '1.3.6.1.2.1.43.11.1.1.9.1.4';
    protected _oidFullCapacityAmarillo: string = '1.3.6.1.2.1.43.11.1.1.8.1.4';

    protected _listaOids: string[] = [this._oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro, 
        this.oidFullCapacityNegro, this.oidFullCapacityAmarillo, this._oidTonerLevelAmarillo,
    this.oidFullCapacityCyan, this.oidTonerLevelCyan, this.oidFullCapacityMagenta, this.oidTonerLevelMagenta];

    // --- GETTERS Y SETTERS ---

    // Modelo
    public get oidModelo(): string {
        return this._oidModelo;
    }
    public set oidModelo(value: string) {
        this._oidModelo = value;
    }

    // Localización
    public get oidLocalizacion(): string {
        return this._oidLocalizacion;
    }
    public set oidLocalizacion(value: string) {
        this._oidLocalizacion = value;
    }

    // Número de Serie
    public get oidNumeroDeSerie(): string {
        return this._oidNumeroDeSerie;
    }
    public set oidNumeroDeSerie(value: string) {
        this._oidNumeroDeSerie = value;
    }

    // Contador de Impresiones
    public get oidContadorImpresiones(): string {
        return this._oidContadorImpresiones;
    }
    public set oidContadorImpresiones(value: string) {
        this._oidContadorImpresiones = value;
    }

    // Contador de Fotocopias
    public get oidContadorFotocopias(): string {
        return this._oidContadorFotocopias;
    }
    public set oidContadorFotocopias(value: string) {
        this._oidContadorFotocopias = value;
    }

    // Tóner Negro
    public get oidTonerLevelNegro(): string {
        return this._oidTonerLevelNegro;
    }
    public set oidTonerLevelNegro(value: string) {
        this._oidTonerLevelNegro = value;
    }

    public get oidFullCapacityNegro(): string {
        return this._oidFullCapacityNegro;
    }
    public set oidFullCapacityNegro(value: string) {
        this._oidFullCapacityNegro = value;
    }

    // Tóner Cyan
    public get oidTonerLevelCyan(): string {
        return this._oidTonerLevelCyan;
    }
    public set oidTonerLevelCyan(value: string) {
        this._oidTonerLevelCyan = value;
    }

    public get oidFullCapacityCyan(): string {
        return this._oidFullCapacityCyan;
    }
    public set oidFullCapacityCyan(value: string) {
        this._oidFullCapacityCyan = value;
    }

    // Tóner Magenta
    public get oidTonerLevelMagenta(): string {
        return this._oidTonerLevelMagenta;
    }
    public set oidTonerLevelMagenta(value: string) {
        this._oidTonerLevelMagenta = value;
    }

    public get oidFullCapacityMagenta(): string {
        return this._oidFullCapacityMagenta;
    }
    public set oidFullCapacityMagenta(value: string) {
        this._oidFullCapacityMagenta = value;
    }

    // Tóner Amarillo
    public get oidTonerLevelAmarillo(): string {
        return this._oidTonerLevelAmarillo;
    }
    public set oidTonerLevelAmarillo(value: string) {
        this._oidTonerLevelAmarillo = value;
    }

    public get oidFullCapacityAmarillo(): string {
        return this._oidFullCapacityAmarillo;
    }
    public set oidFullCapacityAmarillo(value: string) {
        this._oidFullCapacityAmarillo = value;
    }

    public get listaOids(): string[] {
        return this._listaOids;
    }

    public set listaOids(value: string[]) {
        this._listaOids = value;
    }
}
