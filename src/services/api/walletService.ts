import apiClient from '../axios';
import { Wallet, Statement } from '../../types/wallet';

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    const { data } = await apiClient.get('/wallet');
    return data;
  },

  getBalance: async (): Promise<Wallet> => {
    const { data } = await apiClient.get('/wallet/balance');
    return data;
  },

  topUp: async (amount: number): Promise<Wallet> => {
    const { data } = await apiClient.post('/wallet/topup', { amount });
    return data;
  },

  debit: async (orderId: number, amount: number): Promise<Wallet> => {
    const { data } = await apiClient.post('/wallet/debit', { orderId, amount });
    return data;
  },

  getStatements: async (filters?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ statements: Statement[]; total: number }> => {
    const { data } = await apiClient.get('/wallet/statements', { params: filters });
    return data;
  },
};
