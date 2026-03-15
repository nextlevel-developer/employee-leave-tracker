import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
    },
  });

  console.log('Organization created:', org.name);

  // Create leave types
  const leaveTypes = await Promise.all([
    prisma.leaveType.upsert({
      where: { organizationId_code: { organizationId: org.id, code: 'ANNUAL' } },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Annual Leave',
        code: 'ANNUAL',
        allowancePerYear: 20,
        color: '#6366f1',
        requiresApproval: true,
      },
    }),
    prisma.leaveType.upsert({
      where: { organizationId_code: { organizationId: org.id, code: 'SICK' } },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Sick Leave',
        code: 'SICK',
        allowancePerYear: 10,
        color: '#ef4444',
        requiresApproval: false,
      },
    }),
    prisma.leaveType.upsert({
      where: { organizationId_code: { organizationId: org.id, code: 'UNPAID' } },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Unpaid Leave',
        code: 'UNPAID',
        allowancePerYear: -1,
        color: '#f59e0b',
        requiresApproval: true,
      },
    }),
  ]);

  console.log('Leave types created:', leaveTypes.map(lt => lt.name).join(', '));

  const passwordHash = await bcrypt.hash('Password123!', 12);
  const currentYear = new Date().getFullYear();

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@acme.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      department: 'Management',
    },
  });

  // Create manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@acme.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'manager@acme.com',
      passwordHash,
      firstName: 'Bob',
      lastName: 'Manager',
      role: Role.MANAGER,
      department: 'Engineering',
    },
  });

  // Create employees
  const employee1 = await prisma.user.upsert({
    where: { email: 'alice@acme.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'alice@acme.com',
      passwordHash,
      firstName: 'Alice',
      lastName: 'Smith',
      role: Role.EMPLOYEE,
      department: 'Engineering',
    },
  });

  const employee2 = await prisma.user.upsert({
    where: { email: 'john@acme.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'john@acme.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.EMPLOYEE,
      department: 'Marketing',
    },
  });

  console.log('Users created:', [admin, manager, employee1, employee2].map(u => u.email).join(', '));

  // Create leave balances for all users
  const users = [admin, manager, employee1, employee2];
  for (const user of users) {
    for (const lt of leaveTypes) {
      const totalDays = lt.allowancePerYear === -1 ? 365 : lt.allowancePerYear;
      await prisma.leaveBalance.upsert({
        where: { userId_leaveTypeId_year: { userId: user.id, leaveTypeId: lt.id, year: currentYear } },
        update: {},
        create: {
          userId: user.id,
          leaveTypeId: lt.id,
          year: currentYear,
          totalDays,
          usedDays: 0,
          pendingDays: 0,
        },
      });
    }
  }

  console.log('Leave balances created for all users');
  console.log('');
  console.log('Seed complete! Login credentials:');
  console.log('  Admin:    admin@acme.com / Password123!');
  console.log('  Manager:  manager@acme.com / Password123!');
  console.log('  Employee: alice@acme.com / Password123!');
  console.log('  Employee: john@acme.com / Password123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
