import { api } from '../../../lib/axios';
import { DashboardData, LeaveBalance, LeaveRequest, SubmitLeaveRequest } from '@leave-tracker/shared-types';

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

interface LeaveHistoryFilters {
  page?: number;
  limit?: number;
  status?: string;
  leaveTypeId?: string;
  year?: number;
}

export const employeeApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const res = await api.get('/employees/dashboard');
    return res.data.data;
  },

  getBalances: async (year?: number): Promise<LeaveBalance[]> => {
    const res = await api.get('/employees/balances', { params: { year } });
    return res.data.data;
  },

  getLeaveHistory: async (filters: LeaveHistoryFilters = {}): Promise<PaginatedResponse<LeaveRequest>> => {
    const res = await api.get('/employees/leave-history', { params: filters });
    return { data: res.data.data, meta: res.data.meta };
  },

  submitLeaveRequest: async (data: SubmitLeaveRequest): Promise<LeaveRequest> => {
    const res = await api.post('/employees/leave-requests', data);
    return res.data.data;
  },

  cancelLeaveRequest: async (id: string): Promise<{ id: string; status: string }> => {
    const res = await api.delete(`/employees/leave-requests/${id}`);
    return res.data.data;
  },
};
