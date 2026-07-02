import db from './database'
import { Cuenta } from '../types/types';

export async function obtenerCuenta(id: number): Promise<Cuenta>{
    const cuenta = db.prepare(`SELECT * FROM cuentas WHERE id  = ?`).get(id) as Cuenta
    return cuenta
}

export async function obtenerCuentas(): Promise<Cuenta[]>{
    const cuentas = db.prepare(`SELECT * FROM cuentas`).all() as Cuenta[]
    return cuentas
}

export async function editarCuenta(id: number, nombre: string, valor: number, tipo: "normal" | "deuda"): Promise<Cuenta> {
    db.prepare(`
        UPDATE cuentas 
        SET nombre = ?, valor = ?, tipo = ? 
        WHERE id = ?
    `).run(nombre, valor, tipo, id)

    const cuentaActualizada = db.prepare(`
        SELECT * FROM categorias WHERE id = ?
    `).get(id) as Cuenta

    return cuentaActualizada
}

export async function crearCuenta(nombre: string, valor: number, tipo: "normal" | "deuda"): Promise<Cuenta> {
    
    const transaccion = db.transaction(() => {
      const resultCrear = db
        .prepare(
          `INSERT INTO cuentas (nombre, valor, tipo)
           VALUES (?, ?, ?)`
        )
        .run(nombre, valor, tipo);

      return Number(resultCrear.lastInsertRowid);
    })
    const id = transaccion()
    const cuentaNueva = obtenerCuenta(id)

    return cuentaNueva;  
}

export async function borrarCuenta(id: number): Promise<boolean> {
    const resultado = db.prepare(`
        DELETE FROM cuentas WHERE id = ?
    `).run(id)

    return resultado.changes > 0
}
