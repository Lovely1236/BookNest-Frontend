import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Order } from '../../types/order';
import { formatDate } from '../../utils/formatters';

interface OrderTrackingProps {
  order: Order;
}

const STAGES: Array<{ status: Order['orderStatus']; label: string }> = [
  { status: 'PLACED', label: 'Order Placed' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'DISPATCHED', label: 'Dispatched' },
  { status: 'DELIVERED', label: 'Delivered' },
];

const statusOrder = ['PLACED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED'];

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const currentIndex = statusOrder.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  const dateMap: Record<string, string | undefined> = {
    PLACED: order.orderDate,
    CONFIRMED: order.confirmedDate,
    DISPATCHED: order.dispatchedDate,
    DELIVERED: order.deliveredDate,
  };

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-semibold">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Order Tracking</h3>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex justify-between relative">
          {STAGES.map((stage, index) => {
            const done = index <= currentIndex;
            const current = index === currentIndex;
            const date = dateMap[stage.status];

            return (
              <div key={stage.status} className="flex flex-col items-center gap-2 w-20">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${done ? 'bg-blue-600' : 'bg-white border-2 border-gray-300'}`}>
                  {done ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : current ? (
                    <Clock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <p className={`text-xs text-center ${done ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {stage.label}
                </p>
                {date && (
                  <p className="text-xs text-gray-400 text-center">{formatDate(date)}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
