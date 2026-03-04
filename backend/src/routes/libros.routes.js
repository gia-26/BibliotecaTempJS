import { Router } from 'express';
import * as ctrl from '../controllers/libros.controllers.js';

const router = Router();

router.get('/:id', ctrl.getLibrosById);

export default router;