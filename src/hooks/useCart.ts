import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartService } from '../services/api/cartService';
import { useCartStore } from '../stores/cartStore';
import { Cart } from '../types/cart';
import { useAuthStore } from '../stores/authStore';

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const { items, clearCart: clearLocalCart, getTotalPrice, getItemCount } = useCartStore();

  const queryClient = useQueryClient();

  const { data: serverCart, isLoading } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await cartService.getCart();
      useCartStore.getState().setItems(cart.items);
      return cart;
    },
    enabled: isAuthenticated,
  });

  const addToCartMutation = useMutation({
    mutationFn: (payload: { bookId: number; quantity: number }) =>
      cartService.addItem(payload),
    onSuccess: (data) => {
      useCartStore.getState().setItems(data.items);
      queryClient.setQueryData(['cart'], data);
      toast.success('Added to cart!');
    },
    onError: () => {
      toast.error('Failed to add to cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => cartService.removeItem(itemId),
    onSuccess: (data) => {
      useCartStore.getState().setItems(data.items);
      queryClient.setQueryData(['cart'], data);
    },
    onError: () => toast.error('Failed to remove item'),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: (data) => {
      useCartStore.getState().setItems(data.items);
      queryClient.setQueryData(['cart'], data);
    },
    onError: () => toast.error('Failed to update quantity'),
  });

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      clearLocalCart();
      queryClient.setQueryData(['cart'], null);
    },
  });

  return {
    items,
    serverCart,
    isLoading,
    cartId: serverCart?.cartId,
    totalPrice: getTotalPrice(),
    itemCount: getItemCount(),
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
  };
};
