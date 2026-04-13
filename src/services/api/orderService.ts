import apiClient from '../axios';
import { Order, PlaceOrderPayload } from '../../types/order';

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get('/orders/my-orders');
    return data;
  },

  getById: async (orderId: number): Promise<Order> => {
    const { data } = await apiClient.get(`/orders/${orderId}`);
    return data;
  },

  placeOrder: async (payload: PlaceOrderPayload): Promise<Order> => {
    const { data } = await apiClient.post('/orders/place', payload);
    return data;
  },

  payOnline: async (payload: { orderId: number; walletId: number }): Promise<Order> => {
    const { data } = await apiClient.post('/orders/online-payment', payload);
    return data;
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const { data } = await apiClient.put(`/orders/${orderId}/cancel`);
    return data;
  },

  getAll: async (filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> => {
    const { data } = await apiClient.get('/orders', { params: filters });
    return data;
  },

  updateStatus: async (orderId: number, status: string): Promise<Order> => {
    const { data } = await apiClient.put(`/orders/${orderId}/status`, { status });
    return data;
  },
};
