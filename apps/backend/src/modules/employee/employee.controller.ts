import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service';
import { success, paginated } from '../../lib/api-response';
import { LeaveStatus } from '@prisma/client';

const employeeService = new EmployeeService();

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await employeeService.getDashboard(req.user!.sub, req.user!.orgId);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getLeaveBalances(req: Request, res: Response, next: NextFunction) {
  try {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const data = await employeeService.getLeaveBalances(req.user!.sub, year);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function getLeaveHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as LeaveStatus | undefined;
    const leaveTypeId = req.query.leaveTypeId as string | undefined;
    const year = req.query.year ? Number(req.query.year) : undefined;

    const { data, total } = await employeeService.getLeaveHistory(req.user!.sub, {
      status, leaveTypeId, year, page, limit,
    });
    return paginated(res, data, { total, page, limit });
  } catch (err) {
    return next(err);
  }
}

export async function submitLeaveRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await employeeService.submitLeaveRequest({
      requesterId: req.user!.sub,
      orgId: req.user!.orgId,
      ...req.body,
    });
    return success(res, data, 201);
  } catch (err) {
    return next(err);
  }
}

export async function cancelLeaveRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await employeeService.cancelLeaveRequest(req.params.id, req.user!.sub, req.user!.orgId);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}
