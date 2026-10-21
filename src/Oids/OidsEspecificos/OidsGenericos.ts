import type { IOidsIniciales } from "../IOidsIniciales.js";

export class OidsGenericos implements IOidsIniciales {

    oidModelo: string = '1.3.6.1.2.1.25.3.2.1.3.1';
    oidLocalizacion: string = '1.3.6.1.2.1.1.6.0';
    oidNumeroDeSerie: string = '1.3.6.1.2.1.43.5.1.1.17.1';

    oidContadorImpresiones: string = '1.3.6.1.2.1.43.10.2.1.4.1.1';
    oidContadorFotocopias: string = '1.3.6.1.4.1.11.2.3.9.4.2.1.1.16.1.26.1.26.0';

    oidTonerLevelNegro: string = '1.3.6.1.2.1.43.11.1.1.9.1.1';
    oidFullCapacityNegro: string = '1.3.6.1.2.1.43.11.1.1.8.1.1';

    oidTonerLevelCyan: string = '1.3.6.1.2.1.43.11.1.1.9.1.2';
    oidFullCapacityCyan: string = '1.3.6.1.2.1.43.11.1.1.8.1.2';

    oidTonerLevelMagenta: string = '1.3.6.1.2.1.43.11.1.1.9.1.3';
    oidFullCapacityMagenta: string = '1.3.6.1.2.1.43.11.1.1.8.1.3';

    oidTonerLevelAmarillo: string = '1.3.6.1.2.1.43.11.1.1.9.1.4';
    oidFullCapacityAmarillo: string = '1.3.6.1.2.1.43.11.1.1.8.1.4';

    listaOids: string[] = [this.oidNumeroDeSerie, this.oidContadorImpresiones, this.oidTonerLevelNegro,
        this.oidFullCapacityNegro, this.oidFullCapacityAmarillo, this.oidTonerLevelAmarillo,
        this.oidFullCapacityCyan, this.oidTonerLevelCyan, this.oidFullCapacityMagenta, this.oidTonerLevelMagenta];


  
}
