import type{ Request, Response } from "express";
import * as service from "../services/cuentasService";

export async function getCuentas(req: Request, res: Response): Promise<void> {
  const cuentas = await service.obtenerCuentas();
  res.json(cuentas);
}

interface EditarCuentaBody {
    nombre: string;
    valor: number;
}

export async function editarCuenta(
    req: Request<{ id: string }, {}, EditarCuentaBody>, 
    res: Response
): Promise<void> {
    const id = Number(req.params.id)
    const { nombre, valor } = req.body

    try {
        const cuenta = await service.editarCuenta(id, nombre, valor)
        res.json(cuenta)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}


export async function crearCuenta(req: Request, res: Response): Promise<void> {

    const { nombre, valor } = req.body as EditarCuentaBody;

    const cuenta = await service.crearCuenta(nombre, valor);
    res.json(cuenta);
}

export async function borrarCuenta(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id)

    try {
        await service.borrarCuenta(id)
        res.status(204).send()
    } catch (error) {
        res.status(404).json({ error: (error as Error).message })
    }
}