import { Router } from 'express';
import { framesController } from '../controllers/index';

const router = Router();

router.get('/', framesController.getFrames.bind(framesController));
router.get('/:id', framesController.getFrame.bind(framesController));
router.get('/:id/code', framesController.getFrameCode.bind(framesController));

export default router;