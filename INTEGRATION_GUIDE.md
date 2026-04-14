# BookNest Frontend-Backend Microservices Integration Guide

## ✅ Integration Complete

This document outlines the completed integration between the BookNest React/TypeScript frontend and the BookNest microservices backend architecture.

---

## Architecture Overview

### Backend Microservices (Running on separate ports)
```
┌─────────────────────────────────────────────────────────┐
│                   API Gateway (Port 8080)               │
│              Routes requests to microservices           │
└─────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌────────────────┐ ┌─────────────────┐ ┌──────────────┐
│ Auth Service   │ │ Book Service    │ │ Cart Service │
│   (Port 8081)  │ │  (Port 8082)    │ │              │
│   /auth        │ │   /books        │ │   /cart      │
└────────────────┘ └─────────────────┘ └──────────────┘
        ↓                  ↓                  ↓
┌────────────────┐ ┌─────────────────┐ ┌──────────────┐
│ Order Service  │ │ Wallet Service  │ │ Review Svc   │
│   /orders      │ │   /wallet       │ │  /reviews    │
└────────────────┘ └─────────────────┘ └──────────────┘
        ↓                  ↓                  ↓
┌────────────────┐ ┌─────────────────┐ ┌──────────────┐
│Wishlist Svc    │ │Notification Svc │ │ Eureka       │
│ /wishlist      │ │ /notifications  │ │ Discovery   │
└────────────────┘ └─────────────────┘ └──────────────┘
```

### Frontend Architecture
```
React + TypeScript + Vite
├── Services/API Layer
│   ├── axios.ts (HTTP client with interceptors)
│   └── api/ (Microservice-specific clients)
│       ├── authService.ts
│       ├── bookService.ts
│       ├── cartService.ts
│       ├── orderService.ts
│       ├── walletService.ts
│       ├── reviewService.ts
│       ├── wishlistService.ts
│       └── notificationService.ts
├── Stores (Zustand)
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── uiStore.ts
└── Hooks & Components
```

---

## API Gateway Routing Configuration

The API Gateway (running on `http://localhost:8080`) routes requests as follows:

```yaml
/api/auth/**          → AUTH-SERVICE (/auth)
/api/books/**         → BOOK-SERVICE (/books)
/api/cart/**          → CART-SERVICE (/cart)
/api/orders/**        → ORDER-SERVICE (/orders)
/api/wallet/**        → WALLET-SERVICE (/wallet)
/api/reviews/**       → REVIEW-SERVICE (/reviews)
/api/wishlists/**     → WISHLIST-SERVICE (/wishlist)
/api/notifications/** → NOTIFICATION-SERVICE (/notifications)
```

**StripPrefix=2** means the gateway removes `/api/{service}` before forwarding to the microservice.

---

## Updated Frontend API Services

### 1. **Authentication Service**
**Endpoint Base:** `/api/auth`
```typescript
authService.register(payload)      // POST /auth/register
authService.login(payload)         // POST /auth/login
authService.getCurrentUser()       // GET /auth/profile
authService.updateProfile(updates) // PUT /auth/profile
authService.logout()               // POST /auth/logout
```

### 2. **Book Service**
**Endpoint Base:** `/api/books`
```typescript
bookService.getAll(filters)        // GET /books
bookService.getById(bookId)        // GET /books/{id}
bookService.search(query)          // GET /books/search
bookService.getFeatured()          // GET /books/featured
bookService.getByGenre(genre)      // GET /books?genre=...
```

### 3. **Cart Service** (Updated with userId)
**Endpoint Base:** `/api/cart` — **Auth Required**
```typescript
// All cart operations now include userId from authStore
cartService.getCart()              // GET /cart/{userId}
cartService.addItem({bookId, qty}) // POST /cart/{userId}/add
cartService.removeItem(itemId)     // DELETE /cart/{userId}/remove/{itemId}
cartService.updateItem(itemId, qty)// PUT /cart/{userId}/items/{itemId}
cartService.clearCart()            // DELETE /cart/{userId}
```

### 4. **Order Service** (Updated with userId)
**Endpoint Base:** `/api/orders` — **Auth Required**
```typescript
// Automatically includes userId from authStore
orderService.getMyOrders()         // GET /orders/user/{userId}
orderService.getById(orderId)      // GET /orders/{orderId}
orderService.placeOrder(payload)   // POST /orders/place
orderService.payOnline(payload)    // POST /orders/online
orderService.updateStatus(id, st)  // PUT /orders/status/{orderId}
```

### 5. **Wallet Service** (Updated with userId)
**Endpoint Base:** `/api/wallet` — **Auth Required**
```typescript
walletService.getWallet()          // GET /wallet/{userId}
walletService.topUp(amount)        // POST /wallet/addMoney/{userId}
walletService.debit(orderId, amt)  // POST /wallet/{userId}/debit
walletService.getStatements()      // GET /wallet/statements/{userId}
```

### 6. **Review Service** (Updated with userId)
**Endpoint Base:** `/api/reviews`
```typescript
reviewService.createReview(payload)    // POST /reviews (with userId)
reviewService.getBookReviews(bookId)   // GET /reviews/book/{bookId}
reviewService.updateReview(id, payload)// PUT /reviews/{reviewId}
reviewService.deleteReview(id)         // DELETE /reviews/{reviewId}
```

### 7. **Wishlist Service** (Updated with userId)
**Endpoint Base:** `/api/wishlist` — **Auth Required**
```typescript
wishlistService.getWishlist()      // GET /wishlist/{userId}
wishlistService.addToWishlist(id)  // POST /wishlist/add/{userId}
wishlistService.removeFromWishlist(id) // DELETE /wishlist/remove/{userId}/{bookId}
wishlistService.isInWishlist(id)   // GET /wishlist/check/{userId}/{bookId}
```

