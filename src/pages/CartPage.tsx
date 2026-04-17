import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const CartPage: React.FC = () => {
  const { items, totalPrice, itemCount, removeFromCart, updateQuantity, isLoading } = useCart();

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <ShoppingCart className="w-6 h-6" />
        Shopping Cart
        {itemCount > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500">({itemCount} items)</span>
        )}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/books"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 px-4">
            {items.map((item) => (
              <CartItem
                key={item.itemId}
                item={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <CartSummary itemCount={itemCount} totalPrice={totalPrice} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
