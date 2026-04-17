import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { bookService } from './bookService';
import { Book } from '../../types/book';

interface WishlistBook {
  itemId?: number;
  bookId?: number;
  bookTitle?: string | null;
  bookPrice?: number | null;
  title?: string | null;
  author?: string | null;
  isbn?: string | null;
  genre?: string | null;
  price?: number | null;
  stock?: number | null;
  rating?: number | null;
  description?: string | null;
  coverImageUrl?: string | null;
  cover?: string | null;
  publishedDate?: string | null;
}

type WishlistApiResponse = Book[] | { wishlistId?: number; userId?: number; createdAt?: string; books?: WishlistBook[] };

export const wishlistService = {
  getWishlist: async (): Promise<Book[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get<WishlistApiResponse>(`/wishlist/wishlist/${user.userId}`);

    // Normalize response: backend may return either an array of Book or an object with `books` array
    const rawBooks: WishlistBook[] = Array.isArray(data)
      ? (data as WishlistBook[])
      : Array.isArray((data as { books?: WishlistBook[] })?.books)
      ? (data as { books?: WishlistBook[] }).books ?? []
      : [];

    // For each wishlist item, fetch the full book details to get stock, cover, rating, etc.
    const enrichedBooks = await Promise.all(
      rawBooks.map(async (item) => {
        try {
          // Fetch full book details from book service
          const fullBook = await bookService.getById(item.bookId ?? 0);
          return {
            ...fullBook,
            itemId: item.itemId, // Preserve the wishlist itemId
          } as Book;
        } catch {
          // Fallback to wishlist data if book service fails
          return {
            itemId: item.itemId,
            bookId: item.bookId ?? 0,
            title: item.title ?? item.bookTitle ?? 'Untitled',
            author: item.author ?? '',
            isbn: item.isbn ?? '',
            genre: item.genre ?? '',
            price: typeof item.price === 'number' ? item.price : Number(item.bookPrice ?? 0),
            stock: typeof item.stock === 'number' ? item.stock : 0,
            rating: typeof item.rating === 'number' ? item.rating : 0,
            description: item.description ?? '',
            coverImageUrl: item.coverImageUrl ?? item.cover ?? '',
            publishedDate: item.publishedDate ?? '',
          } as Book;
        }
      })
    );

    return enrichedBooks;
  },

  addToWishlist: async (book: number | Partial<WishlistBook> | Book): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    // Build minimal payload with only the required fields for WishlistItem
    const payload: { bookId?: number; bookTitle?: string | null; bookPrice?: number | null } = {};
    
    if (typeof book === 'number') {
      payload.bookId = book;
    } else {
      const obj = book as Partial<WishlistBook> & Partial<Book>;
      payload.bookId = obj.bookId;
      payload.bookTitle = obj.bookTitle ?? obj.title ?? null;
      payload.bookPrice = obj.bookPrice ?? obj.price ?? null;
    }

    await apiClient.post(`/wishlist/wishlist/add/${user.userId}`, payload);
  },

  removeFromWishlist: async (itemId: number): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    await apiClient.delete(`/wishlist/wishlist/remove/${user.userId}/${itemId}`);
  },

  isInWishlist: async (bookId: number): Promise<boolean> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    try {
      const { data } = await apiClient.get(`/wishlist/wishlist/check/${user.userId}/${bookId}`);
      return data.inWishlist || data.exists || false;
    } catch {
      return false;
    }
  },
};
