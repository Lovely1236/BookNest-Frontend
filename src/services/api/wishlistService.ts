import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
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

    return rawBooks.map((item) => ({
      itemId: item.itemId,
      bookId: item.bookId ?? 0,
      title: item.title ?? item.bookTitle ?? 'Untitled',
      author: item.author ?? '',
      isbn: item.isbn ?? '',
      genre: item.genre ?? '',
      price: typeof item.price === 'number' ? item.price : Number(item.bookPrice ?? 0),
      stock: typeof item.stock === 'number' ? item.stock : Number(item.stock ?? 0),
      rating: typeof item.rating === 'number' ? item.rating : Number(item.rating ?? 0),
      description: item.description ?? '',
      coverImageUrl: item.coverImageUrl ?? item.cover ?? '',
      publishedDate: item.publishedDate ?? '',
    } as Book));
  },

  addToWishlist: async (book: number | Partial<WishlistBook> | Book): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');

    // Build payload with available fields. If caller passed only bookId (number), send minimal payload.
    const payload: {
      itemId?: number;
      bookId?: number;
      bookTitle?: string | null;
      bookPrice?: number | null;
      wishlist?: { wishlistId?: number; userId?: number; createdAt?: string; books?: Array<string | number> };
    } = {};
    if (typeof book === 'number') {
      payload.bookId = book;
    } else {
      const obj = book as Partial<WishlistBook> & Partial<Book>;
      payload.bookId = obj.bookId ?? undefined;
      payload.itemId = obj.itemId ?? 0;
      payload.bookTitle = obj.bookTitle ?? obj.title ?? undefined;
      payload.bookPrice = obj.bookPrice ?? obj.price ?? undefined;
    }

    // Include wishlist metadata with userId and createdAt where possible
    payload.wishlist = {
      wishlistId: undefined,
      userId: user.userId,
      createdAt: new Date().toISOString(),
      books: [],
    };

    // Populate wishlist.books with a representation of the added book (title or id)
    if (payload.bookTitle) payload.wishlist.books = [payload.bookTitle];
    else if (typeof payload.bookId === 'number') payload.wishlist.books = [payload.bookId];

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
