import {Router} from 'express';
import * as ctrl from '../controllers/catalogo.controllers.js';

const router = Router();

router.get('/', ctrl.getCatalogo);
router.get('/buscar', ctrl.getCatalogoByBusqueda)

export default router;