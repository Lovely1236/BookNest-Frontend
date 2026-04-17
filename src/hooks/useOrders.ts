import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderService } from '../services/api/orderService';
import { notificationService } from '../services/api/notificationService';
import { walletService } from '../services/api/walletService';
import { bookService } from '../services/api/bookService';
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
    mutationFn: async (payload: PlaceOrderPayload) => {
      const order = await orderService.placeOrder(payload);
      
      // Deduct stock for each book in the order (non-blocking)
      try {
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            try {
              const book = await bookService.getById(item.bookId);
              const newStock = Math.max(0, book.stock - item.quantity);
              await bookService.updateStock(item.bookId, newStock);
            } catch (error) {
              console.error(`Failed to update stock for book ${item.bookId}`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error updating book stocks:', error);
        // Don't throw - stock update failure shouldn't block order success
      }
      
      return order;
    },
    onSuccess:async (order, payload) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      
      // Deduct from wallet if payment mode is ONLINE
      if (payload.modeOfPayment === 'ONLINE' && payload.amount) {
        try {
          await walletService.debit(order.orderId, payload.amount);
          queryClient.invalidateQueries({ queryKey: ['wallet'] });
          queryClient.invalidateQueries({ queryKey: ['wallet', 'statements'] });
        } catch (error) {
          console.error('Failed to debit wallet:', error);
        }
      }
      
      // Send notification for order placement
      try {
        const message = `Your order #${order.orderId} has been placed successfully. Total: ₹${order.amountPaid}`;
        notificationService.send(message, 'ORDER');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error('Failed to send order notification:', error);
      }
    },
    onError: (error) => {
      console.error('Order placement error:', error);
      toast.error('Failed to place order');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const order = await orderService.cancelOrder(orderId);
      
      // Add stock back for each book in the cancelled order
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          try {
            const book = await bookService.getById(item.bookId);
            const newStock = book.stock + item.quantity;
            await bookService.updateStock(item.bookId, newStock);
          } catch (error) {
            console.error(`Failed to restore stock for book ${item.bookId}`, error);
          }
        }
      }
      
      return order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Order cancelled successfully');
      
      // Send notification for order cancellation
      try {
        const message = `Your order #${order.orderId} has been cancelled. Refund of ₹${order.amountPaid} will be processed.`;
        notificationService.send(message, 'ORDER');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error('Failed to send cancellation notification:', error);
      }
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
