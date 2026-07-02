import db from './database'
import { Bolsillo } from '../types/types';

export async function obtenerBolsillo(id: number): Promise<Bolsillo>{
    const bolsillo = db.prepare(`SELECT * FROM bolsillos WHERE id  = ?`).get(id) as Bolsillo
    return bolsillo
}

export async function obtenerBolsillos(): Promise<Bolsillo[]>{
    const bolsillos = db.prepare(`SELECT * FROM bolsillos`).all() as Bolsillo[]
    return bolsillos
}

export async function editarBolsillo(id: number, nombre: string, valor: number): Promise<Bolsillo> {
    db.prepare(`
        UPDATE bolsillos 
        SET nombre = ?, valor = ? 
        WHERE id = ?
    `).run(nombre, valor, id)

    const bolsilloActualizada = db.prepare(`
        SELECT * FROM bolsillos WHERE id = ?
    `).get(id) as Bolsillo

    return bolsilloActualizada
}

export async function crearBolsillo(nombre: string, valor: number): Promise<Bolsillo> {
    
    const transaccion = db.transaction(() => {
      const resultCrear = db
        .prepare(
          `INSERT INTO bolsillos (nombre, valor)
           VALUES (?, ?)`
        )
        .run(nombre, valor);

      return Number(resultCrear.lastInsertRowid);
    })
    const id = transaccion()
    const bolsilloNueva = obtenerBolsillo(id)

    return bolsilloNueva;  
}

export async function borrarBolsillo(id: number): Promise<boolean> {
    const resultado = db.prepare(`
        DELETE FROM bolsillos WHERE id = ?
    `).run(id)

    return resultado.changes > 0
}
