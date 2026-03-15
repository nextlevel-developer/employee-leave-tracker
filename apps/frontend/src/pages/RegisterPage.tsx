import { RegisterForm } from '../features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">LT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your organization</h1>
          <p className="text-gray-500 mt-1 text-sm">Get started with Leave Tracker</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
