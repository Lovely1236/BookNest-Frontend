import apiClient from '../axios';
import { User } from '../../types/auth';
import { Book } from '../../types/book';
import { Order } from '../../types/order';
import { normalizeUser } from '../../utils/auth';

export interface AdminBookFilters {
  search?: string;
  genre?: string;
  stockStatus?: 'all' | 'healthy' | 'low' | 'out';
  limit?: number;
}

export interface AdminCatalogResponse {
  books: Book[];
  total: number;
  totalCount: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalBooks: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopBook {
  bookId: number;
  title: string;
  author: string;
  soldCount: number;
  revenue: number;
}

type AdminResponse = Record<string, unknown>;
type BookPayload = Omit<Book, 'bookId' | 'itemId'>;

const assertAdminSuccess = <T extends AdminResponse>(data: T): T => {
  const status = typeof data.status === 'string' ? data.status.toLowerCase() : '';
  if (status === 'error' || data.error || data.authRequired) {
    throw new Error(String(data.message ?? 'Admin request failed'));
  }
  return data;
};

const normalizeBook = (book: Record<string, unknown>): Book => ({
  bookId: Number(book.bookId ?? book.id ?? 0),
  title: String(book.title ?? ''),
  author: String(book.author ?? ''),
  isbn: String(book.isbn ?? ''),
  genre: String(book.genre ?? ''),
  publisher: typeof book.publisher === 'string' ? book.publisher : '',
  price: Number(book.price ?? 0),
  stock: Number(book.stock ?? 0),
  rating: Number(book.rating ?? 0),
  description: String(book.description ?? ''),
  coverImageUrl: String(book.coverImageUrl ?? ''),
  publishedDate: String(book.publishedDate ?? ''),
});

const normalizeOrder = (order: Record<string, unknown>): Order => ({
  orderId: Number(order.orderId ?? 0),
  userId: Number(order.userId ?? 0),
  orderDate: String(order.orderDate ?? ''),
  amountPaid: Number(order.amountPaid ?? order.total ?? 0),
  modeOfPayment: String(order.modeOfPayment ?? 'COD') as Order['modeOfPayment'],
  orderStatus: String(order.orderStatus ?? 'PLACED') as Order['orderStatus'],
  quantity: Number(order.quantity ?? 1),
  confirmedDate: order.confirmedDate ? String(order.confirmedDate) : undefined,
  dispatchedDate: order.dispatchedDate ? String(order.dispatchedDate) : undefined,
  deliveredDate: order.deliveredDate ? String(order.deliveredDate) : undefined,
  deliveryAddress: (order.address ?? order.deliveryAddress ?? undefined) as Order['deliveryAddress'],
  items: Array.isArray(order.items) ? (order.items as Order['items']) : undefined,
});

export const adminService = {
  getCatalog: async (filters: AdminBookFilters = {}): Promise<AdminCatalogResponse> => {
    const { data } = await apiClient.get('/admin/books', { params: filters });
    const payload = assertAdminSuccess(data as AdminResponse);
    const books = Array.isArray(payload.books)
      ? payload.books.map((book) => normalizeBook(book as Record<string, unknown>))
      : [];

    return {
      books,
      total: Number(payload.total ?? books.length),
      totalCount: Number(payload.totalCount ?? books.length),
      lowStockCount: Number(payload.lowStockCount ?? 0),
      outOfStockCount: Number(payload.outOfStockCount ?? 0),
    };
  },

  createBook: async (book: BookPayload): Promise<Book> => {
    const { data } = await apiClient.post('/admin/books', book);
    const payload = assertAdminSuccess(data as AdminResponse);
    return normalizeBook(payload);
  },

  updateBook: async (bookId: number, book: Partial<BookPayload>): Promise<Book> => {
    const { data } = await apiClient.put(`/admin/books/${bookId}`, book);
    const payload = assertAdminSuccess(data as AdminResponse);
    return normalizeBook(payload);
  },

  deleteBook: async (bookId: number): Promise<void> => {
    const { data } = await apiClient.delete(`/admin/books/${bookId}`);
    assertAdminSuccess(data as AdminResponse);
  },

  updateBookStock: async (bookId: number, stock: number): Promise<Book> => {
    const { data } = await apiClient.patch(`/admin/books/${bookId}/stock`, { stock });
    const payload = assertAdminSuccess(data as AdminResponse);
    return normalizeBook(payload);
  },

  getUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/admin/users');
    const payload = assertAdminSuccess(data as AdminResponse);
    return Array.isArray(payload.users)
      ? payload.users.map((user) => normalizeUser(user as Record<string, unknown>))
      : [];
  },

  getOrders: async (filters?: { status?: string }): Promise<{ orders: Order[]; total: number }> => {
    const { data } = await apiClient.get('/admin/orders', { params: filters });
    const payload = assertAdminSuccess(data as AdminResponse);
    const orders = Array.isArray(payload.orders)
      ? payload.orders.map((order) => normalizeOrder(order as Record<string, unknown>))
      : [];

    return {
      orders,
      total: Number(payload.total ?? orders.length),
    };
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<void> => {
    const { data } = await apiClient.post('/admin/orders/status', null, {
      params: { orderId, status },
    });
    assertAdminSuccess(data as AdminResponse);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/admin/analytics/stats');
    return assertAdminSuccess(data as AdminResponse) as unknown as DashboardStats;
  },

  getSales: async (period: 'week' | 'month' | 'year'): Promise<SalesData[]> => {
    const { data } = await apiClient.get('/admin/analytics/sales', { params: { period } });
    const payload = assertAdminSuccess(data as AdminResponse);
    return Array.isArray(payload.data) ? (payload.data as SalesData[]) : [];
  },

  getTopBooks: async (limit = 10): Promise<TopBook[]> => {
    const { data } = await apiClient.get('/admin/analytics/top-books', { params: { limit } });
    const payload = assertAdminSuccess(data as AdminResponse);
    return Array.isArray(payload.topBooks)
      ? payload.topBooks.map((book) => ({
          bookId: Number((book as Record<string, unknown>).bookId ?? 0),
          title: String((book as Record<string, unknown>).title ?? 'Untitled'),
          author: String((book as Record<string, unknown>).author ?? 'Unknown Author'),
          soldCount: Number((book as Record<string, unknown>).soldCount ?? 0),
          revenue: Number((book as Record<string, unknown>).revenue ?? 0),
        }))
      : [];
  },

  getLowStockBooks: async (threshold = 10): Promise<Array<{ bookId: number; title: string; stock: number }>> => {
    const { data } = await apiClient.get('/admin/analytics/low-stock', { params: { threshold } });
    const payload = assertAdminSuccess(data as AdminResponse);
    return Array.isArray(payload.lowStock)
      ? payload.lowStock.map((book) => ({
          bookId: Number((book as Record<string, unknown>).bookId ?? 0),
          title: String((book as Record<string, unknown>).title ?? 'Untitled'),
          stock: Number((book as Record<string, unknown>).stock ?? 0),
        }))
      : [];
  },
};
