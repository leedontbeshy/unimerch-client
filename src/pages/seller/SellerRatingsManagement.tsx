import React, { useState } from 'react';
import '../../css/seller.css';

const SellerRatingsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [ratings] = useState([]); // Empty for now to show empty state

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    console.log('Filter changed to:', filter);
  };

  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">Quản Lý Đánh Giá</h1>
            <p className="page-subtitle">
              Chào mừng trở lại! Đây là tổng quan hoạt động của bạn hôm nay.
            </p>
          </div>
        </div>

        {/* Section Title with Star Icon */}
        <div className="section-title-wrapper">
          <h2 className="section-title">
            <span className="section-icon">⭐</span>
            Quản Lý Đánh Giá
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="ratings-controls">
          <div className="search-section">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filter-buttons-group">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            >
              Tất cả rating
            </button>
            
            <button 
              onClick={() => handleFilterChange('products')}
              className={`filter-btn ${activeFilter === 'products' ? 'active' : ''}`}
            >
              Tất cả sản phẩm
            </button>
          </div>
        </div>

        {/* Ratings Content */}
        <div className="ratings-content">
          {/* Empty State */}
          {ratings.length === 0 && (
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
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
              <div className="empty-content">
                <h3 className="empty-title">Chưa có đánh giá nào</h3>
                <p className="empty-subtitle">Chưa có đánh giá nào cho sản phẩm của bạn.</p>
              </div>
            </div>
          )}

          {/* Ratings List - Will be implemented later */}
          {ratings.length > 0 && (
            <div className="ratings-list">
              {/* Rating cards will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerRatingsManagement;