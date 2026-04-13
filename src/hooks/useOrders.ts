import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderService } from '../services/api/orderService';
import { PlaceOrderPayload } from '../types/order';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders', 'my-orders'],
    queryFn: orderService.getMyOrders,
  });
};

export const useOrder = (orderId: number) => {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
    refetchInterval: 30000,
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) => orderService.placeOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => toast.error('Failed to place order'),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully');
    },
    onError: () => toast.error('Failed to cancel order'),
  });
};

export const useAllOrders = (filters?: Parameters<typeof orderService.getAll>[0]) => {
  return useQuery({
    queryKey: ['orders', 'all', filters],
    queryFn: () => orderService.getAll(filters),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      orderService.updateStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update order status'),
  });
};
