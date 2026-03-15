import { LeaveBalance } from '@leave-tracker/shared-types';

export function LeaveBalanceCard({ balance }: { balance: LeaveBalance }) {
  const { leaveType, totalDays, usedDays, pendingDays, remainingDays } = balance;
  const usedPercent = totalDays > 0 ? Math.min(100, Math.round((usedDays / totalDays) * 100)) : 0;
  const pendingPercent = totalDays > 0 ? Math.min(100 - usedPercent, Math.round((pendingDays / totalDays) * 100)) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: leaveType.color }}
          />
          <span className="font-medium text-gray-900 text-sm">{leaveType.name}</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">{remainingDays}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div className="flex h-2 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-l-full"
            style={{ width: `${usedPercent}%`, backgroundColor: leaveType.color }}
          />
          <div
            className="h-2"
            style={{ width: `${pendingPercent}%`, backgroundColor: leaveType.color, opacity: 0.4 }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{usedDays} used · {pendingDays} pending</span>
        <span>{totalDays} total days</span>
      </div>
    </div>
  );
}
