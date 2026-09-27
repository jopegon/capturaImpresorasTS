import { ClientOptionsVersion1 } from "./ClientOptionsVersion1.js";
import { ClientOptionsVersion2c } from "./ClientOptionsVersion2c.js";
import type { IClientOptions } from "./IClientOptions.js";


const mapaObjetos = new Map<string, IClientOptions>([
        ["B430", new ClientOptionsVersion1()],
        ["EPSON AL-M4000", new ClientOptionsVersion1()],
    ]);


export class ConstructorClientOptions {

    /*
    Esta clase se encarga de obtener el objeto de opciones 
    con las particularidades de cada modelo de impresora
    */


    clientOptions(modelo?: string): IClientOptions {


        // Para el caso en el que no se proporciona ningún parámetro
        if (!modelo) {
            return new ClientOptionsVersion2c();
        }

        return mapaObjetos.get(modelo) ?? new ClientOptionsVersion2c();
    }

}