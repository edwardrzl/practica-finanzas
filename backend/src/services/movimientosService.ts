import * as repo from "../data/movimientosRepository"

import {obtenerCategoria} from "../data/categoriasRepository"
import {obtenerBolsillo} from "../data/bolsillosRepository"
import {obtenerCuenta} from "../data/cuentasRepository"
import { Movimiento, Categoria, Cuenta, Bolsillo } from "../types/types"

export async function crearMovimiento(
    valor: number,
    descripcion: string,
    tipo: "gasto" | "ingreso",
    idCategoria: number | null,
    idCuenta: number,
    idBolsillo: number,
): Promise<{ movimiento: Movimiento, categoria: Categoria | null, cuenta: Cuenta, bolsillo: Bolsillo }> {
    const bolsillo = await obtenerBolsillo(idBolsillo)
    const cuenta = await obtenerCuenta(idCuenta)

    const valorConSigno = tipo === "gasto" ? valor * -1 : valor

    let categoria: Categoria | null = null
    let nuevoGastado: number | null = null
    let nuevoSobrante: number | null = null

    if (idCategoria !== null) {
        categoria = await obtenerCategoria(idCategoria)
        nuevoGastado = categoria.gastado + (-1 * valorConSigno)
        nuevoSobrante = Math.max(categoria.limite - nuevoGastado, 0)
        categoria.gastado = nuevoGastado
        categoria.sobrante = nuevoSobrante
    }

    bolsillo.valor += valorConSigno
    cuenta.valor += valorConSigno

    const movimiento = await repo.crear(
        valor, descripcion, tipo,
        idCategoria, nuevoGastado, nuevoSobrante,
        idBolsillo, bolsillo.valor,
        idCuenta, cuenta.valor
    )

    return { movimiento, categoria, cuenta, bolsillo }
}

export async function obtenerMovimientos(): Promise<Movimiento[]> {
  let movimientos = await repo.obtenerMovimientos()
  return movimientos;
}

export async function editarMovimiento(id: number, descripcion: string): Promise<Movimiento> {
    if (!descripcion || descripcion.trim() === '') {
        throw new Error('El desdescripcion de la movimiento no puede estar vacío')
    }
    const movimiento = await repo.editarMovimiento(id, descripcion)
    return movimiento
}

