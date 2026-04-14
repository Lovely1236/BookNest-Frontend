import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { walletService } from '../services/api/walletService';
import { notificationService } from '../services/api/notificationService';
import { useAuthStore } from '../stores/authStore';

export const useWallet = () => {
  const { isAuthenticated, user } = useAuthStore();
  return useQuery({
    queryKey: ['wallet', user?.userId], // Include userId in cache key
    queryFn: walletService.getWallet,
    enabled: isAuthenticated && !!user?.userId,
  });
};

export const useWalletStatements = (filters?: Parameters<typeof walletService.getStatements>[0]) => {
  const { isAuthenticated, user } = useAuthStore();
  return useQuery({
    queryKey: ['wallet', user?.userId, 'statements', filters], // Include userId in cache key
    queryFn: () => walletService.getStatements(filters),
    enabled: isAuthenticated && !!user?.userId,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    staleTime: 5000, // Data is fresh for 5 seconds
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: () => walletService.create(),
    onSuccess: (wallet) => {
      queryClient.setQueryData(['wallet', user?.userId], wallet);
      toast.success('Wallet created successfully!');
    },
    onError: (error) => {
      console.error('Create wallet error:', error);
      toast.error('Failed to create wallet');
    },
  });
};

export const useTopUpWallet = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: async (amount: number) => {
      // Check if wallet exists, if not create it first
      try {
        return await walletService.topUp(amount);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          // Wallet doesn't exist, create it first
          console.log('Wallet not found, creating wallet first...');
          await walletService.create();
          // Now retry topUp
          return await walletService.topUp(amount);
        }
        throw error;
      }
    },
    onSuccess: (wallet, amount) => {
      queryClient.invalidateQueries({ queryKey: ['wallet', user?.userId] });
      queryClient.invalidateQueries({ queryKey: ['wallet', user?.userId, 'statements'] }); // Invalidate statements cache
      toast.success('Wallet topped up successfully!');
      
      // Send notification
      try {
        notificationService.send(`₹${amount} added to your wallet. New balance: ₹${wallet?.currentBalance || 0}`, 'WALLET');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    },
    onError: (error) => {
      console.error('Top up wallet error:', error);
      toast.error('Failed to top up wallet');
    },
  });
};
