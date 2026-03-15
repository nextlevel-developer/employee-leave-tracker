import { Notification } from '@leave-tracker/shared-types';
import { useMarkAsRead } from '../hooks/useNotifications';

interface Props {
  notifications: Notification[];
}

const typeIcons: Record<string, string> = {
  LEAVE_SUBMITTED: '📋',
  LEAVE_APPROVED:  '✅',
  LEAVE_REJECTED:  '❌',
  LEAVE_CANCELLED: '🚫',
  GENERAL:         '🔔',
};

export function NotificationList({ notifications }: Props) {
  const markRead = useMarkAsRead();

  if (notifications.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">No notifications yet.</p>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {notifications.map(n => (
        <button
          key={n.id}
          onClick={() => !n.isRead && markRead.mutate(n.id)}
          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-primary-50' : ''}`}
        >
          <div className="flex gap-3 items-start">
            <span className="text-lg flex-shrink-0">{typeIcons[n.type] || '🔔'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium text-gray-900 ${!n.isRead ? 'font-semibold' : ''}`}>
                {n.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />}
          </div>
        </button>
      ))}
    </div>
  );
}
