import { useQuery } from '@tanstack/react-query';
import { managerApi } from '../api/manager.api';
import { QUERY_KEYS } from '../../../lib/constants';

interface Filters {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
  leaveTypeId?: string;
}

export function useManagerLeaveRequests(filters: Filters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.managerRequests, filters],
    queryFn: () => managerApi.getLeaveRequests(filters),
  });
}
