import * as repo from "../data/categoriasRepository";
import { Categoria } from "../types/types";

export async function obtenerCategorias(): Promise<Categoria[]> {
  let categorias = await repo.obtenerCategorias()
  return categorias;
}

export async function editarCategoria(id: number, nombre: string, limite: number): Promise<Categoria> {
    if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre de la categoría no puede estar vacío')
    }
    if (limite < 0) {
        throw new Error('El límite no puede ser negativo')
    }

    const categoria = await repo.editarCategoria(id, nombre, limite)
    return categoria
}

export async function crearCategoria(nombre: string, limite: number, gastado: number, sobrante:number): Promise<Categoria> {
    if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre de la categoría no puede estar vacío')
    }
    if (limite < 0) {
        throw new Error('El límite no puede ser negativo')
    }
    if (limite < gastado) {
        throw new Error('El gastado no puede ser mayor a el límite')
    }


    const categoria = await repo.crearCategoria(nombre, limite, gastado, sobrante)
    return categoria
}

export async function borrarCategoria(id: number): Promise<void> {
    const seBorro = await repo.borrarCategoria(id)

    if (!seBorro) {
        throw new Error('La categoria que intentas borrar no existe')
    }
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