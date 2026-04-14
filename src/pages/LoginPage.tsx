import React from 'react';
import { Navigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuthStore } from '../stores/authStore';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/'} replace />;

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12 text-white">
        <div className="max-w-sm text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">BookNest</h2>
          <p className="text-blue-100">Your cozy corner for every book lover. Discover, purchase, and review books you love.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
