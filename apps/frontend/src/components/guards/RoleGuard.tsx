import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/auth.store';
import { Role } from '@leave-tracker/shared-types';

interface Props {
  children: React.ReactNode;
  roles: Role[];
  redirectTo?: string;
}

export function RoleGuard({ children, roles, redirectTo = '/dashboard' }: Props) {
  const user = useAuthStore(s => s.user);
  if (!user || !roles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
