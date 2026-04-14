import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { useBook } from '../hooks/useBooks';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { RatingStars } from '../components/book/RatingStars';
import { ReviewList } from '../components/review/ReviewList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuthStore } from '../stores/authStore';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);

  const { data: book, isLoading } = useBook(bookId);
  const { addToCart, isAdding } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuthStore();

  const inWishlist = isInWishlist(bookId);

  if (isLoading) return <LoadingSpinner fullPage />;

  if (!book) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Book not found</p>
        <Link to="/books" className="text-blue-600 mt-4 inline-block">Back to Books</Link>
      </div>
    );
  }

  const outOfStock = book.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <Link to="/books" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Books
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Cover */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] max-w-xs mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            {(() => {
              const placeholder = encodeURIComponent(book.title.substring(0, 2));
              const placeholderUrl = `https://via.placeholder.com/300x450/3b82f6/ffffff?text=${placeholder}`;
              return (
                <img
                  src={book.coverImageUrl || placeholderUrl}
                  alt={book.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src !== placeholderUrl) img.src = placeholderUrl;
                  }}
                />
              );
            })()}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <span className="text-sm text-blue-600 font-medium">{book.genre}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{book.title}</h1>
            <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
          </div>

          <div className="flex items-center gap-3">
            <RatingStars rating={book.rating} size="md" />
            <span className="text-sm text-gray-500">({book.rating.toFixed(1)})</span>
          </div>

          <div className="text-3xl font-bold text-gray-900">{formatCurrency(book.price)}</div>

          <div className="flex items-center gap-2 text-sm">
            {outOfStock ? (
              <span className="text-red-600 font-medium">Out of Stock</span>
            ) : (
              <span className="text-green-600 font-medium">In Stock ({book.stock} available)</span>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">{book.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">ISBN</span>
              <p className="font-medium text-gray-900">{book.isbn}</p>
            </div>
            <div>
              <span className="text-gray-500">Published</span>
              <p className="font-medium text-gray-900">{formatDate(book.publishedDate)}</p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => addToCart({ bookId: book.bookId, quantity: 1 })}
                disabled={outOfStock || isAdding}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button
                onClick={() =>
                  inWishlist
                    ? removeFromWishlist(book.bookId)
                    : addToWishlist(book)
                }
                className={`flex items-center gap-2 px-6 py-3 border-2 font-semibold rounded-lg transition-colors ${
                  inWishlist
                    ? 'border-red-500 text-red-500 hover:bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <p className="text-sm text-gray-600">
              <Link to="/login" className="text-blue-600 font-medium">Sign in</Link> to purchase or save to wishlist
            </p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-3xl">
        <ReviewList bookId={bookId} />
      </div>
    </div>
  );
};

export default BookDetailPage;
