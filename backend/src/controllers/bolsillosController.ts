import type{ Request, Response } from "express";
import * as service from "../services/bolsillosService";

export async function getBolsillos(req: Request, res: Response): Promise<void> {
  const bolsillos = await service.obtenerBolsillos();
  res.json(bolsillos);
}

interface EditarBolsilloBody {
    nombre: string;
    valor: number;
}

export async function editarBolsillo(
    req: Request<{ id: string }, {}, EditarBolsilloBody>, 
    res: Response
): Promise<void> {
    const id = Number(req.params.id)
    const { nombre, valor } = req.body

    try {
        const bolsillo = await service.editarBolsillo(id, nombre, valor)
        res.json(bolsillo)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}


export async function crearBolsillo(req: Request, res: Response): Promise<void> {

    const { nombre, valor } = req.body as EditarBolsilloBody;

    const bolsillo = await service.crearBolsillo(nombre, valor);
    res.json(bolsillo);
}

export async function borrarBolsillo(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id)

    try {
        await service.borrarBolsillo(id)
        res.status(204).send()
    } catch (error) {
        res.status(404).json({ error: (error as Error).message })
    }
}