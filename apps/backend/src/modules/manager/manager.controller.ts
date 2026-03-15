import { Request, Response, NextFunction } from 'express';
import { ManagerService } from './manager.service';
import { success, paginated } from '../../lib/api-response';
import { LeaveStatus } from '@prisma/client';

const managerService = new ManagerService();

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await managerService.getDashboard(req.user!.orgId);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getLeaveRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as LeaveStatus | undefined;
    const employeeId = req.query.employeeId as string | undefined;
    const leaveTypeId = req.query.leaveTypeId as string | undefined;

    const { data, total } = await managerService.getLeaveRequests(req.user!.orgId, {
      status, employeeId, leaveTypeId, page, limit,
    });
    return paginated(res, data, { total, page, limit });
  } catch (err) {
    return next(err);
  }
}

export async function approveRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await managerService.approveRequest(req.params.id, req.user!.sub);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function rejectRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await managerService.rejectRequest(
      req.params.id,
      req.user!.sub,
      req.body.rejectionReason
    );
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}
