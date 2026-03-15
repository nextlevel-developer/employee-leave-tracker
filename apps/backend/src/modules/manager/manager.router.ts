import { Router } from 'express';
import { getDashboard, getLeaveRequests, approveRequest, rejectRequest } from './manager.controller';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { rejectSchema } from './manager.schemas';

const router = Router();

router.use(authenticate, requireRole('MANAGER', 'ADMIN'));
router.get('/dashboard', getDashboard);
router.get('/leave-requests', getLeaveRequests);
router.patch('/leave-requests/:id/approve', approveRequest);
router.patch('/leave-requests/:id/reject', validateBody(rejectSchema), rejectRequest);

export default router;
