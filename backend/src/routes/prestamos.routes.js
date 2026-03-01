import {Router} from 'express';
import * as ctrl from '../controllers/prestamos.controllers.js';

const router = Router();

router.get('/ejemplares', ctrl.getAllEjemplares);
router.get('/tipos', ctrl.getAllTiposPrestamos);
router.post('/registrar', ctrl.registrarPrestamo);

export default router;