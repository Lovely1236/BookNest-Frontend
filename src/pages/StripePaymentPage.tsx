import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useOrder } from '../hooks/useOrders';
import { stripeService } from '../services/api/stripeService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Stripe: any;
  }
}

type PaymentStatus = 'idle' | 'loading' | 'processing' | 'success' | 'error';

export const StripePaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const id = Number(orderId);

  const { data: order, isLoading: orderLoading } = useOrder(id);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [cardElement, setCardElement] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  useEffect(() => {
    // Load Stripe.js
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = initializeStripe;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const initializeStripe = async () => {
    if (!window.Stripe) {
      setErrorMessage('Failed to load Stripe. Please refresh the page.');
      return;
    }

    try {
      // Create payment intent
      const response = await stripeService.createPaymentIntent(id);
      setClientSecret(response.clientSecret);

      const stripe = window.Stripe(stripePublicKey);
      const elements = stripe.elements();
      const element = elements.create('card');
      element.mount('#card-element');
      setCardElement({ stripe, elements, element });

      // Handle card errors
      element.on('change', (event: any) => {
        if (event.error) {
          setErrorMessage(event.error.message);
        } else {
          setErrorMessage('');
        }
      });
    } catch (error) {
      setErrorMessage('Failed to initialize payment. Please try again.');
      toast.error('Failed to load payment form');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardElement || !clientSecret) {
      setErrorMessage('Payment form is not ready. Please refresh the page.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const { stripe, element } = cardElement;

      // Confirm the payment using the card element
      const { payload } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: element,
        },
      });

      if (payload.error) {
        setErrorMessage(payload.error.message);
        setStatus('error');
        toast.error(payload.error.message);
      } else if (payload.paymentIntent.status === 'succeeded') {
        setStatus('success');
        toast.success('Payment successful!');
        setTimeout(() => {
          navigate(`/orders/${id}`);
        }, 2000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(message);
      setStatus('error');
      toast.error(message);
    }
  };

  if (orderLoading) return <LoadingSpinner fullPage />;

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link to="/orders" className="text-blue-600 font-medium">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-md mx-auto px-4">
        <Link
          to={`/orders/${id}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Secure Payment</h1>
            </div>
            <p className="text-blue-100">Order #{order.orderId}</p>
          </div>

          {/* Status Message */}
          {status === 'success' && (
            <div className="bg-green-50 border-b-2 border-green-500 px-6 py-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Payment Successful!</p>
                <p className="text-sm text-green-700">Redirecting to order details...</p>
              </div>
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="bg-red-50 border-b-2 border-red-500 px-6 py-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Payment Failed</p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          {status !== 'success' && (
            <form onSubmit={handlePayment} className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency</span>
                  <span className="font-medium text-gray-900">INR</span>
                </div>
              </div>

              {/* Card Element */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Details
                </label>
                <div id="card-element" className="p-4 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent" />
                {errorMessage && (
                  <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                )}
              </div>

              {/* Test Card Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                <p className="font-semibold mb-1">Test Card Numbers:</p>
                <ul className="space-y-1 font-mono">
                  <li>• Success: 4242 4242 4242 4242</li>
                  <li>• Decline: 4000 0000 0000 0002</li>
                </ul>
                <p className="mt-2">Use any future date & any CVC</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'processing' || !cardElement}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'processing' ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay {formatCurrency(order.amountPaid)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your payment is secure and encrypted
              </p>
            </form>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">🔒 Secured by Stripe</p>
          <p className="text-xs text-gray-500">
            Your card information is never shared with us
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentPage;
