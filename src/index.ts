
import { Impresora } from "./libreriaCaptura/Impresoras/Impresora.js";
import { ServicioCaptura } from "./libreriaCaptura/servicioCaptura/ServicioCaptura.js";



const listaImpresoras: Impresora[] = [
    new Impresora('192.168.1.136', 'epson'),
    new Impresora('10.41.81.217', 'Pasillo (secretaría)'),
    new Impresora('10.41.113.232', 'Pasillo (secretaría)'),
    new Impresora('10.41.81.219', 'Pasillo (secretaría)'),
    new Impresora('10.41.81.233', 'Pasillo (secretaría)'),
    new Impresora('10.41.81.215', 'Pasillo (secretaría)'),
    new Impresora('10.41.81.245', 'Pasillo (secretaría)'),
    new Impresora('10.41.82.201', 'Pasillo (secretaría)'),
    new Impresora('10.41.97.238', 'Pasillo (secretaría)'),
    new Impresora('10.41.97.232', 'Pasillo (secretaría)'),
    new Impresora('10.41.97.70', 'Pasillo (secretaría)'),
    new Impresora('10.41.81.232', 'Pasillo (secretaría)'),
    new Impresora('10.41.97.234', 'Pasillo (secretaría)'),
    new Impresora('10.41.97.246', 'Pasillo (secretaría)'),
    new Impresora('10.41.97.241', 'Pasillo (secretaría)'),
    new Impresora('10.41.97.227', 'Pasillo (secretaría)'),
    new Impresora('10.41.81.227', 'Pasillo (secretaría)')
];


const resultado = await Promise.allSettled([new ServicioCaptura().capturaImpresora(new Impresora('192.168.1.136', 'epson'))]);

if (resultado[0].status === "fulfilled") {
    console.log(resultado[0].value.toString());
} else {
    console.log(resultado[0].reason.value);
}
/*
const resultado2 = await Promise.allSettled([new ServicioCaptura().capturaListaImpresoras(listaImpresoras)]);

for (const resultado of resultado2) {
    if (resultado.status === "fulfilled") {
        console.log(resultado.value.toString());
    } else {
        console.log(resultado.reason.value);
    }

}
*/

const servicio = new ServicioCaptura();

const resultados = await servicio.capturaListaImpresoras(listaImpresoras);
for (const impresora of resultados) {
    console.log(impresora.toString());
}