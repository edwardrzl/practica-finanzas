import { Router } from "express";
import * as controller from "../controllers/cuentasController";

const router = Router();

router.get("/", controller.getCuentas);
router.post("/", controller.crearCuenta);
router.put("/:id", controller.editarCuenta);
router.delete("/:id", controller.borrarCuenta);

export default router;