import { Link } from 'react-router-dom';
import { useManagerDashboard } from '../features/manager/hooks/useManagerDashboard';
import { ManagerStatsBar } from '../features/manager/components/ManagerStatsBar';
import { Card } from '../components/ui/Card';
import { PageSpinner } from '../components/ui/Spinner';

export default function ManagerDashboardPage() {
  const { data, isLoading } = useManagerDashboard();

  if (isLoading) return <PageSpinner />;
  if (!data) return <div className="text-red-500 text-sm">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Manager Dashboard</h2>
        <p className="text-gray-500 text-sm mt-0.5">Overview of your team's leave activity.</p>
      </div>

      <ManagerStatsBar
        pendingCount={data.pendingCount}
        approvedThisMonth={data.approvedThisMonth}
        rejectedThisMonth={data.rejectedThisMonth}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team on leave today */}
        <Card title="Team On Leave Today">
          {data.teamOnLeaveToday.length === 0 ? (
            <p className="text-sm text-gray-400">No one is on leave today.</p>
          ) : (
            <ul className="space-y-2">
              {data.teamOnLeaveToday.map(member => (
                <li key={member.id} className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <span className="flex-1 font-medium text-gray-900">{member.firstName} {member.lastName}</span>
                  <span className="text-xs text-gray-400">{member.leaveType}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Quick action */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link
              to="/manager/requests?status=PENDING"
              className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <span className="text-sm font-medium text-yellow-800">Pending Approvals</span>
              <span className="text-xl font-bold text-yellow-700">{data.pendingCount}</span>
            </Link>
            <Link
              to="/manager/requests"
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">View All Requests</span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
