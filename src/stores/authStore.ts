import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateProfile: (profile: Partial<User>) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
  isAdmin: getStoredUser()?.role === 'ADMIN',

  login: (user: User, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'ADMIN',
    });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAdmin: user.role === 'ADMIN' });
  },

  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
    set({ token, isAuthenticated: true });
  },

  updateProfile: (profile: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...profile };
      localStorage.setItem('user', JSON.stringify(updated));
      return { user: updated, isAdmin: updated.role === 'ADMIN' };
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
  },
}));
