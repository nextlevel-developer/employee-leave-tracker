import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { QUERY_KEYS } from '../../../lib/constants';
import { useAuthStore } from '../../auth/stores/auth.store';

export function useUnreadCount() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.unreadCount,
    queryFn: notificationsApi.getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 30_000,
  });
}
