import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { wishlistService } from '../services/api/wishlistService';
import { notificationService } from '../services/api/notificationService';
import { Book } from '../types/book';
import { useAuthStore } from '../stores/authStore';

export const useWishlist = () => {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery<Book[]>({
    queryKey: ['wishlist'],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
  });

  const addToWishlistMutation = useMutation<void, unknown, number | Book>({
    mutationFn: (payload: number | Book) => wishlistService.addToWishlist(payload),
    onSuccess: async (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      const bookTitle = typeof payload === 'number' ? 'Book' : payload.title;
      toast.success('Added to wishlist!');
      
      // Send notification
      try {
        await notificationService.send(`${bookTitle} added to your wishlist`, 'WISHLIST');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    },
    onError: () => toast.error('Failed to add to wishlist'),
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (id: number) => {
      // `id` may be a bookId (from catalog) or an itemId (from wishlist). Prefer resolving to itemId using cached wishlist.
      const itemId = wishlist?.find((b) => b.bookId === id)?.itemId ?? id;
      return wishlistService.removeFromWishlist(itemId as number);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
      
      // Send notification
      try {
        notificationService.send('Item removed from your wishlist', 'WISHLIST');
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
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
