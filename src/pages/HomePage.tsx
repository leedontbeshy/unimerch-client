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
          <div className="hero-content">
            <div className="hero-badge">🎓 Dành cho Sinh Viên</div>
            <h1 className="hero-title">
              Chào mừng đến với
              <span className="hero-highlight"> UniMerch</span>
            </h1>
            <p className="hero-subtitle">
              Nền tảng mua bán trực tuyến dành riêng cho sinh viên. 
              Mua sắm thông minh, giao dịch an toàn, kết nối cộng đồng.
            </p>
            
            {user ? (
              <div className="hero-user-info">
                <p className="hero-welcome">
                  👋 Xin chào, <strong>{user.fullName}</strong>!
                </p>
                <div className="hero-actions">
                  <Link to="/all-products" className="btn-primary">
                    🛍️ Khám phá sản phẩm
                  </Link>
                  <Link to="/orders" className="btn-secondary">
                    📦 Đơn hàng của tôi
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="btn-accent">
                      🎛️ Quản trị
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link to="/seller" className="btn-accent">
                      📊 Seller Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="btn-ghost">
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="hero-actions">
                <button onClick={handleGetStarted} className="btn-primary">
                  🚀 Bắt đầu ngay
                </button>
                <Link to="/all-products" className="btn-secondary">
                  🔍 Xem sản phẩm
                </Link>
              </div>
            )}
          </div>

          <div className="hero-image">
            <div className="floating-card card-1">
              <span className="card-icon">🎒</span>
              <span className="card-text">Đồ dùng học tập</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">💻</span>
              <span className="card-text">Công nghệ</span>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon">👕</span>
              <span className="card-text">Thời trang</span>
            </div>
            <div className="floating-card card-4">
              <span className="card-icon">📚</span>
              <span className="card-text">Sách & Tài liệu</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Tại sao chọn UniMerch?</h2>
            <p className="section-subtitle">
              Nền tảng được thiết kế đặc biệt cho sinh viên
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Dành riêng cho SV</h3>
              <p className="feature-description">
                Sản phẩm được chọn lọc phù hợp với nhu cầu và ngân sách sinh viên
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Giá cả hợp lý</h3>
              <p className="feature-description">
                Giá tốt nhất thị trường với nhiều ưu đãi dành cho sinh viên
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Giao dịch an toàn</h3>
              <p className="feature-description">
                Thanh toán bảo mật, bảo vệ thông tin người dùng tuyệt đối
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Giao hàng nhanh</h3>
              <p className="feature-description">
                Vận chuyển nhanh chóng, theo dõi đơn hàng dễ dàng
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Cộng đồng SV</h3>
              <p className="feature-description">
                Kết nối và mua bán trong cộng đồng sinh viên tin cậy
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Đánh giá minh bạch</h3>
              <p className="feature-description">
                Hệ thống đánh giá chính xác giúp bạn chọn lựa tốt nhất
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="section-header">
            <h2 className="section-title">Danh mục nổi bật</h2>
            <p className="section-subtitle">
              Khám phá các danh mục sản phẩm phổ biến
            </p>
          </div>

          <div className="categories-grid">
            <Link to="/all-products?category=electronics" className="category-item">
              <div className="category-icon">💻</div>
              <h3 className="category-name">Điện tử</h3>
              <p className="category-desc">Laptop, điện thoại, phụ kiện</p>
            </Link>

            <Link to="/all-products?category=books" className="category-item">
              <div className="category-icon">📚</div>
              <h3 className="category-name">Sách & Tài liệu</h3>
              <p className="category-desc">Giáo trình, tham khảo</p>
            </Link>

            <Link to="/all-products?category=fashion" className="category-item">
              <div className="category-icon">👕</div>
              <h3 className="category-name">Thời trang</h3>
              <p className="category-desc">Quần áo, giày dép</p>
            </Link>

            <Link to="/all-products?category=stationery" className="category-item">
              <div className="category-icon">✏️</div>
              <h3 className="category-name">Văn phòng phẩm</h3>
              <p className="category-desc">Bút, vở, dụng cụ học tập</p>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn sàng mua sắm?</h2>
            <p className="cta-subtitle">
              Tham gia UniMerch ngay hôm nay và khám phá hàng nghìn sản phẩm dành cho sinh viên
            </p>
            <div className="cta-actions">
              {!user && (
                <>
                  <Link to="/register" className="btn-primary btn-large">
                    Đăng ký miễn phí
                  </Link>
                  <Link to="/login" className="btn-secondary btn-large">
                    Đăng nhập
                  </Link>
                </>
              )}
              {user && (
                <Link to="/all-products" className="btn-primary btn-large">
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
