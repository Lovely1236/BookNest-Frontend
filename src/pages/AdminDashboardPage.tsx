import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { analyticsService } from '../services/api/analyticsService';
import { SalesChart } from '../components/dashboard/SalesChart';
import { TopBooksChart } from '../components/dashboard/TopBooksChart';
import { StockAlert } from '../components/dashboard/StockAlert';
import { formatCurrency } from '../utils/formatters';
import { adminService } from '../services/api/adminService';

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
  const { data: catalog } = useQuery({
    queryKey: ['admin', 'dashboard', 'recent-books'],
    queryFn: () => adminService.getCatalog({ limit: 5 }),
  });

  const quickActions = [
    { title: 'Manage catalog', copy: 'Add, edit, and remove bookstore listings.', to: '/admin/catalog' },
    { title: 'Review orders', copy: 'Track status changes and dispatch flow.', to: '/admin/orders' },
    { title: 'View users', copy: 'Inspect the current customer and admin base.', to: '/admin/users' },
    { title: 'Open analytics', copy: 'Dive deeper into sales and stock signals.', to: '/admin/analytics' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      <section className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-blue-200/80">Admin Control Room</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold">Keep the BookNest catalog, orders, and insights in sync.</h1>
            <p className="mt-3 text-sm text-slate-300">
              The admin dashboard is now wired through `admin-service`, so analytics and catalog actions share the same backend entry point.
            </p>
          </div>
          <Link
            to="/admin/catalog"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Open Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-900">{action.title}</p>
            <p className="mt-2 text-sm text-slate-500">{action.copy}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600">
              Open
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <TopBooksChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-w-lg">
          <StockAlert />
        </div>
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recently managed books</h2>
              <p className="text-sm text-slate-500">Quick view into the catalog flowing through admin-service.</p>
            </div>
            <Link to="/admin/catalog" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {(catalog?.books ?? []).map((book) => (
              <div key={book.bookId} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{book.title}</p>
                  <p className="text-sm text-slate-500">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(book.price)}</p>
                  <p className="text-xs text-slate-500">{book.stock} in stock</p>
                </div>
              </div>
            ))}
            {(catalog?.books?.length ?? 0) === 0 && (
              <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                No recent catalog entries yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
