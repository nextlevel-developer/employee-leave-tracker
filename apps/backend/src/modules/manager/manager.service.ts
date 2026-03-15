import { ManagerRepository } from './manager.repository';
import { NotificationService } from '../notification/notification.service';
import { AppError } from '../../types/errors';
import { LeaveStatus } from '@prisma/client';

export class ManagerService {
  private repo = new ManagerRepository();
  private notifService = new NotificationService();

  async getDashboard(orgId: string) {
    const [stats, teamOnLeave] = await Promise.all([
      this.repo.getMonthlyStats(orgId),
      this.repo.getTeamOnLeaveToday(orgId),
    ]);

    return {
      pendingCount: stats.pendingCount,
      approvedThisMonth: stats.approvedCount,
      rejectedThisMonth: stats.rejectedCount,
      teamOnLeaveToday: teamOnLeave.map(r => ({
        id: r.requester.id,
        firstName: r.requester.firstName,
        lastName: r.requester.lastName,
        leaveType: r.leaveType.name,
      })),
    };
  }

  async getLeaveRequests(
    orgId: string,
    filters: { status?: LeaveStatus; employeeId?: string; leaveTypeId?: string; page: number; limit: number }
  ) {
    const { data, total } = await this.repo.getRequests(orgId, filters);
    return {
      data: data.map(r => ({
        id: r.id,
        requester: {
          id: r.requester.id,
          firstName: r.requester.firstName,
          lastName: r.requester.lastName,
          department: r.requester.department,
          avatarUrl: r.requester.avatarUrl,
        },
        leaveType: {
          id: r.leaveType.id,
          name: r.leaveType.name,
          code: r.leaveType.code,
          color: r.leaveType.color,
          allowancePerYear: r.leaveType.allowancePerYear,
          requiresApproval: r.leaveType.requiresApproval,
        },
        startDate: r.startDate.toISOString().split('T')[0],
        endDate: r.endDate.toISOString().split('T')[0],
        totalDays: r.totalDays,
        reason: r.reason,
        status: r.status,
        aiGenerated: r.aiGenerated,
        createdAt: r.createdAt.toISOString(),
        reviewedAt: r.reviewedAt?.toISOString() ?? null,
        reviewer: r.reviewer,
      })),
      total,
    };
  }

  async approveRequest(requestId: string, reviewerId: string) {
    const request = await this.repo.findById(requestId);
    if (!request) throw AppError.notFound('Leave request not found');
    if (request.status !== 'PENDING') throw AppError.requestNotPending();

    const updated = await this.repo.approveRequest(requestId, reviewerId);
    const year = request.startDate.getFullYear();
    await this.repo.updateBalanceOnApprove(request.requesterId, request.leaveTypeId, year, request.totalDays);

    await this.notifService.notifyUser({
      userId: request.requesterId,
      type: 'LEAVE_APPROVED',
      title: 'Leave Request Approved',
      message: `Your ${request.leaveType.name} from ${request.startDate.toISOString().split('T')[0]} to ${request.endDate.toISOString().split('T')[0]} has been approved.`,
      metadata: { leaveRequestId: requestId },
    });

    return {
      id: updated.id,
      status: updated.status,
      reviewedAt: updated.reviewedAt?.toISOString(),
      reviewer: updated.reviewer,
    };
  }

  async rejectRequest(requestId: string, reviewerId: string, rejectionReason: string) {
    const request = await this.repo.findById(requestId);
    if (!request) throw AppError.notFound('Leave request not found');
    if (request.status !== 'PENDING') throw AppError.requestNotPending();

    const updated = await this.repo.rejectRequest(requestId, reviewerId, rejectionReason);
    const year = request.startDate.getFullYear();
    await this.repo.updateBalanceOnReject(request.requesterId, request.leaveTypeId, year, request.totalDays);

    await this.notifService.notifyUser({
      userId: request.requesterId,
      type: 'LEAVE_REJECTED',
      title: 'Leave Request Rejected',
      message: `Your ${request.leaveType.name} request has been rejected. Reason: ${rejectionReason}`,
      metadata: { leaveRequestId: requestId },
    });

    return {
      id: updated.id,
      status: updated.status,
      rejectionReason: updated.rejectionReason,
      reviewedAt: updated.reviewedAt?.toISOString(),
    };
  }
}
