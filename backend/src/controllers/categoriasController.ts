import type{ Request, Response } from "express";
import * as service from "../services/categoriasService";
//import { VehiculoConVigencias } from "../types/types.js";

export async function getCategorias(req: Request, res: Response): Promise<void> {
  const categorias = await service.obtenerCategorias();
  res.json(categorias);
}

interface EditarCategoriaBody {
    nombre: string;
    limite: number;
    sobrante: number;
}

export async function editarCategoria(
    req: Request<{ id: string }, {}, EditarCategoriaBody>, 
    res: Response
): Promise<void> {
    const id = Number(req.params.id)
    const { nombre, limite, sobrante } = req.body

    try {
        const categoria = await service.editarCategoria(id, nombre, limite, sobrante)
        res.json(categoria)
    } catch (error) {
        res.status(400).json({ error: (error as Error).message })
    }
}

interface CategoriaBody {
    nombre: string
    limite: number
    gastado: number
    sobrante: number
}

export async function crearCategoria(req: Request, res: Response): Promise<void> {

    const { nombre, limite, gastado, sobrante } = req.body as CategoriaBody;

    const categoria = await service.crearCategoria(nombre, limite, gastado, sobrante);
    res.json(categoria);
}

export async function borrarCategoria(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id)

    try {
        await service.borrarCategoria(id)
        res.status(204).send()
    } catch (error) {
        res.status(404).json({ error: (error as Error).message })
    }
}