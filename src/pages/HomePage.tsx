import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const [featuredProducts] = useState([
    {
      id: 1,
      name: 'Áo Thun UEH 2025',
      price: 250000,
      image: 'https://shop.ueh.edu.vn/wp-content/uploads/2022/05/800x600-30.png',
      category: 'Áo Thun'
    },
    {
      id: 2,
      name: 'Logo UEH Vàng',
      price: 150000,
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-24-1.png',
      category: 'Phụ Kiện'
    },
    {
      id: 3,
      name: 'Ly Giữ Nhiệt UEH',
      price: 180000,
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-17.png',
      category: 'Ly'
    },
    {
      id: 4,
      name: 'Sổ Tay UEH',
      price: 80000,
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-23.png',
      category: 'Đồ Học Tập'
    }
  ]);

  useEffect(() => {
    // Parallax effect
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax') || '0.5');
        const element = el as HTMLElement;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const collections = [
    {
      title: 'Logo UEH',
      description: 'Logo UEH được chế tác tinh xảo từ inox phủ vàng cao cấp, với khuy cài mặt sau chắc chắn và tiện dụng.',
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-24-1.png',
      position: 'left'
    },
    {
      title: 'Áo Thun UEH',
      description: 'Áo thun cotton kinh điển không bao giờ lỗi mốt. Thoáng mát, bền bỉ và được làm để trường tồn.',
      image: 'https://shop.ueh.edu.vn/wp-content/uploads/2022/05/800x600-30.png',
      position: 'right'
    },
    {
      title: 'Ly UEH',
      description: 'Ly UEH được thiết kế tiện lợi và tỉ mỉ từng chi tiết, có khả năng giữ nhiệt lâu.',
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-17.png',
      position: 'left'
    },
    {
      title: 'ĐỒ DÙNG HỌC TẬP',
      description: 'Sổ tay, bút viết để tiếp thêm năng lượng cho hành trình học tập. Học thông minh, sống tốt hơn.',
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-23.png',
      position: 'right'
    }
  ];

  const lookbookImages = [
    'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-25.png',
    'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-24-1.png',
    'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2023/09/SP-211-510x610-1.png',
    'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-207-510x610-2.png',
    'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2023/09/SP-500-510x610-1.png',
    'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-10.png'
  ];

  return (
    <>
      <Header />
      <div className="home-page">
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          paddingTop: '80px',
          backgroundColor: '#0d0f12'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            width: '100%'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr',
              gap: '40px',
              alignItems: 'center'
            }}>
              {/* Left: Mascot */}
              <div data-parallax="0.3" style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" fill="#18b0b4" opacity="0.2"/>
                  <circle cx="100" cy="100" r="60" fill="rgb(78, 160, 255)" opacity="0.3"/>
                  <path d="M100 40 L120 80 L160 90 L130 120 L140 160 L100 140 L60 160 L70 120 L40 90 L80 80 Z" fill="#18b0b4"/>
                </svg>
              </div>

              {/* Center: Main Text */}
              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  fontWeight: '900',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: '1',
                  marginBottom: '0',
                  color: '#f1f3f5'
                }}>UNI</h1>
                <h1 style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  fontWeight: '900',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: '1',
                  marginBottom: '0',
                  color: '#f1f3f5'
                }}>MERCH</h1>
                <h1 style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  fontWeight: '900',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: '1',
                  color: '#18b0b4',
                  marginBottom: '20px'
                }}>CHO UEH</h1>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  marginBottom: '40px',
                  color: '#f1f3f5'
                }}>Mặc Đẹp. Học Giỏi.</p>
                
                <Link 
                  to="/all-products" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    backgroundColor: '#18b0b4',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#18b0b4';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#18b0b4';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  XEM SẢN PHẨM
                  <ArrowRight size={24} />
                </Link>
              </div>

              {/* Right: Vertical Text */}
              <div data-parallax="0.5" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '20px',
                color: '#f1f3f5'
              }}>
                <div style={{
                  writingMode: 'vertical-rl',
                  fontSize: '2rem',
                  fontWeight: '700',
                  letterSpacing: '0.2em'
                }}>2025</div>
                <div style={{
                  writingMode: 'vertical-rl',
                  fontSize: '1.5rem',
                  opacity: '0.6',
                  letterSpacing: '0.2em'
                }}>GIỚI HẠN</div>
                <div style={{
                  writingMode: 'vertical-rl',
                  fontSize: '2rem',
                  fontWeight: '700',
                  letterSpacing: '0.2em'
                }}>CAMPUS</div>
                <div style={{
                  writingMode: 'vertical-rl',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  letterSpacing: '0.2em'
                }}>BỘ SƯU TẬP</div>
                <div style={{
                  writingMode: 'vertical-rl',
                  fontSize: '1.5rem',
                  color: '#18b0b4',
                  fontWeight: '700',
                  letterSpacing: '0.2em',
                  marginTop: '20px'
                }}>RA MẮT — 2025</div>
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
