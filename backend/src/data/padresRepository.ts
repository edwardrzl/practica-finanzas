import db from './database'
import { Categoria, Bolsillo, Cuenta } from '../types/types';

export async function obtenerCategoria(id: number): Promise<Categoria>{
    const categoria = db.prepare('SELECT * FROM categorias WHERE id  = ?').get(id) as Categoria
    return categoria
}

export async function obtenerBolsillo(id: number): Promise<Bolsillo>{
    const bolsillo = db.prepare(`SELECT * FROM bolsillos WHERE id  = ?`).get(id) as Bolsillo
    return bolsillo
}
export async function obtenerCuenta(id: number): Promise<Cuenta>{
    const cuenta = db.prepare(`SELECT * FROM cuenta WHERE id  = ?`).get(id) as Cuenta
    return cuenta
}

export async function obtenerCategorias(): Promise<Categoria[]>{
    const categorias = db.prepare(`SELECT * FROM categorias`).all() as Categoria[]
    return categorias
}