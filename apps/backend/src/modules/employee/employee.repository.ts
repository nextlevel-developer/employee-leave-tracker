import { prisma } from '../../config/database';
import { LeaveStatus } from '@prisma/client';

const leaveRequestInclude = {
  leaveType: true,
  reviewer: { select: { firstName: true, lastName: true } },
};

export class EmployeeRepository {
  async getLeaveBalances(userId: string, year: number) {
    return prisma.leaveBalance.findMany({
      where: { userId, year },
      include: { leaveType: true },
    });
  }

  async getLeaveHistory(
    userId: string,
    filters: { status?: LeaveStatus; leaveTypeId?: string; year?: number; page: number; limit: number }
  ) {
    const { page, limit, status, leaveTypeId, year } = filters;
    const where: Record<string, unknown> = { requesterId: userId };
    if (status) where.status = status;
    if (leaveTypeId) where.leaveTypeId = leaveTypeId;
    if (year) {
      where.startDate = { gte: new Date(`${year}-01-01`) };
      where.endDate = { lte: new Date(`${year}-12-31`) };
    }

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

  async getRecentRequests(userId: string, limit = 5) {
    return prisma.leaveRequest.findMany({
      where: { requesterId: userId },
      include: leaveRequestInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findOverlappingRequest(userId: string, startDate: Date, endDate: Date, excludeId?: string) {
    return prisma.leaveRequest.findFirst({
      where: {
        requesterId: userId,
        status: { in: ['PENDING', 'APPROVED'] },
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
      },
    });
  }

  async getBalance(userId: string, leaveTypeId: string, year: number) {
    return prisma.leaveBalance.findUnique({
      where: { userId_leaveTypeId_year: { userId, leaveTypeId, year } },
    });
  }

  async createLeaveRequest(data: {
    requesterId: string;
    leaveTypeId: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    reason?: string;
    aiGenerated?: boolean;
    aiSessionId?: string;
  }) {
    return prisma.leaveRequest.create({
      data,
      include: leaveRequestInclude,
    });
  }

  async updateBalancePending(userId: string, leaveTypeId: string, year: number, delta: number) {
    return prisma.leaveBalance.update({
      where: { userId_leaveTypeId_year: { userId, leaveTypeId, year } },
      data: { pendingDays: { increment: delta } },
    });
  }

  async findRequestById(id: string, requesterId: string) {
    return prisma.leaveRequest.findFirst({
      where: { id, requesterId },
      include: leaveRequestInclude,
    });
  }

  async cancelRequest(id: string) {
    return prisma.leaveRequest.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
