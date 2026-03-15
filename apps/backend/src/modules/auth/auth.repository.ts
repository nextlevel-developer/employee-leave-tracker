import { prisma } from '../../config/database';
import { Role } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { organization: true },
    });
  }

  async findOrgBySlug(slug: string) {
    return prisma.organization.findUnique({ where: { slug } });
  }

  async createOrgAndAdmin(data: {
    orgName: string;
    slug: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: data.orgName, slug: data.slug },
      });

      const user = await tx.user.create({
        data: {
          organizationId: org.id,
          email: data.email,
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: Role.ADMIN,
        },
        include: { organization: true },
      });

      // Seed default leave types
      const leaveTypes = await Promise.all([
        tx.leaveType.create({
          data: { organizationId: org.id, name: 'Annual Leave', code: 'ANNUAL', allowancePerYear: 20, color: '#6366f1' },
        }),
        tx.leaveType.create({
          data: { organizationId: org.id, name: 'Sick Leave', code: 'SICK', allowancePerYear: 10, color: '#ef4444', requiresApproval: false },
        }),
        tx.leaveType.create({
          data: { organizationId: org.id, name: 'Unpaid Leave', code: 'UNPAID', allowancePerYear: -1, color: '#f59e0b' },
        }),
      ]);

      // Create balances for admin
      const currentYear = new Date().getFullYear();
      await Promise.all(
        leaveTypes.map(lt =>
          tx.leaveBalance.create({
            data: {
              userId: user.id,
              leaveTypeId: lt.id,
              year: currentYear,
              totalDays: lt.allowancePerYear === -1 ? 365 : lt.allowancePerYear,
            },
          })
        )
      );

      return { org, user };
    });
  }
}
