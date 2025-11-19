import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardIcon, 
  UsersIcon, 
  ProductsIcon, 
  OrdersIcon, 
  PaymentsIcon, 
  ReviewsIcon,
  HomeIcon 
} from './Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      title: 'Bảng Điều Khiển',
      path: '/admin',
      icon: <DashboardIcon />,
    },
    {
      title: 'Người Dùng',
      path: '/admin/users',
      icon: <UsersIcon />,
    },
    {
      title: 'Sản Phẩm',
      path: '/admin/products',
      icon: <ProductsIcon />,
    },
    {
      title: 'Đơn Hàng',
      path: '/admin/orders',
      icon: <OrdersIcon />,
    },
    {
      title: 'Thanh Toán',
      path: '/admin/payments',
      icon: <PaymentsIcon />,
    },
    {
      title: 'Đánh Giá',
      path: '/admin/reviews',
      icon: <ReviewsIcon />,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">UniMerch Admin</h2>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => window.innerWidth < 768 && onClose()}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <span className="sidebar-icon"><HomeIcon /></span>
            <span className="sidebar-text">Về Trang Chủ</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
