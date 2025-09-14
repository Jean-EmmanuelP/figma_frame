import { Router } from 'express';
import { healthController } from '../controllers/index';

const router = Router();

router.get('/', healthController.getHealth.bind(healthController));

export default router;