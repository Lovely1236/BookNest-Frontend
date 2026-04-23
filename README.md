# BookNest Frontend

Frontend application for BookNest, built with React + TypeScript + Vite.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Axios

## Getting Started

```bash
npm install
npm run dev
```

App runs on the Vite dev server (commonly `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment

Create/update env files as needed:

- `.env.development`
- `.env.production`
- `.env.example`

Typical API base URL key:

- `VITE_API_BASE_URL`

## Folder Structure (Scanned)

```text
BookNest-Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── OAuthButton.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── book/
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookFilter.tsx
│   │   │   ├── BookGrid.tsx
│   │   │   └── RatingStars.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSidebar.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/
│   │   │   ├── SalesChart.tsx
│   │   │   ├── StockAlert.tsx
│   │   │   ├── TopBooksChart.tsx
│   │   │   └── UsersList.tsx
│   │   ├── order/
│   │   │   ├── OrderCard.tsx
│   │   │   └── OrderTracking.tsx
│   │   ├── review/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ReviewList.tsx
│   │   └── wallet/
│   │       ├── TopUpForm.tsx
│   │       ├── TransactionHistory.tsx
│   │       └── WalletCard.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBooks.ts
│   │   ├── useCart.ts
│   │   ├── useNotifications.ts
│   │   ├── useOrders.ts
│   │   ├── useWallet.ts
│   │   └── useWishlist.ts
│   ├── pages/
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── BookDetailPage.tsx
│   │   ├── BrowseBooks.tsx
│   │   ├── CartPage.tsx
│   │   ├── CatalogManagementPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── Home.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── OAuthCallbackPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── OrderManagementPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── SearchResults.tsx
│   │   ├── StripePaymentPage.tsx
│   │   ├── UserManagementPage.tsx
│   │   ├── WalletPage.tsx
│   │   └── WishlistPage.tsx
│   ├── services/
│   │   └── api/
│   │       ├── adminService.ts
│   │       ├── analyticsService.ts
│   │       ├── authService.ts
│   │       ├── bookService.ts
│   │       ├── cartService.ts
│   │       ├── notificationService.ts
│   │       ├── orderService.ts
│   │       ├── reviewService.ts
│   │       ├── stripeService.ts
│   │       ├── walletService.ts
│   │       └── wishlistService.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── book.ts
│   │   ├── cart.ts
│   │   ├── index.ts
│   │   ├── notification.ts
│   │   ├── order.ts
│   │   ├── review.ts
│   │   └── wallet.ts
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```
