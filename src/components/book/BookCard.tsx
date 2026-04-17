import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Book } from '../../types/book';
import { formatCurrency } from '../../utils/formatters';
import { RatingStars } from './RatingStars';
import { useAuthStore } from '../../stores/authStore';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { isAuthenticated } = useAuthStore();
  const { addToCart, isAdding, items: cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const placeholder = useMemo(
    () => `https://via.placeholder.com/200x300/3b82f6/ffffff?text=${encodeURIComponent(
      book.title.substring(0, 2)
    )}`,
    [book.title]
  );

  const inWishlist = isInWishlist(book.bookId);
  const outOfStock = book.stock === 0;
  const isInCart = cartItems.some((item) => item.bookId === book.bookId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || outOfStock) return;
    addToCart({ bookId: book.bookId, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (inWishlist) {
      removeFromWishlist(book.bookId);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <Link
      to={`/books/${book.bookId}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] bg-gray-100 overflow-hidden">
        <img
          src={book.coverImageUrl || placeholder}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src !== placeholder) img.src = placeholder;
          }}
        />

        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isAuthenticated && (
            <button
              onClick={handleWishlist}
              className="p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50"
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-4 h-4 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
              />
            </button>
          )}
          <Link
            to={`/books/${book.bookId}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-blue-50"
          >
            <Eye className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs text-blue-600 font-medium mb-1">{book.genre}</p>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{book.author}</p>
          <RatingStars rating={book.rating} size="sm" />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">{formatCurrency(book.price)}</span>
          {isAuthenticated && (
            isInCart ? (
              <Link
                to="/cart"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShoppingCart className="w-3 h-3" />
                Go to Cart
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={outOfStock || isAdding}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-3 h-3" />
                {outOfStock ? 'Sold Out' : 'Add'}
              </button>
            )
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
