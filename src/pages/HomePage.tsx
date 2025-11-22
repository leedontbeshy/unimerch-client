import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import '../css/home.css';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/all-products');
    } else {
      navigate('/register');
    }
  };

  return (
    <>
      <Header showAuthButtons={!user} />
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Dành cho Sinh Viên
            </div>
            
            <h1 className="hero-title">
              Nền tảng mua bán
              <span className="hero-highlight"> độc quyền</span>
              <br />
              dành cho sinh viên
            </h1>
            
            <p className="hero-subtitle">
              Kết nối cộng đồng sinh viên thông qua nền tảng thương mại điện tử 
              hiện đại, an toàn và tiện lợi. Mua sắm thông minh, giá trị tối ưu.
            </p>
            
            {user ? (
              <div className="hero-user-section">
                <div className="user-welcome-card">
                  <div className="welcome-text">
                    <span className="welcome-label">Xin chào trở lại</span>
                    <h3 className="welcome-name">{user.fullName}</h3>
                  </div>
                </div>
                
                <div className="hero-actions-grid">
                  <Link to="/all-products" className="action-card primary">
                    <div className="action-content">
                      <h4>Khám phá sản phẩm</h4>
                      <p>Xem tất cả sản phẩm mới</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </Link>
                  
                  <Link to="/orders" className="action-card secondary">
                    <div className="action-content">
                      <h4>Đơn hàng của tôi</h4>
                      <p>Theo dõi đơn hàng</p>
                    </div>
                    <div className="action-arrow">→</div>
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link to="/admin" className="action-card accent">
                      <div className="action-content">
                        <h4>Quản trị hệ thống</h4>
                        <p>Truy cập dashboard</p>
                      </div>
                      <div className="action-arrow">→</div>
                    </Link>
                  )}
                  
                  {user.role === 'seller' && (
                    <Link to="/seller" className="action-card accent">
                      <div className="action-content">
                        <h4>Seller Dashboard</h4>
                        <p>Quản lý cửa hàng</p>
                      </div>
                      <div className="action-arrow">→</div>
                    </Link>
                  )}
                </div>
                
                <button onClick={logout} className="btn-logout">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="hero-actions">
                <button onClick={handleGetStarted} className="btn-hero-primary">
                  Bắt đầu ngay
                  <span className="btn-arrow">→</span>
                </button>
                <Link to="/all-products" className="btn-hero-secondary">
                  Xem sản phẩm
                </Link>
              </div>
            )}
          </div>

          <div className="hero-visual">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">5+</div>
                <div className="stat-label">Sinh viên</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Sản phẩm</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">36%</div>
                <div className="stat-label">Hài lòng</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <span className="section-badge">Tính năng</span>
            <h2 className="section-title">Tại sao chọn UniMerch</h2>
            <p className="section-subtitle">
              Trải nghiệm mua sắm được thiết kế đặc biệt cho sinh viên
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h3 className="feature-title">Dành riêng sinh viên</h3>
              <p className="feature-description">
                Sản phẩm được chọn lọc kỹ lưỡng, phù hợp với nhu cầu 
                và ngân sách của sinh viên
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">02</div>
              <h3 className="feature-title">Giá cả tối ưu</h3>
              <p className="feature-description">
                Cam kết giá tốt nhất với nhiều chương trình ưu đãi 
                đặc biệt dành cho sinh viên
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">03</div>
              <h3 className="feature-title">Thanh toán bảo mật</h3>
              <p className="feature-description">
                Hệ thống thanh toán được mã hóa, bảo vệ thông tin 
                cá nhân tuyệt đối
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">04</div>
              <h3 className="feature-title">Giao hàng nhanh chóng</h3>
              <p className="feature-description">
                Vận chuyển nhanh, theo dõi đơn hàng real-time, 
                giao đúng hẹn
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">05</div>
              <h3 className="feature-title">Cộng đồng tin cậy</h3>
              <p className="feature-description">
                Kết nối mua bán trong cộng đồng sinh viên 
                được xác thực và tin cậy
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">06</div>
              <h3 className="feature-title">Đánh giá minh bạch</h3>
              <p className="feature-description">
                Hệ thống review chính xác giúp bạn đưa ra 
                quyết định mua sắm tốt nhất
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="section-header">
            <span className="section-badge">Danh mục</span>
            <h2 className="section-title">Khám phá sản phẩm</h2>
            <p className="section-subtitle">
              Tìm kiếm theo các danh mục phổ biến nhất
            </p>
          </div>

          <div className="categories-grid">
            <Link to="/all-products?category=electronics" className="category-card">
              <div className="category-visual electronics"></div>
              <div className="category-content">
                <h3 className="category-name">Điện tử & Công nghệ</h3>
                <p className="category-desc">Laptop, điện thoại, phụ kiện tech</p>
                <span className="category-link">Xem thêm →</span>
              </div>
            </Link>

            <Link to="/all-products?category=books" className="category-card">
              <div className="category-visual books"></div>
              <div className="category-content">
                <h3 className="category-name">Sách & Tài liệu</h3>
                <p className="category-desc">Giáo trình, sách tham khảo</p>
                <span className="category-link">Xem thêm →</span>
              </div>
            </Link>

            <Link to="/all-products?category=fashion" className="category-card">
              <div className="category-visual fashion"></div>
              <div className="category-content">
                <h3 className="category-name">Thời trang</h3>
                <p className="category-desc">Quần áo, giày dép, phụ kiện</p>
                <span className="category-link">Xem thêm →</span>
              </div>
            </Link>

            <Link to="/all-products?category=stationery" className="category-card">
              <div className="category-visual stationery"></div>
              <div className="category-content">
                <h3 className="category-name">Văn phòng phẩm</h3>
                <p className="category-desc">Dụng cụ học tập, văn phòng</p>
                <span className="category-link">Xem thêm →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-background">
            <div className="cta-gradient"></div>
          </div>
          <div className="cta-content">
            <h2 className="cta-title">Bắt đầu mua sắm ngay hôm nay</h2>
            <p className="cta-subtitle">
              Tham gia cộng đồng hàng nghìn sinh viên đang mua sắm thông minh trên UniMerch
            </p>
            <div className="cta-actions">
              {!user && (
                <>
                  <Link to="/register" className="btn-cta-primary">
                    Đăng ký miễn phí
                  </Link>
                  <Link to="/login" className="btn-cta-secondary">
                    Đăng nhập
                  </Link>
                </>
              )}
              {user && (
                <Link to="/all-products" className="btn-cta-primary">
                  Khám phá ngay
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">UniMerch</h3>
              <p className="footer-text">
                Nền tảng mua bán trực tuyến dành cho sinh viên
              </p>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Liên kết</h4>
              <ul className="footer-links">
                <li><Link to="/all-products">Sản phẩm</Link></li>
                <li><Link to="/category">Danh mục</Link></li>
                <li><Link to="/orders">Đơn hàng</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Hỗ trợ</h4>
              <ul className="footer-links">
                <li><a href="#">Trung tâm trợ giúp</a></li>
                <li><a href="#">Chính sách</a></li>
                <li><a href="#">Liên hệ</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 UniMerch. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
