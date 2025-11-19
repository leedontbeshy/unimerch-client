import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import AuthLayout from '../layout/AuthLayout';
import Header from '../components/Header';
import { resetPassword } from '../services/firebaseAuthService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('Email không được để trống');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      // Send password reset email via Firebase
      await resetPassword(email);
      
      // Also call your backend if needed
      await authService.forgotPassword({ email });
      
      setSuccess(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header showAuthButtons={false} />
        <AuthLayout>
          <div className="auth-header">
            <h1 className="auth-title">Kiểm tra email</h1>
            <p className="auth-subtitle">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu</p>
          </div>

        <div className="auth-body">
          <div className="alert alert-success">
            Email hướng dẫn reset mật khẩu đã được gửi đến <strong>{email}</strong>
          </div>

          <p className="form-hint" style={{ textAlign: 'center', marginBottom: '20px' }}>
            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn. Link sẽ hết hạn sau 15 phút.
          </p>

          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Quay lại đăng nhập
          </Link>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Không nhận được email?{' '}
              <button
                onClick={() => setSuccess(false)}
                className="btn-link"
                style={{ display: 'inline' }}
              >
                Gửi lại
              </button>
            </p>
          </div>
        </div>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <Header showAuthButtons={false} />
      <AuthLayout>
        <div className="auth-header">
          <h1 className="auth-title">Quên mật khẩu</h1>
          <p className="auth-subtitle">Nhập email để đặt lại mật khẩu</p>
        </div>

      <div className="auth-body">
        {error && (
          <div className="alert alert-error">
            {error}
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
              value={email}
              onChange={handleChange}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="example@student.edu.vn"
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
            <p className="form-hint">
              Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email này
            </p>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Đang gửi...
              </>
            ) : (
              'Gửi email xác nhận'
            )}
          </button>

          <Link to="/login" className="btn btn-secondary">
            Quay lại đăng nhập
          </Link>
        </form>
      </div>
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;
