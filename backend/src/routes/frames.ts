import { Router } from 'express';
import { framesController } from '../controllers/index';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, framesController.getFrames.bind(framesController));
router.get('/:id', optionalAuth, framesController.getFrame.bind(framesController));
router.get('/:id/code', optionalAuth, framesController.getFrameCode.bind(framesController));

export default router;