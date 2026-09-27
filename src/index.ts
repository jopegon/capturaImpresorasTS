import type { AbstractConsultaImpresora } from "./Impresoras/AbstractConsultaImpresora.js";
import { ConstructorConsultaImpresora } from "./Impresoras/ConstructorConsultaImpresora.js";
import { Impresora } from "./Impresoras/Impresora.js";


let impresora:Impresora = new Impresora('192.168.1.142', 'Policía Judicial, Pasillo (secretaría)');

let consulta:AbstractConsultaImpresora = new ConstructorConsultaImpresora().construyeConsultaImpresora(impresora);

try{
    impresora=await consulta.getDatos();
}
catch{
    // No hacer nada
    console.warn(`he generado un error`)
}
          
console.log(` ${impresora.toString()} `) 