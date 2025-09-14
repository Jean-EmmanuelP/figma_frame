import { Router } from 'express';
import { authController } from '../controllers/index';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/profile', requireAuth, authController.getProfile.bind(authController));

export default router;