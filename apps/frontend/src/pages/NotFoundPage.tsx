import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-gray-500 mt-2">Page not found</p>
        <Link to="/" className="mt-4 inline-block text-primary-600 hover:underline text-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}
