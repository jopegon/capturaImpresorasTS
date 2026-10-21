import type { AbstractConsultaImpresora } from "./Impresoras/AbstractConsultaImpresora.js";
//import { ConstructorConsultaImpresora } from "./Impresoras/ConstructorConsultaImpresora.js";
import { IdentificadorImpresora } from "./Impresoras/IdentificadorImpresora.js";
import { Impresora } from "./Impresoras/Impresora.js";
import { OperacionesPerfiles } from "./PerfilesImpresoras/OperacionesPerfiles.js";





async function consulta(ip: string, localizacion:string) {
    let impresora: Impresora = new Impresora(ip, localizacion);
    try {

        let identificadorImpresora: IdentificadorImpresora = new IdentificadorImpresora(impresora);

        

        impresora = await identificadorImpresora.identificar();

        console.log(`------------------------${impresora.modelo}---------------------------`)

        if (impresora.conectada) {
            let consulta: AbstractConsultaImpresora =  new OperacionesPerfiles().getConsulta(impresora);
            impresora = await consulta.getDatos();
        }

    }
    catch {
        // No hacer nada
        console.warn(`he generado un error`)
    }
    console.log(` ${impresora.toString()} `) 
}


await consulta('10.41.81.217', 'Pasillo (secretaría)') 



await consulta('10.41.113.232', 'Pasillo (secretaría)') 


await consulta('10.41.81.219', 'Pasillo (secretaría)')

await consulta('10.41.81.233', 'Pasillo (secretaría)')

await consulta('10.41.81.215', 'Pasillo (secretaría)')

await consulta('10.41.81.245', 'Pasillo (secretaría)')

await consulta('10.41.82.201', 'Pasillo (secretaría)')

await consulta('10.41.97.238', 'Pasillo (secretaría)')

await consulta('10.41.97.232', 'Pasillo (secretaría)')

await consulta('10.41.97.70', 'Pasillo (secretaría)')

await consulta('10.41.81.232', 'Pasillo (secretaría)')

await consulta('10.41.97.234', 'Pasillo (secretaría)')

await consulta('10.41.97.246', 'Pasillo (secretaría)')

await consulta('10.41.97.241', 'Pasillo (secretaría)')

await consulta('10.41.97.227', 'Pasillo (secretaría)')

await consulta('10.41.81.227', 'Pasillo (secretaría)')



