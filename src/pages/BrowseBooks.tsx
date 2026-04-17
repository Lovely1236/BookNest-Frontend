import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { BookGrid } from '../components/book/BookGrid';
import { BookFilter } from '../components/book/BookFilter';
import { BookFilters } from '../types/book';

export const BrowseBooks: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<BookFilters>({
    genre: searchParams.get('genre') || undefined,
    sort: (searchParams.get('sort') as BookFilters['sort']) || undefined,
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useBooks(filters);

  const handleFilterChange = (newFilters: BookFilters) => {
    setFilters(newFilters);
    const params: Record<string, string> = {};
    if (newFilters.genre) params.genre = newFilters.genre;
    if (newFilters.sort) params.sort = newFilters.sort;
    setSearchParams(params);
  };

  const totalPages = data?.totalPages || 1;
  const currentPage = filters.page || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse Books</h1>
        {data?.total !== undefined && (
          <p className="text-sm text-gray-500">{data.total} books found</p>
        )}
      </div>

      <div className="mb-6">
        <BookFilter filters={filters} onChange={handleFilterChange} />
      </div>

      <BookGrid
        books={data?.books}
        isLoading={isLoading}
        emptyMessage="No books found. Try adjusting your filters."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, currentPage - 1) }))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, currentPage + 1) }))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseBooks;
