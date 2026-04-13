import apiClient from '../axios';
import { Book } from '../../types/book';

export const wishlistService = {
  getWishlist: async (): Promise<Book[]> => {
    const { data } = await apiClient.get('/wishlist');
    return data;
  },

  addToWishlist: async (bookId: number): Promise<void> => {
    await apiClient.post('/wishlist', { bookId });
  },

  removeFromWishlist: async (bookId: number): Promise<void> => {
    await apiClient.delete(`/wishlist/${bookId}`);
  },

  isInWishlist: async (bookId: number): Promise<boolean> => {
    const { data } = await apiClient.get(`/wishlist/check/${bookId}`);
    return data.inWishlist;
  },
};
