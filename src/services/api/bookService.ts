import apiClient from '../axios';
import { Book, BookFilters, BooksPage } from '../../types/book';

const normalizeGenre = (value: string) =>
  value.trim().toLowerCase().replace(/[\s_-]+/g, '');

const applyClientFilters = (books: Book[], filters?: BookFilters): Book[] => {
  if (!filters) return books;

  let filtered = [...books];

  if (filters.genre) {
    const wanted = normalizeGenre(filters.genre);
    filtered = filtered.filter((book) => normalizeGenre(book.genre || '') === wanted);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((book) => book.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((book) => book.price <= filters.maxPrice!);
  }

  if (filters.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    filtered = filtered.filter((book) =>
      [book.title, book.author, book.isbn].some((field) =>
        String(field || '').toLowerCase().includes(term)
      )
    );
  }

  if (filters.sort) {
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
        default: {
          const aDate = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const bDate = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return bDate - aDate;
        }
      }
    });
  }

  return filtered;
};

export const bookService = {
  getAll: async (filters?: BookFilters): Promise<BooksPage> => {
    const { data } = await apiClient.get('/book/books', { params: filters });
    // API may return either a paginated object { books: [], total, ... }
    // or a plain array of books. Normalize both shapes to BooksPage.
    if (Array.isArray(data)) {
      const allBooks = data as Book[];
      const filteredBooks = applyClientFilters(allBooks, filters);
      const page = filters?.page || 1;
      const limit = filters?.limit || filteredBooks.length || 1;
      const start = (page - 1) * limit;
      const pagedBooks = filteredBooks.slice(start, start + limit);
      return {
        books: pagedBooks,
        total: filteredBooks.length,
        page,
        totalPages: Math.max(1, Math.ceil(filteredBooks.length / limit)),
        nextPage: start + limit < filteredBooks.length ? page + 1 : undefined,
      };
    }

    return data as BooksPage;
  },

  getById: async (bookId: number): Promise<Book> => {
    const { data } = await apiClient.get(`/book/books/${bookId}`);
    return data;
  },

  search: async (query: string): Promise<Book[]> => {
    const { data } = await apiClient.get('/book/books/search', { params: { q: query } });
    return data;
  },

  getFeatured: async (): Promise<Book[]> => {
    const { data } = await apiClient.get('/book/books/featured');
    return data;
  },

  getByGenre: async (genre: string): Promise<Book[]> => {
    const { data } = await apiClient.get('/book/books', { params: { genre } });
    return data.books || data;
  },

  create: async (book: Omit<Book, 'bookId'>): Promise<Book> => {
    const { data } = await apiClient.post('/book/books', book);
    return data;
  },

  update: async (bookId: number, updates: Partial<Book>): Promise<Book> => {
    const { data } = await apiClient.put(`/book/books/${bookId}`, updates);
    return data;
  },

  delete: async (bookId: number): Promise<void> => {
    await apiClient.delete(`/book/books/${bookId}`);
  },

  updateStock: async (bookId: number, stock: number): Promise<Book> => {
    const { data } = await apiClient.patch(`/book/books/${bookId}/stock`, { stock });
    return data;
  },
};
