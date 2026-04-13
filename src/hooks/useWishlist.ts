import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wishlistService } from '../services/api/wishlistService';
import { useAuthStore } from '../stores/authStore';

export const useWishlist = () => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (bookId: number) => wishlistService.addToWishlist(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist!');
    },
    onError: () => toast.error('Failed to add to wishlist'),
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (bookId: number) => wishlistService.removeFromWishlist(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: () => toast.error('Failed to remove from wishlist'),
  });

  const isInWishlist = (bookId: number): boolean => {
    return wishlist?.some((book) => book.bookId === bookId) ?? false;
  };

  return {
    wishlist,
    isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isInWishlist,
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
  };
};
