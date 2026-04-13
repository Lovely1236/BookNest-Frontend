import apiClient from '../axios';

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

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalBooks: number;
  revenueGrowth: number;
  orderGrowth: number;
}

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/admin/analytics/stats');
    return data;
  },

  getSales: async (period: 'week' | 'month' | 'year'): Promise<SalesData[]> => {
    const { data } = await apiClient.get('/admin/analytics/sales', { params: { period } });
    return data;
  },

  getTopBooks: async (limit = 10): Promise<TopBook[]> => {
    const { data } = await apiClient.get('/admin/analytics/top-books', { params: { limit } });
    return data;
  },

  getLowStockBooks: async (threshold = 10): Promise<Array<{ bookId: number; title: string; stock: number }>> => {
    const { data } = await apiClient.get('/admin/analytics/low-stock', { params: { threshold } });
    return data;
  },
};
