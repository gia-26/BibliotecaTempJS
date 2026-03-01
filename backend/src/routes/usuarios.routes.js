import { Router } from "express";
import * as ctrl from "../controllers/usuarios.controllers.js";

const router = Router();

router.get("/buscar", ctrl.getUsuariosById);
router.get('/tipos', ctrl.getAllTiposUsuario);

export default router;