export interface Order {
  orderId: number;
  userId: number;
  orderDate: string;
  amountPaid: number;
  modeOfPayment: 'COD' | 'ONLINE' | 'STRIPE';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  quantity: number;
  confirmedDate?: string;
  dispatchedDate?: string;
  deliveredDate?: string;
  deliveryAddress?: Address;
  items?: OrderItem[];
}

export interface OrderItem {
  itemId: number;
  bookId: number;
  bookTitle: string;
  bookCoverUrl?: string;
  price: number;
  quantity: number;
}

export interface Address {
  addressId?: number;
  fullName: string;
  mobile: string;
  flatHouseNo: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface PlaceOrderPayload {
  cartId: number;
  addressId: number;
  modeOfPayment: 'COD' | 'ONLINE' | 'STRIPE';
  amount?: number;
}
