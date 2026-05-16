export const APP_NAME = 'BookNest';
export const API_BASE_URL = 'http://localhost:8080/api';
export const GITHUB_OAUTH_ID = '';
export const GITHUB_REDIRECT_URI = '';

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Confirmed',
  DISPATCHED: 'Dispatched',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-yellow-100 text-yellow-800',
  DISPATCHED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
  'Self-Help',
  'Science',
  'Technology',
  'Children',
  'Young Adult',
  'Horror',
  'Poetry',
  'Drama',
  'Comics',
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export const PAYMENT_MODES = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'ONLINE', label: 'E-Wallet' },
  { value: 'STRIPE', label: 'Stripe Payment' },
];
