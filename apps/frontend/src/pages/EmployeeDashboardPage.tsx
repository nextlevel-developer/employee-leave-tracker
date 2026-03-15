import { Link } from 'react-router-dom';
import { useDashboard } from '../features/employee/hooks/useDashboard';
import { LeaveBalanceCard } from '../features/employee/components/LeaveBalanceCard';
import { LeaveHistoryTable } from '../features/employee/components/LeaveHistoryTable';
import { Card } from '../components/ui/Card';
import { PageSpinner } from '../components/ui/Spinner';

export default function EmployeeDashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <PageSpinner />;
  if (error || !data) return <div className="text-red-500 text-sm">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Good {getGreeting()}, {data.user.firstName}!
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">Here's your leave summary.</p>
      </div>

      {/* Balances */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Leave Balances</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.balances.map(b => (
            <LeaveBalanceCard key={b.leaveTypeId} balance={b} />
          ))}
        </div>
      </section>

      {/* Recent requests */}
      <Card
        title="Recent Requests"
        action={
          <Link to="/leave-history" className="text-sm text-primary-600 hover:underline font-medium">
            View all
          </Link>
        }
      >
        <LeaveHistoryTable requests={data.recentRequests} />
      </Card>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          to="/apply-leave"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Apply for Leave
        </Link>
        <Link
          to="/apply-leave?tab=ai"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <span>🤖</span> Ask AI Assistant
        </Link>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
