export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  allowancePerYear: number;
  color: string;
  requiresApproval: boolean;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveType: LeaveType;
  year: number;
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
}

export interface LeaveRequest {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  status: LeaveStatus;
  rejectionReason: string | null;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  reviewer?: {
    firstName: string;
    lastName: string;
  } | null;
  requester?: {
    id: string;
    firstName: string;
    lastName: string;
    department: string | null;
    avatarUrl: string | null;
  };
}

export interface SubmitLeaveRequest {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface DashboardData {
  user: {
    firstName: string;
    lastName: string;
  };
  balances: LeaveBalance[];
  recentRequests: LeaveRequest[];
  unreadNotificationCount: number;
}
