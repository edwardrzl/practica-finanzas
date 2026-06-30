import type{ Request, Response } from "express";
import * as service from "../services/movimientosService.js";
//import { VehiculoConVigencias } from "../types/types.js";

export async function getVehiculos(req: Request, res: Response): Promise<void> {
  const vehiculos = await service.listarVehiculos();
  res.json(vehiculos);
}
export async function getVehiculo(req: Request<{placa: string}>, res: Response): Promise<void> {
  const placa = req.params.placa ;

  try {
    const vehiculo = await service.obtenerVehiculoYVigencia(placa);
    res.json(vehiculo);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}
