import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, MapPin, CreditCard, ClipboardList } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWallet } from '../hooks/useWallet';
import { usePlaceOrder } from '../hooks/useOrders';
import { addressSchema, AddressFormData } from '../utils/validation';
import { formatCurrency } from '../utils/formatters';
import { PAYMENT_MODES } from '../utils/constants';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

type Step = 'address' | 'payment' | 'review';

const STEPS: Array<{ id: Step; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: ClipboardList },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('address');
  const [addressData, setAddressData] = useState<AddressFormData | null>(null);
  const [paymentMode, setPaymentMode] = useState<'COD' | 'ONLINE' | 'STRIPE'>('COD');

  const { items, totalPrice, itemCount, cartId, isLoading: cartLoading, clearCart } = useCart();
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const currentIndex = STEPS.findIndex((s) => s.id === step);
  const tax = totalPrice * 0.18;
  const grandTotal = totalPrice + tax;

  const handleAddressSubmit = (data: AddressFormData) => {
    setAddressData(data);
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    if (!cartId) {
      toast.error('Cart not found');
      return;
    }
    if (paymentMode === 'ONLINE' && wallet && wallet.currentBalance < grandTotal) {
      toast.error('Insufficient wallet balance');
      return;
    }
    
    const mode: 'COD' | 'ONLINE' | 'STRIPE' = paymentMode === 'ONLINE' ? 'ONLINE' : paymentMode === 'STRIPE' ? 'STRIPE' : 'COD';
    const orderPayload = { cartId, addressId: 1, modeOfPayment: mode, amount: grandTotal };
    console.log('Placing order with payload:', orderPayload);
    
    placeOrder(orderPayload, {
      onSuccess: (order) => {
        console.log('Order placed successfully:', order);
        // Clear cart after successful order placement
        clearCart();
        if (paymentMode === 'STRIPE') {
          navigate(`/payment/stripe/${order.orderId}`);
        } else {
          navigate(`/orders/${order.orderId}`);
        }
        toast.success('Order placed successfully!');
      },
      onError: (error: any) => {
        console.error('Order placement failed:', error);
      },
    });
  };

  if (cartLoading || walletLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <button onClick={() => navigate('/books')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => {
          const done = i < currentIndex;
          const active = s.id === step;
          const Icon = s.icon;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${i < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step Content */}
        <div className="md:col-span-2">
          {step === 'address' && (
            <form onSubmit={handleSubmit(handleAddressSubmit)} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input {...register('fullName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input {...register('mobile')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flat / House No.</label>
                  <input {...register('flatHouseNo')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors.flatHouseNo && <p className="text-xs text-red-500 mt-1">{errors.flatHouseNo.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input {...register('city')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input {...register('state')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input {...register('pincode')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Continue to Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_MODES.map((mode) => (
                  <label
                    key={mode.value}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMode === mode.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={mode.value}
                      checked={paymentMode === mode.value}
                      onChange={() => setPaymentMode(mode.value as 'COD' | 'ONLINE' | 'STRIPE')}
                      className="text-blue-600"
                    />
                    <span className="font-medium text-gray-900">{mode.label}</span>
                    {mode.value === 'ONLINE' && wallet && (
                      <span className="ml-auto text-sm text-gray-500">
                        Balance: {formatCurrency(wallet.currentBalance)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('address')} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
                  Back
                </button>
                <button onClick={() => setStep('review')} className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Order Review</h2>

              {addressData && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
                  <p className="text-gray-600">
                    {addressData.fullName}, {addressData.flatHouseNo}, {addressData.city}, {addressData.state} – {addressData.pincode}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="font-medium text-gray-900 mb-1">Payment Method</p>
                <p className="text-gray-600">
                  {paymentMode === 'COD' 
                    ? 'Cash on Delivery' 
                    : paymentMode === 'ONLINE' 
                    ? 'E-Wallet Payment' 
                    : 'Stripe Payment'}
                </p>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.bookTitle} × {item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('payment')} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPending}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 h-fit">
          <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{itemCount} items</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (18%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
