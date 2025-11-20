import React, { useState } from 'react';
import '../../css/seller.css';

const SellerProductsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState([]); // Empty for now to show empty state

  const handleAddProduct = () => {
    // TODO: Navigate to add product page or open modal
    console.log('Add new product');
  };

  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">Quản Lý Sản Phẩm</h1>
            <p className="page-subtitle">
              Chào mừng trở lại! Đây là tổng quan hoạt động của bạn hôm nay.
            </p>
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="products-header">
          <div className="search-section">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <button 
            onClick={handleAddProduct}
            className="add-product-btn"
          >
            + Thêm Sản Phẩm
          </button>
        </div>

        {/* Products Section */}
        <div className="products-section">
          <div className="section-header">
            <h2 className="section-title">Quản Lý Sản Phẩm</h2>
          </div>

          {/* Empty State */}
          {products.length === 0 && (
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
                  <path d="M3 6h18l-2 13H5L3 6z"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <path d="M10 11V9"/>
                  <path d="M14 11V9"/>
                  <path d="M18 6l-1 7"/>
                </svg>
              </div>
              <div className="empty-content">
                <h3 className="empty-title">Chưa có sản phẩm nào trong hệ thống</h3>
                <button 
                  onClick={handleAddProduct}
                  className="empty-action-btn"
                >
                  + Thêm Sản Phẩm Đầu Tiên
                </button>
              </div>
            </div>
          )}

          {/* Products List - Will be implemented later */}
          {products.length > 0 && (
            <div className="products-list">
              {/* Product cards will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductsManagement;