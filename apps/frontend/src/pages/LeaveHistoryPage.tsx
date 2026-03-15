import { useState } from 'react';
import { useLeaveHistory } from '../features/employee/hooks/useLeaveHistory';
import { LeaveHistoryTable } from '../features/employee/components/LeaveHistoryTable';
import { Pagination } from '../components/ui/Pagination';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function LeaveHistoryPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const currentYear = new Date().getFullYear();

  const { data, isLoading } = useLeaveHistory({
    page,
    limit: 10,
    status: status || undefined,
    year: currentYear,
  });

  return (
    <div className="max-w-5xl space-y-4">
      <Card title="Leave History">
        <div className="flex gap-3 mb-4">
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <>
            <LeaveHistoryTable requests={data?.data ?? []} showCancel />
            {data && (
              <Pagination
                page={page}
                total={data.meta.total}
                limit={data.meta.limit}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
}
