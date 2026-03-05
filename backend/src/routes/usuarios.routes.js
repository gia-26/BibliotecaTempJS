import { Router } from "express";
import * as ctrl from "../controllers/usuarios.controllers.js";

const router = Router();

router.get("/buscar", ctrl.getUsuariosById);
router.get('/tipos', ctrl.getAllTiposUsuario);


// Obtener todas las multas del usuario logueado
router.get('/', ctrl.getMultasByUsuario);

// Obtener resumen (monto total)
router.get('/resumen', ctrl.getResumenMultas);

export default router;