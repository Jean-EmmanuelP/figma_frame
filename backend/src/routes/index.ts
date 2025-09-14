import { Router } from 'express';
import framesRoutes from './frames';
import healthRoutes from './health';

const router = Router();

router.use('/frames', framesRoutes);
router.use('/health', healthRoutes);

export default router;