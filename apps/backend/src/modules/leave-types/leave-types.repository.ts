import { prisma } from '../../config/database';

export class LeaveTypesRepository {
  async findByOrganizationId(organizationId: string) {
    return prisma.leaveType.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findByCode(organizationId: string, code: string) {
    return prisma.leaveType.findUnique({
      where: { organizationId_code: { organizationId, code } },
    });
  }
}
