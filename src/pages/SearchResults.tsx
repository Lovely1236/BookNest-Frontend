import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useBookSearch } from '../hooks/useBooks';
import { BookGrid } from '../components/book/BookGrid';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: books, isLoading } = useBookSearch(query);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-5 h-5 text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
        </div>
        {!isLoading && (
          <p className="text-sm text-gray-500">
            {books?.length || 0} results found
          </p>
        )}
      </div>

      <BookGrid
        books={books}
        isLoading={isLoading}
        emptyMessage={`No books found for "${query}"`}
      />
    </div>
  );
};

export default SearchResults;
