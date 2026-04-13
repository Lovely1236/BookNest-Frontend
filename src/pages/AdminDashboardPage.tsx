import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Users, BookOpen } from 'lucide-react';
import { analyticsService } from '../services/api/analyticsService';
import { SalesChart } from '../components/dashboard/SalesChart';
import { TopBooksChart } from '../components/dashboard/TopBooksChart';
import { StockAlert } from '../components/dashboard/StockAlert';
import { formatCurrency } from '../utils/formatters';

const StatCard: React.FC<{
  title: string;
  value: string;
  growth?: number;
  icon: React.FC<{ className?: string }>;
  color: string;
}> = ({ title, value, growth, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {growth !== undefined && (
      <p className={`text-xs mt-1 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% from last month
      </p>
    )}
  </div>
);

export const AdminDashboardPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: analyticsService.getDashboardStats,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.totalRevenue) : '—'}
          growth={stats?.revenueGrowth}
          icon={TrendingUp}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || '—'}
          growth={stats?.orderGrowth}
          icon={ShoppingBag}
          color="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '—'}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Books"
          value={stats?.totalBooks?.toLocaleString() || '—'}
          icon={BookOpen}
          color="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart />
        <TopBooksChart />
      </div>

      {/* Stock Alert */}
      <div className="max-w-lg">
        <StockAlert />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