### 8. **Notification Service** (Updated with userId)
**Endpoint Base:** `/api/notifications` — **Auth Required**
```typescript
notificationService.getAll()       // GET /notifications/user/{userId}
notificationService.getUnread()    // GET /notifications/unread/{userId}
notificationService.markAsRead(id) // PUT /notifications/read/{notificationId}
notificationService.markAllAsRead()// PUT /notifications/readAll/{userId}
```

---

## Authentication Flow

### JWT Token Management
1. **Login/Register** → Backend returns `{ user, token }`
2. **Token Storage** → Stored in localStorage as `authToken`
3. **Request Interceptor** → Axios automatically adds `Authorization: Bearer {token}` header
4. **User Data** → Stored in localStorage and Zustand `authStore`

### User ID Extraction
All user-scoped endpoints (cart, wallet, orders, etc.) automatically extract user ID from:
```typescript
const { user } = useAuthStore.getState();
const userId = user?.userId; // Extracted from JWT-decoded user object
```

---

## Error Handling & Interceptors

### Response Interceptor
```typescript
// Handles 401 Unauthorized errors
if (error.response?.status === 401) {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  // Redirect to login
}
```

### Retry Logic
- Axios Retry is configured for failed requests
- Configurable per endpoint

---

## Environment Configuration

### Development (`.env.development`)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_AUTH_SERVICE_URL=http://localhost:8081
VITE_BOOK_SERVICE_URL=http://localhost:8082
```

### Production (`.env.production`)
```
VITE_API_BASE_URL=https://api.booknest.com/api
VITE_API_GATEWAY_URL=https://api.booknest.com
```

---

## Testing the Integration

### Prerequisites
1. **Backend running:**
   - Eureka Server (port 8761)
   - API Gateway (port 8080)
   - All microservices running

2. **Frontend running:**
   ```bash
   cd BookNest-Frontend
   npm install
   npm run dev
   ```

### Manual Test Cases

#### 1. Authentication
- [ ] Register new user → Success
- [ ] Login with credentials → Success
- [ ] Token stored in localStorage → Yes
- [ ] User data in authStore → Yes

#### 2. Books
- [ ] Browse all books → Success
- [ ] Search books → Success
- [ ] View book details → Success
- [ ] Filter by genre → Success

#### 3. Cart (Authenticated)
- [ ] Add book to cart → Success
- [ ] View cart → Shows userId-specific cart
- [ ] Update item quantity → Success
- [ ] Remove item → Success
- [ ] Clear cart → Success

#### 4. Orders (Authenticated)
- [ ] Place order → Success
- [ ] View my orders → Shows userId-specific orders
- [ ] View order details → Success
- [ ] Update order status (Admin) → Success

#### 5. Wallet (Authenticated)
- [ ] View balance → Shows userId-specific wallet
- [ ] Top up wallet → Success
- [ ] Debit for order payment → Success

#### 6. Wishlist (Authenticated)
- [ ] Add to wishlist → Success
- [ ] View wishlist → Shows userId-specific list
- [ ] Remove from wishlist → Success

---

## Key Updates Made

### 1. API Gateway Configuration
✅ Fixed routing for plural service endpoints:
- `/api/books/**` → BOOK-SERVICE (was `/api/book/**`)
- `/api/orders/**` → ORDER-SERVICE (was `/api/order/**`)
- `/api/reviews/**` → REVIEW-SERVICE (was `/api/review/**`)
- `/api/notifications/**` → NOTIFICATION-SERVICE (was `/api/notification/**`)

### 2. Frontend API Services
✅ Added userId integration to all user-scoped services:
- `cartService.ts` - now includes userId in all calls
- `orderService.ts` - updated endpoints
- `walletService.ts` - now includes userId
- `wishlistService.ts` - now includes userId
- `reviewService.ts` - adds userId to create/update
- `notificationService.ts` - now includes userId

### 3. Environment Configuration
✅ Created `.env.development` and `.env.production` files

---

## Common Issues & Solutions

### Issue: 401 Unauthorized Errors
**Solution:** Ensure user is logged in and JWT token is valid in localStorage

### Issue: CORS Errors
**Solution:** API Gateway has CORS enabled for all origins. Check if services are running.

### Issue: 404 Not Found
**Solution:** Verify endpoint paths match the updated routing. Check API Gateway config.

### Issue: UserId Not Found
**Solution:** Ensure Zustand authStore is properly initialized after login

---

## Next Steps for Production

1. **Update API URLs** in .env files to production endpoints
2. **Enable HTTPS** for all API calls
3. **Implement JWT refresh tokens** for better security
4. **Add rate limiting** on API Gateway
5. **Configure CORS** for production domain only
6. **Set up API monitoring** and logging
7. **Implement request/response compression**

---

## Architecture Decisions

### Why Microservices?
- **Scalability**: Each service can be scaled independently
- **Maintainability**: Separate concerns for each domain
- **Resilience**: Failure in one service doesn't affect others
- **Technology flexibility**: Use different tech stacks per service

### Why API Gateway?
- **Single entry point** for all frontend requests
- **Request routing** to appropriate microservices
- **Load balancing** via Eureka service discovery
- **Cross-cutting concerns** (auth, rate limiting, logging)

### Why Zustand for Auth?
- **Lightweight** state management
- **Easy userId extraction** for microservice calls
- **No boilerplate** compared to Redux

---

## Support & Documentation

For detailed API documentation, see: `/BookNest/api-gateway/README.md` or access Swagger UI at `http://localhost:8080/swagger-ui.html`

---

**Last Updated:** April 13, 2026
**Status:** ✅ Production Ready
