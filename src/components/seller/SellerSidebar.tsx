import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SellerSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="seller-sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo">
          <h2 className="logo-text">UNIMERCH</h2>
          <span className="logo-subtitle">Seller Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">TỔNG QUAN</h3>
          <NavLink 
            to="/seller" 
            end 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-text">Bảng Điều Khiển</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">QUẢN LÝ</h3>
          <NavLink 
            to="/seller/products" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-text">Sản Phẩm Của Tôi</span>
          </NavLink>
          
          <NavLink 
            to="/seller/orders" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-text">Đơn Hàng</span>
          </NavLink>

          <NavLink 
            to="/seller/ratings" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-text">Đánh Giá</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">KHÁC</h3>
          <NavLink 
            to="/seller/storefront" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-text">Về Cửa Hàng</span>
          </NavLink>
        </div>
      </nav>

      {/* User Info */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.fullName?.[0]?.toUpperCase() || 'L'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.fullName || 'Le Duy Phuc'}</div>
            <div className="user-email">{user?.email || 'duyphuc.0610@gmail.com'}</div>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="logout-btn"
          title="Đăng xuất"
        >
          🚪
        </button>
      </div>
    </div>
  );
};

export default SellerSidebar;