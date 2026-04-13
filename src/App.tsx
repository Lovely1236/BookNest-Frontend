import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartSidebar } from './components/cart/CartSidebar';

// Pages
import { Home } from './pages/Home';
import { BrowseBooks } from './pages/BrowseBooks';
import { BookDetailPage } from './pages/BookDetailPage';
import { SearchResults } from './pages/SearchResults';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { WalletPage } from './pages/WalletPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CatalogManagementPage } from './pages/CatalogManagementPage';
import { OrderManagementPage } from './pages/OrderManagementPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotFoundPage } from './pages/NotFoundPage';

import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
    <CartSidebar />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Auth pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public pages */}
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/books" element={<AppLayout><BrowseBooks /></AppLayout>} />
            <Route path="/books/:id" element={<AppLayout><BookDetailPage /></AppLayout>} />
            <Route path="/search" element={<AppLayout><SearchResults /></AppLayout>} />

            {/* Protected customer pages */}
            <Route path="/cart" element={<AppLayout><ProtectedRoute><CartPage /></ProtectedRoute></AppLayout>} />
            <Route path="/checkout" element={<AppLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></AppLayout>} />
            <Route path="/orders" element={<AppLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></AppLayout>} />
            <Route path="/orders/:id" element={<AppLayout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></AppLayout>} />
            <Route path="/wishlist" element={<AppLayout><ProtectedRoute><WishlistPage /></ProtectedRoute></AppLayout>} />
            <Route path="/wallet" element={<AppLayout><ProtectedRoute><WalletPage /></ProtectedRoute></AppLayout>} />
            <Route path="/notifications" element={<AppLayout><ProtectedRoute><NotificationsPage /></ProtectedRoute></AppLayout>} />
            <Route path="/profile" element={<AppLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></AppLayout>} />

            {/* Admin pages */}
            <Route path="/admin" element={<AppLayout><ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute></AppLayout>} />
            <Route path="/admin/catalog" element={<AppLayout><ProtectedRoute requiredRole="ADMIN"><CatalogManagementPage /></ProtectedRoute></AppLayout>} />
            <Route path="/admin/orders" element={<AppLayout><ProtectedRoute requiredRole="ADMIN"><OrderManagementPage /></ProtectedRoute></AppLayout>} />
            <Route path="/admin/users" element={<AppLayout><ProtectedRoute requiredRole="ADMIN"><UserManagementPage /></ProtectedRoute></AppLayout>} />
            <Route path="/admin/analytics" element={<AppLayout><ProtectedRoute requiredRole="ADMIN"><AnalyticsPage /></ProtectedRoute></AppLayout>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
