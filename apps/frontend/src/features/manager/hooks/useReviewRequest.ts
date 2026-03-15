import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerApi } from '../api/manager.api';
import { QUERY_KEYS } from '../../../lib/constants';

export function useApproveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => managerApi.approveRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.managerRequests });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.managerDashboard });
    },
  });
}

export function useRejectRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) =>
      managerApi.rejectRequest(id, rejectionReason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.managerRequests });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.managerDashboard });
    },
  });
}
