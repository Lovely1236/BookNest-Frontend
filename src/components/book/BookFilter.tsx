import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { BookFilters } from '../../types/book';
import { GENRES, SORT_OPTIONS } from '../../utils/constants';

interface BookFilterProps {
  filters: BookFilters;
  onChange: (filters: BookFilters) => void;
}

export const BookFilter: React.FC<BookFilterProps> = ({ filters, onChange }) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const handleChange = (key: keyof BookFilters, value: unknown) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onChange({ page: 1 });
  };

  const hasActiveFilters = !!(filters.genre || filters.minPrice || filters.maxPrice || filters.sort);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {hasActiveFilters && <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">!</span>}
        </button>

        <select
          value={filters.sort || ''}
          onChange={(e) => handleChange('sort', e.target.value as BookFilters['sort'] || undefined)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl animate-slideDown">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={filters.genre || ''}
                onChange={(e) => handleChange('genre', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genres</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (₹)</label>
              <input
                type="number"
                min="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹)</label>
              <input
                type="number"
                min="0"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFilter;
