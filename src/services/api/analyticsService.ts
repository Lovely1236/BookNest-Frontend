import { adminService, DashboardStats, SalesData, TopBook } from './adminService';

export type { DashboardStats, SalesData, TopBook };

export const analyticsService = {
  getDashboardStats: (): Promise<DashboardStats> => adminService.getDashboardStats(),
  getSales: (period: 'week' | 'month' | 'year'): Promise<SalesData[]> => adminService.getSales(period),
  getTopBooks: (limit = 10): Promise<TopBook[]> => adminService.getTopBooks(limit),
  getLowStockBooks: (threshold = 10): Promise<Array<{ bookId: number; title: string; stock: number }>> =>
    adminService.getLowStockBooks(threshold),
};
