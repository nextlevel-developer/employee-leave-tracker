export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const QUERY_KEYS = {
  dashboard: ['dashboard'],
  leaveHistory: ['leave-history'],
  balances: ['balances'],
  notifications: ['notifications'],
  unreadCount: ['notifications', 'unread-count'],
  managerDashboard: ['manager', 'dashboard'],
  managerRequests: ['manager', 'requests'],
  leaveTypes: ['leave-types'],
  me: ['me'],
} as const;
