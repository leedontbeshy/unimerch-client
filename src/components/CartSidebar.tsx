import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cartService } from '../services/cartService';
import type { Cart } from '../types/cart.types';
import '../css/cart-sidebar.css';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      // Don't show error for 401 (user not logged in)
      if ((err as any)?.response?.status !== 401) {
        setError('Không thể tải giỏ hàng');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart immediately on mount and listen for updates
  useEffect(() => {
    // Only fetch if we have a token
    const token = localStorage.getItem('unimerch_token');
    if (token) {
      fetchCart();
    }

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      const token = localStorage.getItem('unimerch_token');
      if (token) {
        fetchCart();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    try {
      const updatedCart = await cartService.updateCartItemQuantity(productId, newQuantity);
      setCart(updatedCart);
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa sản phẩm');
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="cart-sidebar-header">
          <h2>Giỏ hàng ({cart.items.length})</h2>
          <button className="cart-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="cart-error">
            {error}
          </div>
        )}

        <div className="cart-sidebar-body">
          {isLoading ? (
            <div className="cart-loading">Đang tải...</div>
          ) : cart.items.length === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Giỏ hàng trống</p>
              <button className="btn-primary" onClick={() => { onClose(); navigate('/all-products'); }}>
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <img 
                      src={item.product.image_url || item.product.image} 
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3>{item.product.name}</h3>
                      <div className="cart-item-price">
                        {formatCurrency(item.product.price)}
                      </div>
                      <div className="cart-item-quantity">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => handleRemoveItem(item.product.id)}
                      title="Xóa sản phẩm"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-sidebar-footer">
                <div className="cart-total">
                  <span>Tổng cộng:</span>
                  <strong>{formatCurrency(cart.totalPrice)}</strong>
                </div>
                <button className="btn-checkout" onClick={handleCheckout}>
                  Thanh toán
                </button>
                <button className="btn-view-cart" onClick={() => { onClose(); navigate('/cart'); }}>
                  Xem giỏ hàng
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
