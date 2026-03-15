import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { QUERY_KEYS } from '../../../lib/constants';

export function useNotifications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEYS.notifications, params],
    queryFn: () => notificationsApi.getNotifications(params),
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount });
    },
  });
}
