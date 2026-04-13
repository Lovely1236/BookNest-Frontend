import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api/authService';
import { LoginPayload, RegisterPayload } from '../types/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const { login, logout: storeLogout, user, isAuthenticated, isAdmin } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.fullName}!`);
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
    },
    onError: () => {
      toast.error('Invalid email or password');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: () => {
      toast.error('Registration failed. Please try again.');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      storeLogout();
      toast.success('Logged out successfully');
      navigate('/login');
    },
  });

  return {
    user,
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};
