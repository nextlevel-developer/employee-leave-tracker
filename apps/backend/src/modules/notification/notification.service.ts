import { NotificationRepository } from './notification.repository';
import { prisma } from '../../config/database';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  private repo = new NotificationRepository();

  async notifyManagers(data: {
    orgId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }) {
    const managers = await prisma.user.findMany({
      where: {
        organizationId: data.orgId,
        role: { in: ['MANAGER', 'ADMIN'] },
        isActive: true,
      },
      select: { id: true },
    });

    if (managers.length === 0) return;

    await this.repo.createMany(
      managers.map(m => ({
        userId: m.id,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
      }))
    );
  }

  async notifyUser(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.repo.create(data);
  }

  async getNotifications(userId: string, filters: { isRead?: boolean; page: number; limit: number }) {
    return this.repo.findByUserId(userId, filters);
  }

  async getUnreadCount(userId: string) {
    return this.repo.getUnreadCount(userId);
  }

  async markAsRead(id: string, userId: string) {
    await this.repo.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    return this.repo.markAllAsRead(userId);
  }
}
