import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';

interface HeaderProps {
  showAuthButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showAuthButtons = true }) => {
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

        {showAuthButtons && (
          <div className="header-actions">
            <Link to="/login" className="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <Link to="/register" className="header-btn">
              ĐĂNG NHẬP
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
