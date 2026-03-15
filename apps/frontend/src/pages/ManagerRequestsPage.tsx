import { useState } from 'react';
import { useManagerLeaveRequests } from '../features/manager/hooks/useLeaveRequests';
import { PendingRequestsTable } from '../features/manager/components/PendingRequestsTable';
import { Pagination } from '../components/ui/Pagination';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: '', label: 'All' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function ManagerRequestsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('PENDING');

  const { data, isLoading } = useManagerLeaveRequests({
    page,
    limit: 10,
    status: status || undefined,
  });

  return (
    <div className="max-w-6xl space-y-4">
      <Card title="Leave Requests">
        <div className="flex gap-2 mb-4">
          {STATUS_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => { setStatus(o.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                status === o.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <>
            <PendingRequestsTable requests={data?.data ?? []} />
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
