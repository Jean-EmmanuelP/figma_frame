import { Router } from 'express';
import framesRoutes from './frames';
import healthRoutes from './health';
import authRoutes from './auth';
import sidebarRoutes from './sidebar';
import meRoutes from './me';

const router = Router();

router.use('/frames', framesRoutes);
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/me', sidebarRoutes);
router.use('/me', meRoutes);

export default router;