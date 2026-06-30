import * as repo from "../data/padresRepository";
import { Categoria } from "../types/types";

export async function obtenerCategorias(): Promise<Categoria[]> {
  let categorias = await repo.obtenerCategorias()
  //if(categorias.length==0) {categorias = []}
  return categorias;
}


/*export async function obtenerVehiculoYVigencia(placa: string): Promise<VehiculoConVigencias> {
const vehiculo = await repo.obtenerPorPlaca(placa);
if (!vehiculo) {
    throw new Error("Vehículo no encontrado");
  } 

const vigencias = await repo.obtenerVigenciasPorPlaca(placa);

    let total_vigencias = vigencias.length;
    let vigencias_pendientes = vigencias.filter(v => v.estado === 'pendiente').length;
    let total_deuda = vigencias.filter(v => v.estado === 'pendiente').reduce((sum, v) => sum + v.valor, 0);
    let estado_general: 'con_deuda' | 'al_dia' = total_deuda > 0 ? 'con_deuda' : 'al_dia';

    const respuesta: VehiculoConVigencias = {
      vehiculo,
      vigencias,
      resumen: {
        total_vigencias,
        vigencias_pendientes,
        total_deuda,
        estado_general
      }
    };

  return respuesta;
}*/