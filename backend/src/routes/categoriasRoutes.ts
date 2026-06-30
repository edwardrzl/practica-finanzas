import { Router } from "express";
import * as controller from "../controllers/categoriasController";

const router = Router();

router.get("/", controller.getCategorias);
//router.get("/:placa", controller.getVehiculo);

export default router;