import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrder, useCancelOrder } from '../hooks/useOrders';
import { OrderTracking } from '../components/order/OrderTracking';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../utils/constants';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading } = useOrder(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const handleCancelOrder = () => {
    cancelOrder(orderId, {
      onSuccess: () => {
        setTimeout(() => {
          navigate('/orders');
        }, 1000);
      },
    });
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!order) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Order not found</p>
      <Link to="/orders" className="text-blue-600 mt-2 inline-block">Back to Orders</Link>
    </div>
  );

  const canCancel = order.orderStatus === 'PLACED';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      <Link to="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.orderDate)}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${ORDER_STATUS_COLORS[order.orderStatus]}`}>
          {ORDER_STATUS_LABELS[order.orderStatus]}
        </span>
      </div>

      <div className="space-y-4">
        <OrderTracking order={order} />

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.itemId} className="flex items-center gap-4">
                  <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.bookCoverUrl && (
                      <img src={item.bookCoverUrl} alt={item.bookTitle} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{item.bookTitle}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Mode</span>
              <span className="font-medium">
                {order.modeOfPayment === 'COD' 
                  ? 'Cash on Delivery' 
                  : order.modeOfPayment === 'ONLINE' 
                  ? 'E-Wallet Payment'
                  : 'Stripe Payment'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-gray-900">{formatCurrency(order.amountPaid)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.deliveryAddress.fullName}</p>
              <p>{order.deliveryAddress.flatHouseNo}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} – {order.deliveryAddress.pincode}</p>
              <p>{order.deliveryAddress.mobile}</p>
            </div>
          </div>
        )}

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="w-full py-3 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
