import * as repo from "../data/cuentasRepository";
import { Cuenta } from "../types/types";

export async function obtenerCuentas(): Promise<Cuenta[]> {
  let cuentas = await repo.obtenerCuentas()
  return cuentas;
}

export async function editarCuenta(id: number, nombre: string, valor: number): Promise<Cuenta> {
    if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre de la cuenta no puede estar vacío')
    }
    if (valor < 0) {
        throw new Error('El límite no puede ser negativo')
    }

    const cuenta = await repo.editarCuenta(id, nombre, valor)
    return cuenta
}

export async function crearCuenta(nombre: string, valor: number): Promise<Cuenta> {
    if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre de la cuenta no puede estar vacío')
    }
    if (valor < 0) {
        throw new Error('El límite no puede ser negativo')
    }


    const cuenta = await repo.crearCuenta(nombre, valor)
    return cuenta
}

export async function borrarCuenta(id: number): Promise<void> {
    const seBorro = await repo.borrarCuenta(id)

    if (!seBorro) {
        throw new Error('La cuenta que intentas borrar no existe')
    }
}