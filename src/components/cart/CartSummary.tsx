import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
  onCheckout?: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  itemCount,
  totalPrice,
  onCheckout,
}) => {
  const tax = totalPrice * 0.18;
  const grandTotal = totalPrice + tax;

  return (
    <div className="border-t border-gray-100 pt-4 space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal ({itemCount} items)</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Tax (18%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>
      <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-3">
        <span>Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>

      {onCheckout ? (
        <button
          onClick={onCheckout}
          disabled={itemCount === 0}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Proceed to Checkout
        </button>
      ) : (
        <Link
          to="/checkout"
          className="block w-full py-3 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
};

export default CartSummary;
