import { LeaveRequest } from '@leave-tracker/shared-types';
import { LeaveStatusBadge } from '../../employee/components/LeaveStatusBadge';
import { RequestActionButtons } from './RequestActionButtons';

interface Props {
  requests: LeaveRequest[];
}

export function PendingRequestsTable({ requests }: Props) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm">No leave requests found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Employee</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Dates</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Days</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Reason</th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {r.requester?.firstName} {r.requester?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{r.requester?.department}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.leaveType.color }} />
                  {r.leaveType.name}
                  {r.aiGenerated && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">AI</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">{r.startDate} → {r.endDate}</td>
              <td className="py-3 px-4 text-gray-600">{r.totalDays}d</td>
              <td className="py-3 px-4"><LeaveStatusBadge status={r.status} /></td>
              <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{r.reason || '—'}</td>
              <td className="py-3 px-4">
                {r.status === 'PENDING' && <RequestActionButtons requestId={r.id} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
