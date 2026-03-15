import { Navigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { useAuthStore } from '../features/auth/stores/auth.store';

export default function LoginPage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);

  if (isAuthenticated && user) {
    const dest = user.role === 'MANAGER' || user.role === 'ADMIN' ? '/manager/dashboard' : '/dashboard';
    return <Navigate to={dest} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">LT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <LoginForm />
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Demo: alice@acme.com / Password123! (employee) · manager@acme.com (manager)
        </p>
      </div>
    </div>
  );
}
