import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import CartSidebar from './CartSidebar';
import { cartService } from '../services/cartService';
import '../css/header.css';

interface HeaderProps {
  showAuthButtons?: boolean;
  hideCart?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showAuthButtons = true, hideCart = false }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const fetchCartCount = async () => {
    try {
      const cart = await cartService.getCart();
      setCartItemCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      // Silently fail if user not logged in (401)
      if ((error as any)?.response?.status !== 401) {
        console.error('Error fetching cart count:', error);
      }
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    // Only fetch cart count if user is authenticated
    const token = localStorage.getItem('unimerch_token');
    if (token) {
      fetchCartCount();
    }
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      const token = localStorage.getItem('unimerch_token');
      if (token) {
        fetchCartCount();
      } else {
        setCartItemCount(0);
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsUserMenuOpen(false);
      await logout();
      // Force page reload to clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, still logout locally and reload
      window.location.href = '/login';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          UNIMERCH
        </Link>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">TRANG CHỦ</Link>
          <Link to="/all-products" className="nav-link">TẤT CẢ SẢN PHẨM</Link>
          <Link to="/orders" className="nav-link">ĐƠN HÀNG</Link>
        </nav>

        <div className="header-actions">
          {/* Cart Button */}
          {!hideCart && (
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="header-icon cart-icon-btn"
              aria-label="Shopping cart"
              title="Giỏ hàng"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
          
          {/* User Menu or Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="user-menu" ref={userMenuRef}>
              <button 
                className="user-menu-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {getInitials(user.fullName)}
                </div>
                <span className="user-name">{user.fullName}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-large">
                      {getInitials(user.fullName)}
                    </div>
                    <div className="user-info">
                      <div className="user-fullname">{user.fullName}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="user-dropdown-divider"></div>
                  
                  <div className="user-dropdown-menu">
                    {(user.role === 'admin' || user.role === 'seller') && (
                      <>
                        <Link 
                          to={user.role === 'admin' ? '/admin' : '/seller'} 
                          className="dropdown-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          <span>Dashboard</span>
                        </Link>
                        <div className="user-dropdown-divider"></div>
                      </>
                    )}
                    
                    <Link 
                      to="/orders" 
                      className="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      </svg>
                      <span>Đơn hàng của tôi</span>
                    </Link>
                    
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Thông tin cá nhân</span>
                    </Link>
                    
                    <div className="user-dropdown-divider"></div>
                    
                    <button 
                      type="button"
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : showAuthButtons ? (
            <>
              <Link to="/login" className="header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
              <Link to="/register" className="header-btn">
                ĐĂNG NHẬP
              </Link>
            </>
          ) : null}
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
