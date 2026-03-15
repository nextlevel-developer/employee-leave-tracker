import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../api/employee.api';
import { QUERY_KEYS } from '../../../lib/constants';
import { SubmitLeaveRequest } from '@leave-tracker/shared-types';

export function useSubmitLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmitLeaveRequest) => employeeApi.submitLeaveRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.leaveHistory });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.balances });
    },
  });
}

export function useCancelLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeApi.cancelLeaveRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.leaveHistory });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.balances });
    },
  });
}
