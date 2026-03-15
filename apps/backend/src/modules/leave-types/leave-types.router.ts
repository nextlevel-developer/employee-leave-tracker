import { Router } from 'express';
import { getLeaveTypes } from './leave-types.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getLeaveTypes);

export default router;
