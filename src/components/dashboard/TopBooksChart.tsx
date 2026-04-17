import React, { useState } from 'react';
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
import { formatCurrency } from '../../utils/formatters';

export const TopBooksChart: React.FC = () => {
  const [viewType, setViewType] = useState<'sold' | 'revenue'>('revenue');
  
  const { data: topBooks, isLoading } = useQuery({
    queryKey: ['analytics', 'top-books'],
    queryFn: () => analyticsService.getTopBooks(8),
  });

  const chartData = topBooks?.map((b) => ({
    name: b.title.length > 12 ? b.title.substring(0, 12) + '...' : b.title,
    sold: b.soldCount,
    revenue: Math.round(b.revenue / 100) / 100, // Normalize revenue
    fullTitle: b.title,
    author: b.author,
  }));

  const renderTooltip = (props: any) => {
    if (props.active && props.payload?.[0]) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-sm text-gray-900">{data.fullTitle}</p>
          <p className="text-xs text-gray-600 mb-2">by {data.author}</p>
          <p className="text-sm text-blue-600">Units Sold: {data.sold}</p>
          <p className="text-sm text-green-600">Revenue: {formatCurrency(data.revenue)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Top Selling Books</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('revenue')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              viewType === 'revenue'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Revenue
          </button>
          <button
            onClick={() => setViewType('sold')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              viewType === 'sold'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Units Sold
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData || []} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
            <Tooltip content={renderTooltip} />
            {viewType === 'revenue' ? (
              <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} name="Revenue" />
            ) : (
              <Bar dataKey="sold" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Units Sold" />
            )}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopBooksChart;
