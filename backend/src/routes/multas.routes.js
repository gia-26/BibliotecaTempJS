import {Router} from 'express';
import * as ctrl from '../controllers/multas.controllers.js';

const router = Router();

router.get('/', ctrl.getAllMultas);

export default router;