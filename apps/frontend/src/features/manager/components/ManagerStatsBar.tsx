interface Props {
  pendingCount: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
}

export function ManagerStatsBar({ pendingCount, approvedThisMonth, rejectedThisMonth }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm text-gray-500">Pending Approval</p>
        <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm text-gray-500">Approved This Month</p>
        <p className="text-3xl font-bold text-green-600 mt-1">{approvedThisMonth}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <p className="text-sm text-gray-500">Rejected This Month</p>
        <p className="text-3xl font-bold text-red-600 mt-1">{rejectedThisMonth}</p>
      </div>
    </div>
  );
}
