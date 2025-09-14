import { Router } from 'express';
import { authController } from '../controllers/index';

const router = Router();

router.get('/figma', authController.startOAuth.bind(authController));
router.get('/figma/callback', authController.oAuthCallback.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;