import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { paymentService } from '../services/paymentService';
import type { CheckoutFormData, PaymentMethod } from '../types/payment.types';
import { useAuth } from '../hooks/useAuth';
import '../css/checkout.css';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    shipping_address: '',
    notes: '',
    payment_method: 'cod',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to cart if empty
    if (!cartLoading && cart.items.length === 0) {
      navigate('/cart');
    }

    // Load payment methods
    const loadPaymentMethods = async () => {
      try {
        const methods = await paymentService.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (err) {
        console.error('Failed to load payment methods:', err);
      }
    };

    void loadPaymentMethods();
  }, [cart.items.length, cartLoading, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ và tên');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!formData.shipping_address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await paymentService.createOrder({
        shipping_address: formData.shipping_address,
        phone: formData.phone,
        payment_method: formData.payment_method,
        notes: formData.notes || undefined,
        from_cart: true,
      });

      // Navigate to orders page with success message
      navigate('/orders', { 
        state: { 
          successMessage: `Đặt hàng thành công! Mã đơn: ${order.orderNumber}` 
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo đơn hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart.totalPrice;
  const shipping = 30000; // Fixed shipping fee
  const total = subtotal + shipping;

  if (cartLoading) {
    return (
      <section className="checkout-page">
        <div className="checkout-container">
          <div className="loading">Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Tạo đơn hàng</h1>
        </div>

        {error && <div className="checkout-alert error">{error}</div>}

        <div className="checkout-content">
          {/* Left side - Shipping Info & Payment */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="form-group-container">
                <div className="form-group-header">
                  <span className="icon">🚚</span>
                  <h2>Thông tin giao hàng</h2>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      Họ và tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ho Sy Nam Binh"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Số điện thoại <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0999999969"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nambinh236@gmail.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shipping_address">
                    Địa chỉ giao hàng <span className="required">*</span>
                  </label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    placeholder="123 Stay Home Street, District 10, HCMC"
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Ghi chú đơn hàng</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về đơn hàng (không bắt buộc)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-group-container">
                <div className="form-group-header">
                  <span className="icon">💳</span>
                  <h2>Phương thức thanh toán</h2>
                </div>

                <div className="payment-methods-list">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`payment-method ${
                        formData.payment_method === method.id ? 'selected' : ''
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, payment_method: method.id }))
                      }
                    >
                      <input
                        type="radio"
                        id={method.id}
                        name="payment_method"
                        value={method.id}
                        checked={formData.payment_method === method.id}
                        onChange={handleInputChange}
                      />
                      <label htmlFor={method.id}>
                        <div className="payment-method-icon">{method.icon}</div>
                        <div className="payment-method-info">
                          <strong>{method.name}</strong>
                          <p>{method.description}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="checkout-button"
                disabled={isSubmitting || cart.items.length === 0}
              >
                {isSubmitting ? 'Đang xử lý...' : (
                  <>
                    <span className="checkmark-icon">✓</span>
                    Đặt hàng
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right side - Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-card">
              <div className="order-summary-header">
                <span className="icon">📋</span>
                <h2>Tóm tắt đơn hàng</h2>
              </div>

              <div className="order-items">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="order-item">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h4>{item.product.name}</h4>
                      <p className="order-item-meta">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="order-item-price">
                      <span className="original-price">
                        {currencyFormatter.format(item.product.price)}
                      </span>
                      <span className="discounted-price">
                        {currencyFormatter.format(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary-breakdown">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{currencyFormatter.format(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{currencyFormatter.format(shipping)}</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>{currencyFormatter.format(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
