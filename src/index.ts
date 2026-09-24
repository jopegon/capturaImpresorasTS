import { Impresora } from "./clases/Impresora.js";
import { ConsultaImpresora } from "./ConsultaImpresora.js";


let impresora:Impresora = new Impresora('10.41.81.239', 'Policía Judicial, Pasillo (secretaría)');

let consulta:ConsultaImpresora = new ConsultaImpresora(impresora);

try{
    impresora=await consulta.getDatos();
}
catch{
    // No hacer nada
    console.warn(`he generado un error`)
}
          
console.log(` ${impresora.toString()} `) 