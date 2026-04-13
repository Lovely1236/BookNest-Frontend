import React from 'react';
import { BarChart2 } from 'lucide-react';
import { SalesChart } from '../components/dashboard/SalesChart';
import { TopBooksChart } from '../components/dashboard/TopBooksChart';
import { StockAlert } from '../components/dashboard/StockAlert';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <BarChart2 className="w-6 h-6" />
        Analytics
      </h1>

      <div className="space-y-6">
        <SalesChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopBooksChart />
          <StockAlert />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
