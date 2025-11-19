import React from 'react';
import { useCart } from '../hooks/useCart';
import '../css/cart.css';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

const CartPage: React.FC = () => {
  const {
    cart,
    totalItems,
    isLoading,
    error,
    successMessage,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    checkout
  } = useCart();

  const handleCheckout = async () => {
    try {
      await checkout();
    } catch {
      // errors handled via hook state
    }
  };

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <p style={{ color: '#48d9a4', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Giỏ hàng
          </p>
          <h1>Chốt đơn ngay hôm nay</h1>
          <span className="cart-summary">
            {totalItems} sản phẩm • {currencyFormatter.format(cart.totalPrice)}
          </span>
        </div>

        {error && <div className="cart-alert error">{error}</div>}
        {successMessage && <div className="cart-alert success">{successMessage}</div>}

        {isLoading ? (
          <div className="empty-cart">Đang tải giỏ hàng...</div>
        ) : cart.items.length === 0 ? (
          <div className="empty-cart">
            <p>Giỏ hàng của bạn đang trống.</p>
            <p>Khám phá sản phẩm mới nhất và thêm vào giỏ ngay!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map((item) => (
                <article className="cart-card" key={item.product.id}>
                  <img src={item.product.image} alt={item.product.name} loading="lazy" />

                  <div className="cart-card-body">
                    <div className="cart-card-info">
                      <h3>{item.product.name}</h3>
                      <p>{currencyFormatter.format(item.product.price)}</p>
                      <p>
                        Thành tiền:{' '}
                        <strong>
                          {currencyFormatter.format(item.product.price * item.quantity)}
                        </strong>
                      </p>
                    </div>

                    <div className="cart-actions">
                      <div className="quantity-controls">
                        <button
                          className="quantity-button"
                          aria-label="Giảm số lượng"
                          onClick={() => decreaseQuantity(item.product.id, item.quantity)}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-button"
                          aria-label="Tăng số lượng"
                          onClick={() => increaseQuantity(item.product.id, item.quantity)}
                        >
                          +
                        </button>
                      </div>
                      <span className="price-tag">
                        {currencyFormatter.format(item.product.price * item.quantity)}
                      </span>
                      <button
                        className="remove-button"
                        onClick={() => removeItem(item.product.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="cart-footer">
            <div className="cart-total">
              Tổng cộng: {currencyFormatter.format(cart.totalPrice)}
            </div>
            <button
              className="checkout-button neon"
              onClick={handleCheckout}
              disabled={cart.items.length === 0 || isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '1.1rem'
              }}
            >
              <svg 
                style={{ marginBottom: 2 }} 
                width="24" height="24" fill="none" stroke="#fff"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M17 18a5 5 0 00-10 0m10 0H7m10 0v1a2 2 0 01-2 2H9a2 2 0 01-2-2v-1M2 15V7a2 2 0 012-2h16a2 2 0 012 2v8"></path>
              </svg>
              Thanh toán ngay
            </button>
          </footer>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;


