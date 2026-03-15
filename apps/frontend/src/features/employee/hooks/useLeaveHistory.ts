import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../api/employee.api';
import { QUERY_KEYS } from '../../../lib/constants';

interface Filters {
  page?: number;
  limit?: number;
  status?: string;
  leaveTypeId?: string;
  year?: number;
}

export function useLeaveHistory(filters: Filters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.leaveHistory, filters],
    queryFn: () => employeeApi.getLeaveHistory(filters),
  });
}
