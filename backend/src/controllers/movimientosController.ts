import type{ Request, Response } from "express";
import * as service from "../services/movimientosService";
import { type Movimiento, type MovimientoNuevo} from '../types/types'

export async function getMovimientos(req: Request, res: Response): Promise<void> {
  const movimientos = await service.obtenerMovimientos();
  res.json(movimientos);
}

export async function editarMovimiento(
    req: Request<{ id: string }, {}, {descripcion: string}>, 
    res: Response
): Promise<void> {
    const id = Number(req.params.id)
    const { descripcion } = req.body

    try {
        const movimiento = await service.editarMovimiento(id, descripcion)
        res.json(movimiento)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}


export async function crearMovimiento(req: Request, res: Response): Promise<void> {

    const { valor, descripcion, tipo, idCategoria, idCuenta, idBolsillo } = req.body as MovimientoNuevo;
    const datosActualizados = await service.crearMovimiento(valor, descripcion, tipo, idCategoria, idCuenta, idBolsillo);
    res.json(datosActualizados);
}

