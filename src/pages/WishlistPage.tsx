import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { BookGrid } from '../components/book/BookGrid';

export const WishlistPage: React.FC = () => {
  const { wishlist, isLoading } = useWishlist();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500" />
        My Wishlist
        {/* show count from wishlist array (wishlist is Book[] or undefined) */}
        {(() => {
          const books = wishlist ?? [];
          return books.length > 0 ? (
            <span className="text-sm font-normal text-gray-500">({books.length} books)</span>
          ) : null;
        })()}
      </h1>

      <BookGrid books={wishlist ?? []} isLoading={isLoading} emptyMessage="Your wishlist is empty. Browse books and save your favourites!" />
    </div>
  );
};

export default WishlistPage;
