import { Request, Response, NextFunction } from 'express';
import { LeaveTypesRepository } from './leave-types.repository';
import { success } from '../../lib/api-response';

const repo = new LeaveTypesRepository();

export async function getLeaveTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const leaveTypes = await repo.findByOrganizationId(req.user!.orgId);
    return success(res, leaveTypes);
  } catch (err) {
    return next(err);
  }
}
