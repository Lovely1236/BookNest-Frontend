import apiClient from '../axios';
import { Cart } from '../../types/cart';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get('/cart');
    return data;
  },

  addItem: async (payload: { bookId: number; quantity: number }): Promise<Cart> => {
    const { data } = await apiClient.post('/cart/items', payload);
    return data;
  },

  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const { data } = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return data;
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const { data } = await apiClient.delete(`/cart/items/${itemId}`);
    return data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },

  sync: async (items: Array<{ bookId: number; quantity: number }>): Promise<Cart> => {
    const { data } = await apiClient.post('/cart/sync', { items });
    return data;
  },
};
