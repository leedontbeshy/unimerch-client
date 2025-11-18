import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layout/AuthLayout';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: '',
    phone: '',
    address: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
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
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        studentId: formData.studentId || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });
      navigate('/');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-header">
        <div className="auth-logo">🛍️</div>
        <h1 className="auth-title">Đăng ký</h1>
        <p className="auth-subtitle">Tạo tài khoản UniMerch mới</p>
      </div>

      <div className="auth-body">
        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label form-label-required">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="john_doe"
              disabled={isLoading}
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>

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
            <label htmlFor="fullName" className="form-label form-label-required">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              placeholder="Nguyễn Văn A"
              disabled={isLoading}
            />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label form-label-required">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="studentId" className="form-label">
              Mã sinh viên <span className="form-label-optional">(tuỳ chọn)</span>
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="form-input"
              placeholder="SV2024001"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Số điện thoại <span className="form-label-optional">(tuỳ chọn)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="0987654321"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Địa chỉ <span className="form-label-optional">(tuỳ chọn)</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="checkbox-input"
                disabled={isLoading}
              />
              <label htmlFor="agreeToTerms" className="checkbox-label">
                Tôi đồng ý với{' '}
                <a href="/terms" className="auth-link" target="_blank">
                  Điều khoản sử dụng
                </a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="form-error">{errors.agreeToTerms}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-link">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
