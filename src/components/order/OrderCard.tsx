import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Order } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/constants';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const firstItem = order.items?.[0];
  const bookTitle = firstItem?.bookTitle || 'Book details unavailable';
  const bookCoverUrl = firstItem?.bookCoverUrl || `https://via.placeholder.com/40x56/3b82f6/ffffff?text=${encodeURIComponent((firstItem?.bookTitle || 'Order').substring(0, 2))}`;

  return (
    <Link
      to={`/orders/${order.orderId}`}
      className="block bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
            <img src={bookCoverUrl} alt="Order book" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Order #{order.orderId}</p>
            <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
            <p className="text-xs text-gray-700 mt-0.5">{bookTitle}</p>
            {order.items && <p className="text-xs text-gray-400 mt-0.5">{order.items.length} item(s)</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{formatCurrency(order.amountPaid)}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.orderStatus]}`}>
              {ORDER_STATUS_LABELS[order.orderStatus]}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
