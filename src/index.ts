import { Impresora } from "./clases/Impresora.js";
import { ConsultaImpresora } from "./ConsultaImpresora.js";


let impresora:Impresora = new Impresora('192.168.1.143', 'en un lugar');

let consulta:ConsultaImpresora = new ConsultaImpresora(impresora);

try{
    impresora=await consulta.getDatos();
}
catch{
    // No hacer nada
}
          

console.log(` ${impresora.toString()} `) 