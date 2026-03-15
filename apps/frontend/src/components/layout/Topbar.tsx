import { NotificationBell } from '../../features/notifications/components/NotificationBell';

interface Props {
  title: string;
  onMenuClick?: () => void;
}

export function Topbar({ title, onMenuClick }: Props) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <h1 className="font-semibold text-gray-900">{title}</h1>
      </div>
      <NotificationBell />
    </header>
  );
}
