import { EmployeeRepository } from './employee.repository';
import { NotificationService } from '../notification/notification.service';
import { AppError } from '../../types/errors';
import { calcBusinessDays, isDateInPast, getCurrentYear } from '../../lib/date.utils';
import { LeaveStatus } from '@prisma/client';

export class EmployeeService {
  private repo = new EmployeeRepository();
  private notifService = new NotificationService();

  async getDashboard(userId: string, orgId: string) {
    const year = getCurrentYear();
    const [balancesRaw, recentRequests, unreadCount, user] = await Promise.all([
      this.repo.getLeaveBalances(userId, year),
      this.repo.getRecentRequests(userId, 5),
      this.notifService.getUnreadCount(userId),
      this._getUser(userId),
    ]);

    const balances = balancesRaw.map(b => ({
      leaveType: {
        id: b.leaveType.id,
        name: b.leaveType.name,
        code: b.leaveType.code,
        color: b.leaveType.color,
        allowancePerYear: b.leaveType.allowancePerYear,
        requiresApproval: b.leaveType.requiresApproval,
      },
      totalDays: b.totalDays,
      usedDays: b.usedDays,
      pendingDays: b.pendingDays,
      remainingDays: Math.max(0, b.totalDays - b.usedDays - b.pendingDays),
    }));

    return {
      user: { firstName: user.firstName, lastName: user.lastName },
      balances,
      recentRequests: recentRequests.map(this._formatRequest),
      unreadNotificationCount: unreadCount,
    };
  }

  async getLeaveBalances(userId: string, year?: number) {
    const targetYear = year || getCurrentYear();
    const balances = await this.repo.getLeaveBalances(userId, targetYear);
    return balances.map(b => ({
      leaveTypeId: b.leaveTypeId,
      leaveType: {
        id: b.leaveType.id,
        name: b.leaveType.name,
        code: b.leaveType.code,
        color: b.leaveType.color,
        allowancePerYear: b.leaveType.allowancePerYear,
        requiresApproval: b.leaveType.requiresApproval,
      },
      year: b.year,
      totalDays: b.totalDays,
      usedDays: b.usedDays,
      pendingDays: b.pendingDays,
      remainingDays: Math.max(0, b.totalDays - b.usedDays - b.pendingDays),
    }));
  }

  async getLeaveHistory(
    userId: string,
    filters: { status?: LeaveStatus; leaveTypeId?: string; year?: number; page: number; limit: number }
  ) {
    const { data, total } = await this.repo.getLeaveHistory(userId, filters);
    return { data: data.map(this._formatRequest), total };
  }

  async submitLeaveRequest(data: {
    requesterId: string;
    orgId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason?: string;
    aiGenerated?: boolean;
    aiSessionId?: string;
  }) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (isDateInPast(start)) {
      throw AppError.validation('Start date cannot be in the past');
    }

    if (end < start) {
      throw AppError.validation('End date must be after start date');
    }

    const overlap = await this.repo.findOverlappingRequest(data.requesterId, start, end);
    if (overlap) {
      throw AppError.dateConflict('You already have a leave request for this period');
    }

    const totalDays = calcBusinessDays(start, end);
    const year = start.getFullYear();

    const balance = await this.repo.getBalance(data.requesterId, data.leaveTypeId, year);
    if (!balance) {
      throw AppError.validation('No leave balance found for this leave type');
    }

    const remaining = balance.totalDays - balance.usedDays - balance.pendingDays;
    // totalDays === 365 means unlimited (Unpaid Leave)
    if (balance.totalDays !== 365 && remaining < totalDays) {
      throw AppError.insufficientBalance(
        `Insufficient balance. You have ${remaining} days remaining but requested ${totalDays} days`
      );
    }

    const request = await this.repo.createLeaveRequest({
      requesterId: data.requesterId,
      leaveTypeId: data.leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays,
      reason: data.reason,
      aiGenerated: data.aiGenerated,
      aiSessionId: data.aiSessionId,
    });

    await this.repo.updateBalancePending(data.requesterId, data.leaveTypeId, year, totalDays);

    // Notify managers
    const formatted = this._formatRequest(request);
    await this.notifService.notifyManagers({
      orgId: data.orgId,
      type: 'LEAVE_SUBMITTED',
      title: 'New Leave Request',
      message: `${formatted.leaveType.name} request submitted for ${totalDays} day(s)`,
      metadata: { leaveRequestId: request.id },
    });

    return this._formatRequest(request);
  }

  async cancelLeaveRequest(requestId: string, userId: string, orgId: string) {
    const request = await this.repo.findRequestById(requestId, userId);
    if (!request) throw AppError.notFound('Leave request not found');
    if (request.status !== 'PENDING') {
      throw AppError.requestNotPending('Only PENDING requests can be cancelled');
    }

    await this.repo.cancelRequest(requestId);
    const year = request.startDate.getFullYear();
    await this.repo.updateBalancePending(userId, request.leaveTypeId, year, -request.totalDays);

    return { id: requestId, status: 'CANCELLED' };
  }

  private async _getUser(userId: string) {
    const { prisma } = await import('../../config/database');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User not found');
    return user;
  }

  private _formatRequest(request: any) {
    return {
      id: request.id,
      leaveType: {
        id: request.leaveType.id,
        name: request.leaveType.name,
        code: request.leaveType.code,
        color: request.leaveType.color,
        allowancePerYear: request.leaveType.allowancePerYear,
        requiresApproval: request.leaveType.requiresApproval,
      },
      startDate: request.startDate.toISOString().split('T')[0],
      endDate: request.endDate.toISOString().split('T')[0],
      totalDays: request.totalDays,
      reason: request.reason,
      status: request.status,
      rejectionReason: request.rejectionReason,
      aiGenerated: request.aiGenerated,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      reviewedAt: request.reviewedAt?.toISOString() ?? null,
      reviewer: request.reviewer,
    };
  }
}
