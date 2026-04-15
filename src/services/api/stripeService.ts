import apiClient from '../axios';

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
  orderId: number;
}

export const stripeService = {
  createPaymentIntent: async (orderId: number): Promise<PaymentIntentResponse> => {
    const { data } = await apiClient.post<PaymentIntentResponse>(
      `/order/orders/${orderId}/payment-intent`,
      {}
    );
    return data;
  },

  confirmPayment: async (orderId: number, paymentIntentId: string): Promise<{ status: string; message: string }> => {
    const { data } = await apiClient.post<{ status: string; message: string }>(
      `/order/orders/${orderId}/confirm-payment`,
      { paymentIntentId }
    );
    return data;
  },
};
