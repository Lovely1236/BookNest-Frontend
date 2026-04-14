import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Wallet, Statement } from '../../types/wallet';

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/wallet/${user.userId}`);
    return data;
  },

  getBalance: async (): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/wallet/${user.userId}`);
    return data;
  },

  topUp: async (amount: number): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post(`/wallet/addMoney/${user.userId}`, {}, { params: { amount } });
    return data;
  },

  debit: async (orderId: number, amount: number): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post(`/wallet/${user.userId}/debit`, { orderId, amount });
    return data;
  },

  getStatements: async (filters?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ statements: Statement[]; total: number }> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/wallet/statements/${user.userId}`, { params: filters });
    return data;
  },
};
