import React from 'react';
import '../../css/seller.css';

const SellerDashboard: React.FC = () => {
  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Bảng Điều Khiển</h1>
          <p className="dashboard-subtitle">
            Chào mừng trở lại! Đây là tổng quan hoạt động của bạn hôm nay.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-revenue">
            <div className="stat-content">
              <div className="stat-number">0 đ</div>
              <div className="stat-label">Tổng Doanh Thu</div>
            </div>
          </div>

          <div className="stat-card stat-card-orders">
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Tổng Đơn Hàng</div>
            </div>
          </div>

          <div className="stat-card stat-card-products">
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Sản Phẩm</div>
            </div>
          </div>

          <div className="stat-card stat-card-ratings">
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Đánh Giá</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container chart-revenue">
            <h3 className="chart-title">Phân Tích Doanh Thu</h3>
            <p className="chart-subtitle">Doanh thu theo ngày trong kỳ đã chọn</p>
            <div className="chart-placeholder">
              <div className="chart-axes">
                <div className="y-axis">
                  <div className="axis-label">7₫</div>
                  <div className="axis-label">6₫</div>
                  <div className="axis-label">5₫</div>
                  <div className="axis-label">4₫</div>
                  <div className="axis-label">3₫</div>
                  <div className="axis-label">2₫</div>
                  <div className="axis-label">1₫</div>
                  <div className="axis-label">0₫</div>
                </div>
                <div className="chart-area">
                  <div className="chart-line"></div>
                  <div className="chart-point active"></div>
                </div>
              </div>
              <div className="x-axis">
                <span>Không có dữ liệu</span>
              </div>
            </div>
          </div>

          <div className="chart-container chart-orders">
            <h3 className="chart-title">Trạng Thái Đơn Hàng</h3>
            <p className="chart-subtitle">Phân bố trạng thái đơn hàng</p>
            <div className="chart-placeholder">
              <div className="donut-chart">
                <div className="donut-circle">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="40"
                      strokeDasharray="502.65"
                      strokeDashoffset="0"
                    />
                  </svg>
                  <div className="donut-center">
                    <span className="donut-value">100%</span>
                    <span className="donut-label">Hoàn thành</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;