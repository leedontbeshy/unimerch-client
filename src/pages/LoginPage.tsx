import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layout/AuthLayout';
import Header from '../components/Header';
import { loginWithEmail, signInWithGoogle } from '../services/firebaseAuthService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Login with Firebase first
      const firebaseUser = await loginWithEmail(formData.email, formData.password);
      
      // Then login with your backend API to get user role and other data
      const user = await login({
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Firebase User:', firebaseUser);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setApiError('');
    
    try {
      const firebaseUser = await signInWithGoogle();
      console.log('Google User:', firebaseUser);
      
      // You can sync with your backend API here if needed
      // await login({ email: firebaseUser.email, ... });
      
      navigate('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Đăng nhập Google thất bại';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header showAuthButtons={false} />
      <AuthLayout>
        <div className="auth-header">
          <h1 className="auth-title">Chào mừng trở lại</h1>
          <p className="auth-subtitle">Đăng nhập vào tài khoản Unimerch của bạn</p>
        </div>

      <div className="auth-body">
        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label form-label-required">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="example@student.edu.vn"
              disabled={isLoading}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label form-label-required">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="checkbox-input"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div className="forgot-password-link">
            <Link to="/forgot-password" className="btn-link">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>Hoặc</span>
        </div>

        <button 
          type="button" 
          className="btn btn-google" 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          Đăng nhập với Google
        </button>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="auth-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
