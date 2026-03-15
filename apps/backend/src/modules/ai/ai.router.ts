import { Router } from 'express';
import { startSession, continueSession, confirmSession } from './ai.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { startSessionSchema, continueSessionSchema } from './ai.schemas';

const router = Router();

router.use(authenticate);
router.post('/sessions', validateBody(startSessionSchema), startSession);
router.post('/sessions/:sessionId/messages', validateBody(continueSessionSchema), continueSession);
router.post('/sessions/:sessionId/confirm', confirmSession);

export default router;
