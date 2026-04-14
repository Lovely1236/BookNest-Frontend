export interface Book {
  bookId: number;
  itemId?: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  coverImageUrl: string;
  publishedDate: string;
}

export interface BookFilters {
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  search?: string;
  page?: number;
  limit?: number;
}

export interface BooksPage {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
  nextPage?: number;
}
