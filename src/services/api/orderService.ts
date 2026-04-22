import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Order, PlaceOrderPayload } from '../../types/order';

type RawOrder = Record<string, unknown>;

const normalizeOrder = (raw: RawOrder): Order => {
  const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
  const items = itemsRaw.map((item) => {
    const obj = item as Record<string, unknown>;
    return {
      itemId: Number(obj.itemId ?? 0),
      bookId: Number(obj.bookId ?? 0),
      bookTitle: String(obj.bookTitle ?? 'Book'),
      bookCoverUrl: obj.bookCoverUrl ? String(obj.bookCoverUrl) : undefined,
      price: Number(obj.price ?? 0),
      quantity: Number(obj.quantity ?? 1),
    };
  });

  const embeddedBook = (raw.book ?? undefined) as Record<string, unknown> | undefined;
  const derivedItemFromBook =
    items.length === 0 && embeddedBook
      ? [
          {
            itemId: 0,
            bookId: Number(embeddedBook.productId ?? 0),
            bookTitle: String(embeddedBook.productName ?? 'Book'),
            bookCoverUrl: embeddedBook.coverImageUrl
              ? String(embeddedBook.coverImageUrl)
              : undefined,
            price: Number(raw.amountPaid ?? raw.amount ?? 0),
            quantity: Number(raw.quantity ?? 1),
          },
        ]
      : items;

  return {
    orderId: Number(raw.orderId ?? 0),
    userId: Number(raw.userId ?? 0),
    orderDate: String(raw.orderDate ?? ''),
    amountPaid: Number(raw.amountPaid ?? raw.amount ?? 0),
    modeOfPayment: String(raw.modeOfPayment ?? 'COD') as Order['modeOfPayment'],
    orderStatus: String(raw.orderStatus ?? 'PLACED') as Order['orderStatus'],
    quantity: Number(raw.quantity ?? 1),
    confirmedDate: raw.confirmedDate ? String(raw.confirmedDate) : undefined,
    dispatchedDate: raw.dispatchedDate ? String(raw.dispatchedDate) : undefined,
    deliveredDate: raw.deliveredDate ? String(raw.deliveredDate) : undefined,
    deliveryAddress: ((raw.deliveryAddress ?? raw.address ?? undefined) as Order['deliveryAddress']) || undefined,
    items: derivedItemFromBook.length ? derivedItemFromBook : undefined,
  };
};

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/order/orders/user/${user.userId}`);
    return Array.isArray(data) ? data.map((o) => normalizeOrder(o as RawOrder)) : [];
  },

  getById: async (orderId: number): Promise<Order> => {
    const { data } = await apiClient.get(`/order/orders/${orderId}`);
    return normalizeOrder(data as RawOrder);
  },

  placeOrder: async (payload: PlaceOrderPayload): Promise<Order> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post('/order/orders/place', { ...payload, userId: user.userId });
    return normalizeOrder(data as RawOrder);
  },

  payOnline: async (payload: { orderId: number; walletId: number }): Promise<Order> => {
    const { data } = await apiClient.post('/order/orders/online', payload);
    return normalizeOrder(data as RawOrder);
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const { data } = await apiClient.delete(`/order/orders/${orderId}`, {});
    return normalizeOrder(data as RawOrder);
  },

  getAll: async (filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> => {
    const { data } = await apiClient.get('/order/orders', { params: filters });
    const payload = data as Record<string, unknown>;
    const orders = Array.isArray(payload.orders)
      ? payload.orders.map((o) => normalizeOrder(o as RawOrder))
      : Array.isArray(data)
      ? (data as RawOrder[]).map((o) => normalizeOrder(o))
      : [];
    return {
      orders,
      total: Number(payload.total ?? orders.length),
    };
  },

  updateStatus: async (orderId: number, status: string): Promise<Order> => {
    const { data } = await apiClient.put(`/order/orders/status/${orderId}`, { status });
    return data;
  },
};
