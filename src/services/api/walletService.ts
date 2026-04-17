import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Wallet, Statement } from '../../types/wallet';

export const walletService = {
  create: async (): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post(`/wallet/wallet/create`, { userId: user.userId });
    return data;
  },

  getWallet: async (): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/wallet/wallet/${user.userId}`);
    return data;
  },

  getBalance: async (): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/wallet/wallet/${user.userId}`);
    return data;
  },

  topUp: async (amount: number): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    try {
      console.log('Calling topUp API with amount:', amount, 'userId:', user.userId);
      const { data } = await apiClient.post(`/wallet/wallet/addMoney/${user.userId}`, {}, { params: { amount } });
      console.log('TopUp response:', data);
      return data;
    } catch (error) {
      console.error('Top up error:', error);
      throw error;
    }
  },

  debit: async (orderId: number, amount: number): Promise<Wallet> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    console.log('Calling debit with orderId:', orderId, 'amount:', amount, 'userId:', user.userId);
    const { data } = await apiClient.post(`/wallet/wallet/pay/${user.userId}?amount=${amount}`);
    console.log('Debit response:', data);
    return data;
  },

  getStatements: async (filters?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<Statement[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/wallet/wallet/statements/${user.userId}`, { params: filters });
    // Backend returns array directly
    return Array.isArray(data) ? data : data.statements || [];
  },
};
