import apiClient from '../axios';
import { User, AuthResponse, LoginPayload, RegisterPayload } from '../../types/auth';

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      console.log('🔄 Starting registration with payload:', payload);
      const { data } = await apiClient.post('/auth/register', payload);
      console.log('✅ Registration successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      console.log('🔄 Starting login with email:', payload.email);
      const { data } = await apiClient.post('/auth/login', payload);
      console.log('✅ Login successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  githubCallback: async (code: string): Promise<AuthResponse> => {
    try {
      console.log('🔄 Processing GitHub callback with code:', code);
      const { data } = await apiClient.post('/auth/github/callback', { code });
      console.log('✅ GitHub callback successful:', data);
      return data;
    } catch (error) {
      console.error('❌ GitHub callback error:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      console.log('🔄 Fetching current user profile');
      const { data } = await apiClient.get('/auth/profile');
      console.log('✅ User profile fetched:', data);
      return data;
    } catch (error) {
      console.error('❌ Get user profile error:', error);
      throw error;
    }
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    try {
      console.log('🔄 Updating profile with:', updates);
      const { data } = await apiClient.put('/auth/profile', updates);
      console.log('✅ Profile updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      console.log('🔄 Logging out user');
      await apiClient.post('/auth/logout');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      console.log('🔄 Changing password');
      await apiClient.post('/auth/change-password', { oldPassword, newPassword });
      console.log('✅ Password changed successfully');
    } catch (error) {
      console.error('❌ Change password error:', error);
      throw error;
    }
  },
};
