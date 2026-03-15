import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/auth.store';
import { useLogout } from '../../features/auth/hooks/useAuth';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const EmployeeNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
  { to: '/apply-leave', label: 'Apply Leave', icon: <PlusIcon /> },
  { to: '/leave-history', label: 'Leave History', icon: <ClockIcon /> },
];

const ManagerNav: NavItem[] = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
  { to: '/manager/requests', label: 'Leave Requests', icon: <ListIcon /> },
];

export function Sidebar({ isMobile, onClose }: { isMobile?: boolean; onClose?: () => void }) {
  const user = useAuthStore(s => s.user);
  const logout = useLogout();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';
  const navItems = isManager ? ManagerNav : EmployeeNav;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">LT</span>
          <span className="font-semibold text-gray-900">Leave Tracker</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="w-full text-left text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function HomeIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}

function PlusIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}

function ClockIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function ListIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
}
