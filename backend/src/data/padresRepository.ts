import db from './database.js'
import { Categoria, Bolsillo, Cuenta } from '../types/types.js';

export async function obtenerCategoria(id: number): Promise<Categoria>{
    const categoria = db.prepare('SELECT * FROM categorias WHERE id  = ?').get(id)
    return categoria
}

export async function obtenerBolsillo(id: number): Promise<Bolsillo>{
    const bolsillo = db.prepare(`SELECT * FROM bolsillos WHERE id  = ?`).get(id)
    return bolsillo
}
export async function obtenerCuenta(id: number): Promise<Cuenta>{
    const cuenta = db.prepare(`SELECT * FROM cuenta WHERE id  = ?`).get(id)
    return cuenta
}

export async function obtenerCategorias(): Promise<Categoria>{
    const categorias = db.prepare(`SELECT * FROM categorias`).all()
    return categorias
}