import type{ Request, Response } from "express";
import * as service from "../services/movimientosService";
import { type Movimiento, type MovimientoNuevo} from '../types/types'
/*export async function getMovimientos(req: Request, res: Response): Promise<void> {
  const movimientos = await service.obtenerMovimientos();
  res.json(movimientos);
}*/

/*interface EditarMovimientoBody {
    nombre: string;
    valor: number;
}

export async function editarMovimiento(
    req: Request<{ id: string }, {}, EditarMovimientoBody>, 
    res: Response
): Promise<void> {
    const id = Number(req.params.id)
    const { nombre, valor } = req.body

    try {
        const movimiento = await service.editarMovimiento(id, nombre, valor)
        res.json(movimiento)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}
*/

export async function crearMovimiento(req: Request, res: Response): Promise<void> {

    const { valor, descripcion, tipo, idCategoria, idCuenta, idBolsillo } = req.body as MovimientoNuevo;
    console.log("controller")
    const movimiento = await service.crearMovimiento(valor, descripcion, tipo, idCategoria, idCuenta, idBolsillo);
    res.json(movimiento);
}

/*export async function borrarMovimiento(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id)

    try {
        await service.borrarMovimiento(id)
        res.status(204).send()
    } catch (error) {
        res.status(404).json({ error: (error as Error).message })
    }
}*/