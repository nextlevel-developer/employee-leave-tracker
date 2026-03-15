import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../api/employee.api';
import { QUERY_KEYS } from '../../../lib/constants';

export function useLeaveBalances(year?: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.balances, year],
    queryFn: () => employeeApi.getBalances(year),
  });
}
