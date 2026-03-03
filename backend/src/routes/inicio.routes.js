import { Router } from "express";
import * as ctrl from '../controllers/inicio.controllers.js';

const router = Router();

router.get('/libros', ctrl.getAllLibros);
router.get('/info-biblioteca', ctrl.getAllInfoBiblioteca);
router.get('/personal', ctrl.getAllPersonal);

export default router;