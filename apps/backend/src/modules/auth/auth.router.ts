import { Router } from 'express';
import { register, login, refresh, logout, getMe } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from './auth.schemas';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refresh);
router.post('/logout', validateBody(logoutSchema), logout);
router.get('/me', authenticate, getMe);

export default router;
