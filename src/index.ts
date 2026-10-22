import type { AbstractConsultaImpresora } from "./Impresoras/AbstractConsultaImpresora.js";
import { IdentificadorImpresora } from "./Impresoras/IdentificadorImpresora.js";
import { Impresora } from "./Impresoras/Impresora.js";
import { OperacionesPerfiles } from "./PerfilesImpresoras/OperacionesPerfiles.js";

async function consulta(impresora: Impresora): Promise<Impresora> {

    try {
        impresora = await new IdentificadorImpresora(impresora).identificar();

        if (impresora.conectada) {
            let consulta: AbstractConsultaImpresora = new OperacionesPerfiles().getConsulta(impresora);
            impresora = await consulta.getDatos();
        }
        //console.log(` ${impresora.toString()} `)
    } catch {
        return impresora
    }
    return impresora
}

const impresoras: Impresora[] = [
    new Impresora('192.168.1.136','epson'),
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

const resultados = await Promise.allSettled(
    impresoras.map(impresora => consulta(impresora))
);


resultados.forEach((resultado) => {
    if (resultado && resultado.status === 'fulfilled') {
        console.log(`${resultado.value.toString()}`);
    } else {
        const error = resultado ? resultado.reason : 'No se obtuvo respuesta';
        console.error(` Error en :`, error);
    }
})