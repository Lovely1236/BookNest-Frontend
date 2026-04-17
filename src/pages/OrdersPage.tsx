import React from 'react';
import { Package } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/order/OrderCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const OrdersPage: React.FC = () => {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Package className="w-6 h-6" />
        My Orders
      </h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : orders?.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders?.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
