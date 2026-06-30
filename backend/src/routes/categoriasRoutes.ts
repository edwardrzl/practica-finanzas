import { Router } from "express";
import * as controller from "../controllers/vehiculoController.js";

const router = Router();

router.get("/", controller.getVehiculos);
//router.get("/:placa", controller.getVehiculo);

export default router;