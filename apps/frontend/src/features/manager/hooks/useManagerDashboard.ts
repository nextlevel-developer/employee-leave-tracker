import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../api/manager.api';
import { QUERY_KEYS } from '../../../lib/constants';

export function useManagerDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.managerDashboard,
    queryFn: managerApi.getDashboard,
  });
}
