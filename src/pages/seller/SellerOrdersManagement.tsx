import React, { useState } from 'react';
import '../../css/seller.css';

const SellerOrdersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders] = useState([]); // Empty for now to show empty state

  const handleStatusFilter = () => {
    // TODO: Open status filter dropdown
    console.log('Open status filter');
  };

  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">Quản Lý Đơn Hàng</h1>
            <p className="page-subtitle">
              Chào mừng trở lại! Đây là tổng quan hoạt động của bạn hôm nay.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="orders-controls">
          <div className="search-section">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <button 
            onClick={handleStatusFilter}
            className="status-filter-btn"
          >
            Tất cả trạng thái
          </button>
        </div>

        {/* Orders Section Title */}
        <div className="section-title-wrapper">
          <h2 className="section-title">Quản Lý Đơn Hàng</h2>
        </div>

        {/* Orders Content */}
        <div className="orders-content">
          {/* Empty State */}
          {orders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg 
                  width="80" 
                  height="80" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  className="empty-icon-svg"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                  <path d="M6 11h12"/>
                  <path d="M6 7h8"/>
                </svg>
              </div>
              <div className="empty-content">
                <h3 className="empty-title">Chưa có đơn hàng nào trong hệ thống</h3>
              </div>
            </div>
          )}

          {/* Orders List - Will be implemented later */}
          {orders.length > 0 && (
            <div className="orders-list">
              {/* Order cards will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrdersManagement;