import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

// Placeholder Home Page
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#688F5D' }}>🎉 Chào mừng đến với UniMerch!</h1>
      <p style={{ color: '#7A8A78', marginTop: '16px' }}>
        Xin chào, <strong>{user?.fullName}</strong>!
      </p>
      <p style={{ color: '#7A8A78' }}>Email: {user?.email}</p>
      <p style={{ color: '#7A8A78' }}>Role: {user?.role}</p>
      <button
        onClick={logout}
        style={{
          marginTop: '24px',
          padding: '12px 24px',
          background: '#9DC183',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
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

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
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
