import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

export const CartSidebar: React.FC = () => {
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, totalPrice, itemCount, removeFromCart, updateQuantity } = useCart();

  if (!cartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col animate-slideDown">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Shopping Cart</h2>
            {itemCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-200" />
              <p className="text-gray-500">Your cart is empty</p>
              <Link
                to="/books"
                onClick={() => setCartOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.itemId}
                item={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="px-4 pb-6 border-t border-gray-100 pt-4">
            <CartSummary
              itemCount={itemCount}
              totalPrice={totalPrice}
              onCheckout={() => setCartOpen(false)}
            />
            <Link
              to="/books"
              onClick={() => setCartOpen(false)}
              className="block text-center text-sm text-gray-600 hover:text-blue-600 mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
