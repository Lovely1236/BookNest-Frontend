import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import { OAuthButton } from './OAuthButton';

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register: registerUser, isRegisterLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  const getStrength = (pwd: string) => {
    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /\d/.test(pwd)) return 'Strong';
    if (pwd.length >= 6) return 'Medium';
    if (pwd.length > 0) return 'Weak';
    return '';
  };
  const strength = getStrength(password);
  const strengthColors: Record<string, string> = {
    Weak: 'text-red-500',
    Medium: 'text-yellow-500',
    Strong: 'text-green-600',
  };

  const onSubmit = (data: RegisterFormData) =>
    registerUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
      <p className="text-gray-600 mb-8">Join BookNest and start your reading journey</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register('fullName')}
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {strength && (
            <p className={`text-xs mt-1 ${strengthColors[strength]}`}>
              Password strength: {strength}
            </p>
          )}
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isRegisterLoading}
          className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isRegisterLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-500">or</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <OAuthButton />

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
