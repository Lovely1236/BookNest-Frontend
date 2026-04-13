import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/api/analyticsService';

export const TopBooksChart: React.FC = () => {
  const { data: topBooks, isLoading } = useQuery({
    queryKey: ['analytics', 'top-books'],
    queryFn: () => analyticsService.getTopBooks(8),
  });

  const chartData = topBooks?.map((b) => ({
    name: b.title.length > 15 ? b.title.substring(0, 15) + '...' : b.title,
    sold: b.soldCount,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Top Selling Books</h3>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData || []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
            <Tooltip />
            <Bar dataKey="sold" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopBooksChart;
