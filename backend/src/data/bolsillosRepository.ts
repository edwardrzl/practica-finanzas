import db from './database'
import { Bolsillo } from '../types/types';

export async function obtenerBolsillo(id: number): Promise<Bolsillo>{
    const bolsillo = db.prepare(`SELECT * FROM bolsillos WHERE id  = ?`).get(id) as Bolsillo
    return bolsillo
}

