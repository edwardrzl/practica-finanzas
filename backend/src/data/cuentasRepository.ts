import db from './database'
import { Cuenta } from '../types/types';

export async function obtenerCuenta(id: number): Promise<Cuenta>{
    const cuenta = db.prepare(`SELECT * FROM cuenta WHERE id  = ?`).get(id) as Cuenta
    return cuenta
}

