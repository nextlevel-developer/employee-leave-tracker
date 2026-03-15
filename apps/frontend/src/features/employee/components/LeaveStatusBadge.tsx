import { LeaveStatus } from '@leave-tracker/shared-types';

const statusConfig: Record<LeaveStatus, { label: string; classes: string }> = {
  PENDING:   { label: 'Pending',   classes: 'bg-yellow-100 text-yellow-800' },
  APPROVED:  { label: 'Approved',  classes: 'bg-green-100 text-green-800' },
  REJECTED:  { label: 'Rejected',  classes: 'bg-red-100 text-red-800' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-gray-100 text-gray-600' },
};

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}
