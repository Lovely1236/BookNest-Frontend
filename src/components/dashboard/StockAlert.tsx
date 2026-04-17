import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/api/analyticsService';
import { Link } from 'react-router-dom';

export const StockAlert: React.FC = () => {
  const { data: lowStockBooks, isLoading } = useQuery({
    queryKey: ['analytics', 'low-stock'],
    queryFn: () => analyticsService.getLowStockBooks(10),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Low Stock Alert
        </h3>
        {lowStockBooks && lowStockBooks.length > 0 && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
            {lowStockBooks.length} books
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : lowStockBooks?.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">All books are well-stocked!</p>
      ) : (
        <div className="space-y-2">
          {lowStockBooks?.map((book) => (
            <div
              key={book.bookId}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <p className="text-sm text-gray-700 truncate flex-1">{book.title}</p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ml-2 shrink-0 ${
                  book.stock === 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {book.stock === 0 ? 'Out of Stock' : `${book.stock} left`}
              </span>
            </div>
          ))}
        </div>
      )}

      <Link
        to="/admin/catalog"
        className="block text-center text-sm text-blue-600 hover:text-blue-700 mt-4"
      >
        Manage Catalog
      </Link>
    </div>
  );
};

export default StockAlert;
