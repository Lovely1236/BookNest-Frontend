import apiClient from '../axios';
import { Book, BookFilters, BooksPage } from '../../types/book';

export const bookService = {
  getAll: async (filters?: BookFilters): Promise<BooksPage> => {
    const { data } = await apiClient.get('/book/books', { params: filters });
    // API may return either a paginated object { books: [], total, ... }
    // or a plain array of books. Normalize both shapes to BooksPage.
    if (Array.isArray(data)) {
      const books = data as Book[];
      return {
        books,
        total: books.length,
        page: filters?.page || 1,
        totalPages: 1,
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
