import db from './database'
import { Categoria } from '../types/types';

export async function obtenerCategoria(id: number): Promise<Categoria>{
    const categoria = db.prepare('SELECT * FROM categorias WHERE id  = ?').get(id) as Categoria
    return categoria
}

export async function obtenerCategorias(): Promise<Categoria[]>{
    const categorias = db.prepare(`SELECT * FROM categorias`).all() as Categoria[]
    return categorias
}

export async function editarCategoria(id: number, nombre: string, limite: number): Promise<Categoria> {
    db.prepare(`
        UPDATE categorias 
        SET nombre = ?, limite = ? 
        WHERE id = ?
    `).run(nombre, limite, id)

    const categoriaActualizada = db.prepare(`
        SELECT * FROM categorias WHERE id = ?
    `).get(id) as Categoria

    return categoriaActualizada
}

export async function crearCategoria(nombre: string, limite: number, gastado: number, sobrante:number): Promise<Categoria> {
    
    const transaccion = db.transaction(() => {
      const resultCrear = db
        .prepare(
          `INSERT INTO categorias (nombre, limite, gastado, sobrante)
           VALUES (?, ?, ?, ?)`
        )
        .run(nombre, limite, gastado, sobrante);

      /*db.prepare(
        'UPDATE categorias SET limite = ? WHERE id = ?'
      ).run(nuevoLimite, id)*/

      return Number(resultCrear.lastInsertRowid);
    })
    const id = transaccion()
    const categoriaNueva = obtenerCategoria(id)

    return categoriaNueva;  
}

export async function borrarCategoria(id: number): Promise<boolean> {
    const resultado = db.prepare(`
        DELETE FROM categorias WHERE id = ?
    `).run(id)

    return resultado.changes > 0
}