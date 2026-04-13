import apiClient from '../axios';
import { Book, BookFilters, BooksPage } from '../../types/book';

export const bookService = {
  getAll: async (filters?: BookFilters): Promise<BooksPage> => {
    const { data } = await apiClient.get('/books', { params: filters });
    return data;
  },

  getById: async (bookId: number): Promise<Book> => {
    const { data } = await apiClient.get(`/books/${bookId}`);
    return data;
  },

  search: async (query: string): Promise<Book[]> => {
    const { data } = await apiClient.get('/books/search', { params: { q: query } });
    return data;
  },

  getFeatured: async (): Promise<Book[]> => {
    const { data } = await apiClient.get('/books/featured');
    return data;
  },

  getByGenre: async (genre: string): Promise<Book[]> => {
    const { data } = await apiClient.get('/books', { params: { genre } });
    return data.books || data;
  },

  create: async (book: Omit<Book, 'bookId'>): Promise<Book> => {
    const { data } = await apiClient.post('/books', book);
    return data;
  },

  update: async (bookId: number, updates: Partial<Book>): Promise<Book> => {
    const { data } = await apiClient.put(`/books/${bookId}`, updates);
    return data;
  },

  delete: async (bookId: number): Promise<void> => {
    await apiClient.delete(`/books/${bookId}`);
  },

  updateStock: async (bookId: number, stock: number): Promise<Book> => {
    const { data } = await apiClient.patch(`/books/${bookId}/stock`, { stock });
    return data;
  },
};
