import React from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'CUSTOMER' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-6">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
        <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Go Home
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
