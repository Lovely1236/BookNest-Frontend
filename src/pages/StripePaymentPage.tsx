
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
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  useEffect(() => {
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
      const response = await stripeService.createPaymentIntent(id);
      setClientSecret(response.clientSecret);
      setPaymentAmount(response.amount);

      const stripe = window.Stripe(stripePublicKey);
      const elements = stripe.elements();
      const element = elements.create('card');
      element.mount('#card-element');

      setCardElement({ stripe, elements, element });

      element.on('change', (event: any) => {
        if (event.error) {
          setErrorMessage(event.error.message);
        } else {
          setErrorMessage('');
        }
      });
    } catch (error) {
      console.error('Stripe initialization error:', error);
      setErrorMessage('Failed to initialize payment.');
      toast.error('Failed to load payment form');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardElement || !clientSecret) {
      setErrorMessage('Payment form not ready.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const { stripe, element } = cardElement;

      // ✅ FIXED STRIPE RESPONSE HANDLING
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: element,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setStatus('error');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirm payment on backend to update order status
        try {
          await stripeService.confirmPayment(id, paymentIntent.id);
          setStatus('success');
          toast.success('Payment successful!');
          setTimeout(() => {
            navigate(`/orders/${id}`);
          }, 2000);
        } catch (confirmError) {
          console.error('Failed to confirm payment on backend:', confirmError);
          setErrorMessage('Payment succeeded but confirmation failed. Please refresh the page.');
          setStatus('error');
        }
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
        <Link to="/orders" className="text-blue-600 font-medium">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-md mx-auto px-4">
        <Link
          to={`/orders/${id}`}
          className="flex items-center gap-2 text-sm text-gray-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 text-white">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <CreditCard /> Secure Payment
            </h1>
            <p>Order #{order.orderId}</p>
          </div>

          {status === 'success' && (
            <div className="bg-green-100 p-4 flex items-center gap-2">
              <CheckCircle /> Payment Successful
            </div>
          )}

          {status === 'error' && errorMessage && (
            <div className="bg-red-100 p-4 flex items-center gap-2">
              <AlertCircle /> {errorMessage}
            </div>
          )}

          {status !== 'success' && (
            <form onSubmit={handlePayment} className="p-6 space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="flex justify-between">
                  <span>Amount</span>
                  <span>
                    {paymentAmount > 0
                      ? formatCurrency(paymentAmount)
                      : '₹0.00'}
                  </span>
                </p>
              </div>

              <div id="card-element" className="p-4 border rounded" />

              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === 'processing' || !cardElement}
                className="w-full bg-blue-600 text-white py-3 rounded"
              >
                {status === 'processing'
                  ? 'Processing...'
                  : `Pay ${formatCurrency(paymentAmount)}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripePaymentPage;
