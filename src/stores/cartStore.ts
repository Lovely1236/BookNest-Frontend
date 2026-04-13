import { create } from 'zustand';
import { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item: CartItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.bookId === item.bookId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.bookId === item.bookId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },

  removeItem: (itemId: number) => {
    set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) }));
  },

  updateQuantity: (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.itemId === itemId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  setItems: (items: CartItem[]) => set({ items }),

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
