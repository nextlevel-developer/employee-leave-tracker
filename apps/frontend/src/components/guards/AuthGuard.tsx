import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/auth.store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
