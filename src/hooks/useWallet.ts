import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { walletService } from '../services/api/walletService';
import { useAuthStore } from '../stores/authStore';

export const useWallet = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['wallet'],
    queryFn: walletService.getWallet,
    enabled: isAuthenticated,
  });
};

export const useWalletStatements = (filters?: Parameters<typeof walletService.getStatements>[0]) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['wallet', 'statements', filters],
    queryFn: () => walletService.getStatements(filters),
    enabled: isAuthenticated,
  });
};

export const useTopUpWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => walletService.topUp(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Wallet topped up successfully!');
    },
    onError: () => toast.error('Failed to top up wallet'),
  });
};
