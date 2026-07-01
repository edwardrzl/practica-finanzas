import { Router } from "express";
import * as controller from "../controllers/categoriasController";

const router = Router();

router.get("/", controller.getCategorias);
router.post("/", controller.crearCategoria);
router.put("/:id", controller.editarCategoria);
router.delete("/:id", controller.borrarCategoria);

export default router;