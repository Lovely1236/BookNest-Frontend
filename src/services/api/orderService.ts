import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Order, PlaceOrderPayload } from '../../types/order';

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/order/orders/user/${user.userId}`);
    return data;
  },

  getById: async (orderId: number): Promise<Order> => {
    const { data } = await apiClient.get(`/order/orders/${orderId}`);
    return data;
  },

  placeOrder: async (payload: PlaceOrderPayload): Promise<Order> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post('/order/orders/place', { ...payload, userId: user.userId });
    return data;
  },

  payOnline: async (payload: { orderId: number; walletId: number }): Promise<Order> => {
    const { data } = await apiClient.post('/order/orders/online', payload);
    return data;
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const { data } = await apiClient.delete(`/order/orders/${orderId}`, {});
    return data;
  },

  getAll: async (filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> => {
    const { data } = await apiClient.get('/order/orders', { params: filters });
    return data;
  },

  updateStatus: async (orderId: number, status: string): Promise<Order> => {
    const { data } = await apiClient.put(`/order/orders/status/${orderId}`, { status });
    return data;
  },
};
