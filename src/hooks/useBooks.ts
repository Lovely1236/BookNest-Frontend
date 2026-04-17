import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { bookService } from '../services/api/bookService';
import { BookFilters, Book } from '../types/book';
import toast from 'react-hot-toast';

export const useBooks = (filters: BookFilters = {}) => {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => bookService.getAll(filters),
  });
};

export const useInfiniteBooks = (filters: Omit<BookFilters, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['books-infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      bookService.getAll({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

export const useBook = (bookId: number) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => bookService.getById(bookId),
    enabled: !!bookId,
  });
};

export const useFeaturedBooks = () => {
  return useQuery({
    queryKey: ['books', 'featured'],
    queryFn: bookService.getFeatured,
  });
};

export const useBookSearch = (query: string) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => bookService.search(query),
    enabled: query.length >= 2,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (book: Omit<Book, 'bookId'>) => bookService.create(book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book added successfully');
    },
    onError: () => toast.error('Failed to add book'),
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, updates }: { bookId: number; updates: Partial<Book> }) =>
      bookService.update(bookId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book updated successfully');
    },
    onError: () => toast.error('Failed to update book'),
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: number) => bookService.delete(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted successfully');
    },
    onError: () => toast.error('Failed to delete book'),
  });
};
