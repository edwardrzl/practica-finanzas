import db from './database.js'
import { Movimiento } from '../types/types.js'

export async function obtenerTodos(): Promise<Movimiento[]>{
    const movimientos = db.prepare('SELECT * FROM movimientos').all() as Movimiento[]
    return movimientos
}

export async function obtenerPorTipo(tipo: string): Promise<Movimiento[]>{
    const movimientos = db.prepare('SELECT * FROM movimientos WHERE tipo = ?').all(tipo) as Movimiento[]
    return movimientos
}

export async function crear(
    valor: number,
    categoria: string,
    bolsillo: string,
    cuenta: string,
    tipo: "gasto" | "ingreso",
    idCategoria: number,
    gastado: number,
    sobrante: number,
    idBolsillo: number,
    valorBolsillo: number,
    idCuenta: number,
    valorCuenta: number
): Promise<number>{
    const transaccion = db.transaction(() => {
        const resultMovimiento = db.prepare(`INSERT INTO movimientos (valor, categoria, bolsillo, cuenta, tipo) VALUES (?, ?, ?, ?, ?)`).run(valor, categoria, bolsillo, cuenta, tipo)

        db.prepare(`UPDATE categorias SET gastado = ?, sobrante = ? WHERE id = ?`).run(gastado, sobrante, idCategoria)

        db.prepare(`UPDATE bolsillos SET valor = ? WHERE id = ?`).run(valorBolsillo, idBolsillo)

        db.prepare(`UPDATE cuentas SET valor = ? WHERE id = ?`).run(valorCuenta, idCuenta)

        return Number(resultMovimiento.lastInsertRowid)
    })   
    return transaccion()
}