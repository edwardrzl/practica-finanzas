import db from './database'
import { Movimiento } from '../types/types'

export async function obtenerMovimientos(): Promise<Movimiento[]>{
    const movimientos = db.prepare('SELECT * FROM movimientos').all() as Movimiento[]
    return movimientos
}

export async function obtenerPorTipo(tipo: string): Promise<Movimiento[]>{
    const movimientos = db.prepare('SELECT * FROM movimientos WHERE tipo = ?').all(tipo) as Movimiento[]
    return movimientos
}

export async function crear(
    valor: number,
    descripcion: string,
    tipo: "gasto" | "ingreso",
    idCategoria: number | null,
    gastado: number | null,
    sobrante: number | null,
    idBolsillo: number,
    valorBolsillo: number,
    idCuenta: number,
    valorCuenta: number
): Promise<Movimiento> {
    const transaccion = db.transaction(() => {
        const resultMovimiento = db.prepare(`
            INSERT INTO movimientos (valor, descripcion, id_categoria, id_bolsillo, id_cuenta, tipo) 
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(valor, descripcion, idCategoria, idBolsillo, idCuenta, tipo)

        if (idCategoria !== null) {
            db.prepare(`UPDATE categorias SET gastado = ?, sobrante = ? WHERE id = ?`)
                .run(gastado, sobrante, idCategoria)
        }

        db.prepare(`UPDATE bolsillos SET valor = ? WHERE id = ?`).run(valorBolsillo, idBolsillo)
        db.prepare(`UPDATE cuentas SET valor = ? WHERE id = ?`).run(valorCuenta, idCuenta)

        return Number(resultMovimiento.lastInsertRowid)
    })
    const id = transaccion()
    return db.prepare(`SELECT * FROM movimientos WHERE id = ?`).get(id) as Movimiento
}

export async function editarMovimiento(id: number, descripcion: string): Promise<Movimiento> {
    db.prepare(`
        UPDATE movimientos 
        SET descripcion = ?
        WHERE id = ?
    `).run(descripcion, id)

    const movimientoActualizada = db.prepare(`
        SELECT * FROM movimientos WHERE id = ?
    `).get(id) as Movimiento

    return movimientoActualizada
}