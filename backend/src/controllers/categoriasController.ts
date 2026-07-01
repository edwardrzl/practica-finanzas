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
}

export async function editarCategoria(
    req: Request<{ id: string }, {}, EditarCategoriaBody>, 
    res: Response
): Promise<void> {
    const id = Number(req.params.id)
    const { nombre, limite } = req.body

    try {
        const categoria = await service.editarCategoria(id, nombre, limite)
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

