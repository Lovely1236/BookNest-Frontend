import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/cart';
import { formatCurrency } from '../../utils/formatters';

interface CartItemProps {
  item: CartItemType;
  onRemove: (itemId: number) => void;
  onUpdateQuantity: (params: { itemId: number; quantity: number }) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Cover */}
      <div className="w-14 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        <img
          src={item.bookCoverUrl || `https://via.placeholder.com/56x80/3b82f6/ffffff?text=${encodeURIComponent((item.bookTitle || '').substring(0, 2))}`}
          alt={item.bookTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{item.bookTitle}</h4>
        {item.author && <p className="text-xs text-gray-500 mt-0.5">{item.author}</p>}
        <p className="text-sm font-semibold text-blue-600 mt-1">{formatCurrency(item.price)}</p>

        {/* Quantity */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity({ itemId: item.itemId, quantity: item.quantity - 1 })}
            className="p-0.5 rounded border border-gray-300 hover:bg-gray-50"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity({ itemId: item.itemId, quantity: item.quantity + 1 })}
            className="p-0.5 rounded border border-gray-300 hover:bg-gray-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2">
        <p className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
        <button
          onClick={() => onRemove(item.itemId)}
          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
