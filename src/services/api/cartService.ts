import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Cart } from '../../types/cart';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/cart/cart/${user.userId}`);
    return data;
  },

  addItem: async (payload: { bookId: number; quantity: number }): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const cartItem = { bookId: payload.bookId, quantity: payload.quantity };
    const { data } = await apiClient.post(`/cart/cart/${user.userId}/add`, cartItem);
    return data;
  },

  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.put(
      `/cart/cart/${user.userId}/update/${itemId}`,
      null,
      { params: { quantity } }
    );
    return data;
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.delete(`/cart/cart/${user.userId}/remove/${itemId}`);
    return data;
  },

  clearCart: async (): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    await apiClient.delete(`/cart/cart/${user.userId}`);
  },

  sync: async (items: Array<{ bookId: number; quantity: number }>): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post(`/cart/cart/${user.userId}/sync`, { items });
    return data;
  },
};
