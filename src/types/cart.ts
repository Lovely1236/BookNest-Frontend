export interface CartItem {
  itemId: number;
  bookId: number;
  bookTitle: string;
  bookCoverUrl?: string;
  author?: string;
  price: number;
  quantity: number;
  stock?: number;
}

export interface Cart {
  cartId: number;
  userId: number;
  totalPrice: number;
  items: CartItem[];
}
