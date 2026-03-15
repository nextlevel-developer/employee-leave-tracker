import { api } from '../../../lib/axios';
import { LeaveRequest } from '@leave-tracker/shared-types';

interface ManagerDashboardData {
  pendingCount: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  teamOnLeaveToday: Array<{
    id: string;
    firstName: string;
    lastName: string;
    leaveType: string;
  }>;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

interface RequestFilters {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
  leaveTypeId?: string;
}

export const managerApi = {
  getDashboard: async (): Promise<ManagerDashboardData> => {
    const res = await api.get('/manager/dashboard');
    return res.data.data;
  },

  getLeaveRequests: async (filters: RequestFilters = {}): Promise<PaginatedResponse<LeaveRequest>> => {
    const res = await api.get('/manager/leave-requests', { params: filters });
    return { data: res.data.data, meta: res.data.meta };
  },

  approveRequest: async (id: string): Promise<unknown> => {
    const res = await api.patch(`/manager/leave-requests/${id}/approve`);
    return res.data.data;
  },

  rejectRequest: async (id: string, rejectionReason: string): Promise<unknown> => {
    const res = await api.patch(`/manager/leave-requests/${id}/reject`, { rejectionReason });
    return res.data.data;
  },
};
