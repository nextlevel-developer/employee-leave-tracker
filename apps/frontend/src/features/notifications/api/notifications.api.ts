import { api } from '../../../lib/axios';
import { Notification } from '@leave-tracker/shared-types';

export const notificationsApi = {
  getNotifications: async (params?: { page?: number; limit?: number; isRead?: boolean }) => {
    const res = await api.get('/notifications', { params });
    return {
      data: res.data.data as Notification[],
      meta: res.data.meta as { total: number; page: number; limit: number },
    };
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get('/notifications/unread-count');
    return res.data.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
