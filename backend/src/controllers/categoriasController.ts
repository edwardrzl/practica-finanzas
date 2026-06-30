import type{ Request, Response } from "express";
import * as service from "../services/categoriasService";
//import { VehiculoConVigencias } from "../types/types.js";

export async function getCategorias(req: Request, res: Response): Promise<void> {
  const categorias = await service.obtenerCategorias();
  res.json(categorias);
}

/*export async function getVehiculo(req: Request<{placa: string}>, res: Response): Promise<void> {
  const placa = req.params.placa ;

  try {
    const vehiculo = await service.obtenerVehiculoYVigencia(placa);
    res.json(vehiculo);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}*/
