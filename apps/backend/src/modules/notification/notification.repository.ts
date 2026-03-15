import { prisma } from '../../config/database';
import { NotificationType, Prisma } from '@prisma/client';

interface NotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export class NotificationRepository {
  async create(data: NotificationInput) {
    return prisma.notification.create({
      data: {
        ...data,
        metadata: data.metadata as Prisma.InputJsonValue ?? Prisma.JsonNull,
      },
    });
  }

  async createMany(notifications: NotificationInput[]) {
    return prisma.notification.createMany({
      data: notifications.map(n => ({
        ...n,
        metadata: n.metadata as Prisma.InputJsonValue ?? Prisma.JsonNull,
      })),
    });
  }

  async findByUserId(userId: string, filters: { isRead?: boolean; page: number; limit: number }) {
    const { page, limit, isRead } = filters;
    const where: { userId: string; isRead?: boolean } = { userId };
    if (isRead !== undefined) where.isRead = isRead;

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return { data, total };
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
