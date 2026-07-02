import { Router } from "express";
import * as controller from "../controllers/movimientosController";

const router = Router();

//router.get("/", controller.getMovimientos);
router.post("/", controller.crearMovimiento);
//router.put("/:id", controller.editarMovimiento);
//router.delete("/:id", controller.borrarMovimiento);

export default router;