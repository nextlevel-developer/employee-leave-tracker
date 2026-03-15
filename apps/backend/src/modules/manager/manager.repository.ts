import { prisma } from '../../config/database';
import { LeaveStatus } from '@prisma/client';

const leaveRequestInclude = {
  leaveType: true,
  requester: {
    select: { id: true, firstName: true, lastName: true, department: true, avatarUrl: true },
  },
  reviewer: { select: { firstName: true, lastName: true } },
};

export class ManagerRepository {
  async getRequests(
    orgId: string,
    filters: { status?: LeaveStatus; employeeId?: string; leaveTypeId?: string; page: number; limit: number }
  ) {
    const { page, limit, status, employeeId, leaveTypeId } = filters;
    const where: Record<string, unknown> = {
      requester: { organizationId: orgId },
    };
    if (status) where.status = status;
    if (employeeId) where.requesterId = employeeId;
    if (leaveTypeId) where.leaveTypeId = leaveTypeId;

    const [data, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        include: leaveRequestInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.leaveRequest.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return prisma.leaveRequest.findUnique({
      where: { id },
      include: { ...leaveRequestInclude, requester: true },
    });
  }

  async approveRequest(id: string, reviewerId: string) {
    return prisma.leaveRequest.update({
      where: { id },
      data: { status: 'APPROVED', reviewerId, reviewedAt: new Date() },
      include: leaveRequestInclude,
    });
  }

  async rejectRequest(id: string, reviewerId: string, rejectionReason: string) {
    return prisma.leaveRequest.update({
      where: { id },
      data: { status: 'REJECTED', reviewerId, rejectionReason, reviewedAt: new Date() },
      include: leaveRequestInclude,
    });
  }

  async updateBalanceOnApprove(userId: string, leaveTypeId: string, year: number, totalDays: number) {
    return prisma.leaveBalance.update({
      where: { userId_leaveTypeId_year: { userId, leaveTypeId, year } },
      data: {
        pendingDays: { decrement: totalDays },
        usedDays: { increment: totalDays },
      },
    });
  }

  async updateBalanceOnReject(userId: string, leaveTypeId: string, year: number, totalDays: number) {
    return prisma.leaveBalance.update({
      where: { userId_leaveTypeId_year: { userId, leaveTypeId, year } },
      data: { pendingDays: { decrement: totalDays } },
    });
  }

  async getTeamOnLeaveToday(orgId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.leaveRequest.findMany({
      where: {
        status: 'APPROVED',
        startDate: { lte: tomorrow },
        endDate: { gte: today },
        requester: { organizationId: orgId },
      },
      include: {
        requester: { select: { id: true, firstName: true, lastName: true } },
        leaveType: { select: { name: true } },
      },
    });
  }

  async getMonthlyStats(orgId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.leaveRequest.count({
        where: { status: 'PENDING', requester: { organizationId: orgId } },
      }),
      prisma.leaveRequest.count({
        where: {
          status: 'APPROVED',
          reviewedAt: { gte: startOfMonth },
          requester: { organizationId: orgId },
        },
      }),
      prisma.leaveRequest.count({
        where: {
          status: 'REJECTED',
          reviewedAt: { gte: startOfMonth },
          requester: { organizationId: orgId },
        },
      }),
    ]);

    return { pendingCount, approvedCount, rejectedCount };
  }
}
