import { Router } from 'express';
import * as ctrl from '../controllers/reportes.controllers.js';

const router = Router();

// Endpoint para las tarjetas de estadísticas superiores
router.get('/dashboard', ctrl.getDashboardStats);

// Endpoint para obtener los datos de la tabla (acepta query params: tipo, inicio, fin)
router.get('/', ctrl.getReporte);

export default router;