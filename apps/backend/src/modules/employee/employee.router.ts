import { Router } from 'express';
import { getDashboard, getLeaveBalances, getLeaveHistory, submitLeaveRequest, cancelLeaveRequest } from './employee.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { submitLeaveSchema } from './employee.schemas';

const router = Router();

router.use(authenticate);
router.get('/dashboard', getDashboard);
router.get('/balances', getLeaveBalances);
router.get('/leave-history', getLeaveHistory);
router.post('/leave-requests', validateBody(submitLeaveSchema), submitLeaveRequest);
router.delete('/leave-requests/:id', cancelLeaveRequest);

export default router;
