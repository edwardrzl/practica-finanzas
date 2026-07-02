import * as repo from "../data/bolsillosRepository";
import { Bolsillo } from "../types/types";

export async function obtenerBolsillos(): Promise<Bolsillo[]> {
  let bolsillos = await repo.obtenerBolsillos()
  return bolsillos;
}

export async function editarBolsillo(id: number, nombre: string, valor: number): Promise<Bolsillo> {
    if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre de la bolsillo no puede estar vacío')
    }
    if (valor < 0) {
        throw new Error('El límite no puede ser negativo')
    }

    const bolsillo = await repo.editarBolsillo(id, nombre, valor)
    return bolsillo
}

export async function crearBolsillo(nombre: string, valor: number): Promise<Bolsillo> {
    if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre de la bolsillo no puede estar vacío')
    }
    if (valor < 0) {
        throw new Error('El límite no puede ser negativo')
    }


    const bolsillo = await repo.crearBolsillo(nombre, valor)
    return bolsillo
}

export async function borrarBolsillo(id: number): Promise<void> {
    const seBorro = await repo.borrarBolsillo(id)

    if (!seBorro) {
        throw new Error('La bolsillo que intentas borrar no existe')
    }
}