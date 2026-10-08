import type { AbstractConsultaImpresora } from "./Impresoras/AbstractConsultaImpresora.js";
import { ConstructorConsultaImpresora } from "./Impresoras/ConstructorConsultaImpresora.js";
import { IdentificadorImpresora } from "./Impresoras/IdentificadorImpresora.js";
import { Impresora } from "./Impresoras/Impresora.js";


let impresora:Impresora = new Impresora('192.168.1.142', 'Pasillo (secretaría)');

try{

    let identificadorImpresora:IdentificadorImpresora = new IdentificadorImpresora(impresora);
    impresora= await identificadorImpresora.identificar();

    if (impresora.conectada){
        let consulta:AbstractConsultaImpresora = await new ConstructorConsultaImpresora().construyeConsultaImpresora(impresora);
        impresora=await consulta.getDatos();
    }

}
catch{
    // No hacer nada
    console.warn(`he generado un error`)
}
          
console.log(` ${impresora.toString()} `) 