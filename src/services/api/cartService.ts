import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { bookService } from './bookService';
import { Cart, CartItem as CartItemType } from '../../types/cart';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/cart/cart/${user.userId}`);
    
    // Enrich cart items with full book details including cover images
    const enrichedItems = await Promise.all(
      data.items.map(async (item: CartItemType) => {
        try {
          const fullBook = await bookService.getById(item.bookId);
          return {
            ...item,
            bookCoverUrl: fullBook.coverImageUrl,
            author: fullBook.author,
            stock: fullBook.stock,
          };
        } catch {
          // Fallback if book service fails
          return item;
        }
      })
    );
    
    return {
      ...data,
      items: enrichedItems,
    };
  },

  addItem: async (payload: { bookId: number; quantity: number }): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const cartItem = { bookId: payload.bookId, quantity: payload.quantity };
    const { data } = await apiClient.post(`/cart/cart/${user.userId}/add`, cartItem);
    
    // Enrich with book details
    const enrichedItems = await Promise.all(
      data.items.map(async (item: CartItemType) => {
        try {
          const fullBook = await bookService.getById(item.bookId);
          return {
            ...item,
            bookCoverUrl: fullBook.coverImageUrl,
            author: fullBook.author,
            stock: fullBook.stock,
          };
        } catch {
          return item;
        }
      })
    );
    
    return {
      ...data,
      items: enrichedItems,
    };
  },

  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    
    // Validate stock before updating
   
      const cart = await cartService.getCart();
      const item = cart.items.find((i) => i.itemId === itemId);
      
      if (item && quantity > (item.stock || 0)) {
        throw new Error(`Only ${item.stock || 0} copies available in stock`);
      }
    
    const { data } = await apiClient.put(
      `/cart/cart/${user.userId}/update/${itemId}`,
      null,
      { params: { quantity } }
    );
    
    // Enrich with book details
    const enrichedItems = await Promise.all(
      data.items.map(async (item: CartItemType) => {
        try {
          const fullBook = await bookService.getById(item.bookId);
          return {
            ...item,
            bookCoverUrl: fullBook.coverImageUrl,
            author: fullBook.author,
            stock: fullBook.stock,
          };
        } catch {
          return item;
        }
      })
    );
    
    return {
      ...data,
      items: enrichedItems,
    };
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.delete(`/cart/cart/${user.userId}/remove/${itemId}`);
    
    // Enrich with book details
    const enrichedItems = await Promise.all(
      data.items.map(async (item: CartItemType) => {
        try {
          const fullBook = await bookService.getById(item.bookId);
          return {
            ...item,
            bookCoverUrl: fullBook.coverImageUrl,
            author: fullBook.author,
            stock: fullBook.stock,
          };
        } catch {
          return item;
        }
      })
    );
    
    return {
      ...data,
      items: enrichedItems,
    };
  },

  clearCart: async (): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    await apiClient.delete(`/cart/cart/${user.userId}/clear`);
  },

  sync: async (items: Array<{ bookId: number; quantity: number }>): Promise<Cart> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post(`/cart/cart/${user.userId}/sync`, { items });
    
    // Enrich with book details
    const enrichedItems = await Promise.all(
      data.items.map(async (item: CartItemType) => {
        try {
          const fullBook = await bookService.getById(item.bookId);
          return {
            ...item,
            bookCoverUrl: fullBook.coverImageUrl,
            author: fullBook.author,
            stock: fullBook.stock,
          };
        } catch {
          return item;
        }
      })
    );
    
    return {
      ...data,
      items: enrichedItems,
    };
  },
};
