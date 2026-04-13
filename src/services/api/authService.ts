import apiClient from '../axios';
import { User, AuthResponse, LoginPayload, RegisterPayload } from '../../types/auth';

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },

  githubCallback: async (code: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/github/callback', { code });
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/profile');
    return data;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put('/auth/profile', updates);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },
};
