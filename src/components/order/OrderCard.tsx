import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { Order } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/constants';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Link
      to={`/orders/${order.orderId}`}
      className="block bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Order #{order.orderId}</p>
            <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
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
