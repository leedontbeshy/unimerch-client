import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import CartPage from '../pages/CartPage';
import CategoryPage from '../pages/CategoryPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';

// Product Pages
import AllProductsPage from '../pages/AllProductsPage.tsx';

// Admin Pages
import AdminLayout from '../layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersManagement from '../pages/admin/UsersManagement';
import ProductsManagement from '../pages/admin/ProductsManagement';
import OrdersManagement from '../pages/admin/OrdersManagement';
import PaymentsManagement from '../pages/admin/PaymentsManagement';
import ReviewsManagement from '../pages/admin/ReviewsManagement';

// Seller Pages
import SellerLayout from '../layout/SellerLayout';
import SellerDashboard from '../pages/seller/SellerDashboard';
import SellerProductsManagement from '../pages/seller/SellerProductsManagement';
import SellerOrdersManagement from '../pages/seller/SellerOrdersManagement';
import SellerRatingsManagement from '../pages/seller/SellerRatingsManagement';

// Placeholder Home Page
import { useAuth } from '../hooks/useAuth.ts';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui', minHeight: '100vh', background: 'var(--bg-black)', color: 'var(--text-white)' }}>
      <h1 style={{ color: 'var(--neon-cyan)' }}>🎉 Chào mừng đến với UniMerch!</h1>
      <p style={{ color: 'var(--text-gray)', marginTop: '16px' }}>
        Xin chào, <strong>{user?.fullName}</strong>!
      </p>
      <p style={{ color: 'var(--text-gray)' }}>Email: {user?.email}</p>
      <p style={{ color: 'var(--text-gray)' }}>Role: {user?.role}</p>
      {user?.role === 'admin' && (
        <a href="/admin" style={{ 
          display: 'inline-block',
          marginTop: '24px', 
          padding: '12px 24px',
          background: 'var(--neon-cyan)',
          color: 'var(--bg-black)',
          textDecoration: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          marginRight: '12px'
        }}>
          🎛️ Admin Panel
        </a>
      )}
      <button
        onClick={logout}
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          background: 'var(--bg-input)',
          color: 'var(--text-white)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/all-products" element={<AllProductsPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="payments" element={<PaymentsManagement />} />
            <Route path="reviews" element={<ReviewsManagement />} />
          </Route>

          {/* Seller Routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProductsManagement />} />
            <Route path="orders" element={<SellerOrdersManagement />} />
            <Route path="ratings" element={<SellerRatingsManagement />} />
            <Route path="storefront" element={<Navigate to="/" replace />} />
          </Route>

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:slug"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
