import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../api/employee.api';
import { QUERY_KEYS } from '../../../lib/constants';

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: employeeApi.getDashboard,
  });
}
