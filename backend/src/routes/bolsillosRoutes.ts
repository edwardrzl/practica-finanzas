import { Router } from "express";
import * as controller from "../controllers/bolsillosController";

const router = Router();

router.get("/", controller.getBolsillos);
router.post("/", controller.crearBolsillo);
router.put("/:id", controller.editarBolsillo);
router.delete("/:id", controller.borrarBolsillo);

export default router;