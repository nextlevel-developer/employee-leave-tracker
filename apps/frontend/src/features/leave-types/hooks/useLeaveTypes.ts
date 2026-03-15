import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { LeaveType } from '@leave-tracker/shared-types';
import { QUERY_KEYS } from '../../../lib/constants';

export function useLeaveTypes() {
  return useQuery({
    queryKey: QUERY_KEYS.leaveTypes,
    queryFn: async (): Promise<LeaveType[]> => {
      const res = await api.get('/leave-types');
      return res.data.data;
    },
  });
}
