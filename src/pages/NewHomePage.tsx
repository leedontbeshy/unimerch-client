import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import productService from '../services/productService';
import '../css/new-home.css';

// Arrow Right Icon Component
const ArrowRight = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const NewHomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load featured products from API
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await productService.getProducts({ 
          limit: 4, 
          status: 'available',
          sort_by: 'newest'
        });
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to load featured products:', error);
        // Fallback to placeholder products if API fails
        setFeaturedProducts([
          {
            id: 1,
            name: 'Áo Thun UEH 2025',
            price: 250000,
            image: 'https://shop.ueh.edu.vn/wp-content/uploads/2022/05/800x600-30.png',
            category: { name: 'Áo Thun' }
          },
          {
            id: 2,
            name: 'Logo UEH Vàng',
            price: 150000,
            image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-24-1.png',
            category: { name: 'Phụ Kiện' }
          },
          {
            id: 3,
            name: 'Ly Giữ Nhiệt UEH',
            price: 180000,
            image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-17.png',
            category: { name: 'Ly' }
          },
          {
            id: 4,
            name: 'Sổ Tay UEH',
            price: 80000,
            image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-23.png',
            category: { name: 'Đồ Học Tập' }
          }
        ]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const collections = [
    {
      title: 'Logo UEH',
      description: 'Logo UEH được chế tác tinh xảo từ inox phủ vàng cao cấp, với khuy cài mặt sau chắc chắn và tiện dụng.',
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-24-1.png',
      position: 'left',
      category: 'Phụ Kiện'
    },
    {
      title: 'Áo Thun UEH',
      description: 'Áo thun cotton kinh điển không bao giờ lỗi mốt. Thoáng mát, bền bỉ và được làm để trường tồn.',
      image: 'https://shop.ueh.edu.vn/wp-content/uploads/2022/05/800x600-30.png',
      position: 'right',
      category: 'Áo Thun'
    },
    {
      title: 'Ly UEH',
      description: 'Ly UEH được thiết kế tiện lợi và tỉ mỉ từng chi tiết, có khả năng giữ nhiệt lâu.',
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-17.png',
      position: 'left',
      category: 'Ly'
    },
    {
      title: 'ĐỒ DÙNG HỌC TẬP',
      description: 'Sổ tay, bút viết để tiếp thêm năng lượng cho hành trình học tập. Học thông minh, sống tốt hơn.',
      image: 'https://shop.ueh.edu.vn/ueh-souvenir/wp-content/uploads/2022/05/SP-23.png',
      position: 'right',
      category: 'Đồ Học Tập'
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

  useEffect(() => {
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

  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <Header />
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section" style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          paddingTop: '80px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            width: '100%'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}>
              {/* Mascot */}
              <div data-parallax="0.3" style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="80" fill="#18b0b4" opacity="0.2"/>
                  <circle cx="100" cy="100" r="60" fill="rgb(78, 160, 255)" opacity="0.3"/>
                  <path d="M100 40 L120 80 L160 90 L130 120 L140 160 L100 140 L60 160 L70 120 L40 90 L80 80 Z" fill="#18b0b4"/>
                </svg>
              </div>

              {/* Main Text */}
              <div style={{ textAlign: 'center' }}>
                <h1 className="hero-title" style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  fontWeight: '900',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: '1',
                  margin: '0'
                }}>UNI</h1>
                <h1 className="hero-title" style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  fontWeight: '900',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: '1',
                  margin: '0',
                  marginLeft: '-0.45em'
                }}>MERCH</h1>
                <h1 className="hero-title accent-color" style={{
                  fontSize: 'clamp(4rem, 10vw, 8rem)',
                  fontWeight: '900',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.05em',
                  lineHeight: '1',
                  marginBottom: '20px'
                }}>CHO UEH</h1>
                <p className="hero-title" style={{
                  fontSize: '1.5rem',
                  fontWeight: '300',
                  letterSpacing: '0.1em',
                  marginBottom: '40px'
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
                >
                  XEM SẢN PHẨM
                  <ArrowRight size={24} />
                </Link>
              </div>

              {/* Vertical Text */}
              <div data-parallax="0.5" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '20px',
                color: '#f1f3f5'
              }}>
                <div style={{ writingMode: 'vertical-rl', fontSize: '2rem', fontWeight: '900', letterSpacing: '0.2em' }} className="hero-vertical-text">2025</div>
                <div style={{ writingMode: 'vertical-rl', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '0.2em' }} className="hero-vertical-text">GIỚI HẠN</div>
                <div style={{ writingMode: 'vertical-rl', fontSize: '2rem', fontWeight: '900', letterSpacing: '0.2em' }} className="hero-vertical-text">CAMPUS</div>
                <div style={{ writingMode: 'vertical-rl', fontSize: '1.5rem', fontWeight: '900', letterSpacing: '0.2em' }} className="hero-vertical-text">BỘ SƯU TẬP</div>
                <div style={{ writingMode: 'vertical-rl', fontSize: '1.5rem', color: '#18b0b4', fontWeight: '700', letterSpacing: '0.2em', marginTop: '20px' }}>RA MẮT — 2025</div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Pills */}
        <section className="value-pills-section" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {['Giá sinh viên', 'Cotton cao cấp', 'Giao nhanh 2-3 ngày', 'Đổi trả trong 14 ngày'].map((pill, index) => (
              <span key={index} className="value-pill" style={{
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '0.95rem',
                border: '1px solid'
              }}>
                {pill}
              </span>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section style={{ padding: '80px 20px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 className="home-text-primary" style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '700',
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: '0.1em',
                marginBottom: '16px'
              }}>SẢN PHẨM BÁN CHẠY</h2>
              <p className="home-text-primary" style={{ fontSize: '1.2rem' }}>Những sản phẩm được yêu thích nhất</p>
            </div>

            {isLoadingProducts ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p className="home-text-secondary" style={{ fontSize: '1.1rem' }}>Đang tải sản phẩm...</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px'
              }}>
                {featuredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="product-card-home" 
                  onClick={() => handleProductClick(product.id)}
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="product-card-home-image-bg" style={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={product.image_url || product.image} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p className="accent-color" style={{ fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {typeof product.category === 'string' ? product.category : product.category?.name || 'Sản phẩm'}
                    </p>
                    <h3 className="home-text-primary" style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>
                      {product.name}
                    </h3>
                    <p className="accent-color" style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                      {(product.discount_price || product.price).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </section>

        {/* Typography Section */}
        <section style={{ position: 'relative', padding: '100px 20px', overflow: 'hidden' }}>
          <div className="typography-watermark" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(4rem, 15vw, 12rem)',
            fontWeight: '900',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontFamily: "'Montserrat', sans-serif"
          }}>
            UNIMERCH · UNIMERCH
          </div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 className="home-text-primary" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: '0.15em',
              marginBottom: '20px'
            }}>VĂN HÓA SINH VIÊN</h2>
            <p className="home-text-primary" style={{ fontSize: '1.2rem' }}>Thiết kế dành cho những sinh viên khác biệt</p>
          </div>
        </section>

        {/* Collections */}
        {collections.map((collection, index) => (
          <section key={index} style={{
            marginBottom: '80px',
            padding: '0 20px'
          }}>
            <div style={{
              maxWidth: '1400px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: collection.position === 'right' ? '1fr 1fr' : '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
              minHeight: '500px'
            }}>
              {/* Image Side */}
              <div style={{
                order: collection.position === 'right' ? 2 : 1,
                width: '100%',
                height: '500px',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#16181d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Content Side */}
              <div className="collection-content-box" style={{
                order: collection.position === 'right' ? 1 : 2,
                padding: '40px',
                borderRadius: '16px'
              }}>
                <h2 className="home-text-primary" style={{
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontWeight: '700',
                  marginBottom: '24px',
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.05em'
                }}>{collection.title}</h2>
                <p className="home-text-secondary" style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.8',
                  marginBottom: '40px'
                }}>{collection.description}</p>
                <Link
                  to={`/all-products?category=${collection.category}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '18px 36px',
                    backgroundColor: '#18b0b4',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(24, 176, 180, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#149a9e';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(24, 176, 180, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#18b0b4';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 176, 180, 0.3)';
                  }}>
                  Xem {collection.title}
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>
        ))}

        {/* Lookbook */}
        <section style={{ padding: '80px 20px', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="home-text-primary" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: '0.1em',
              marginBottom: '16px'
            }}>BỘ SƯU TẬP CAMPUS</h2>
            <p className="home-text-primary" style={{ fontSize: '1.2rem' }}>Sinh viên thật, phong cách thật</p>
          </div>

          <div style={{
            display: 'flex',
            gap: '30px',
            animation: 'scroll 30s linear infinite',
            width: 'max-content'
          }}>
            {[...lookbookImages, ...lookbookImages].map((img, index) => (
              <div key={index} style={{
                width: '300px',
                height: '400px',
                borderRadius: '16px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img 
                  src={img} 
                  alt={`Lookbook ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="value-pills-section" style={{
          padding: '100px 20px',
          textAlign: 'center'
        }}>
          <h2 className="home-text-primary" style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: '700',
            marginBottom: '24px',
            fontFamily: "'Montserrat', sans-serif"
          }}>SẴN SÀNG THAM GIA?</h2>
          <p className="home-text-secondary" style={{
            fontSize: '1.2rem',
            marginBottom: '40px'
          }}>Khám phá toàn bộ bộ sưu tập UniMerch 2025</p>
          <Link 
            to="/all-products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '20px 50px',
              backgroundColor: '#18b0b4',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '600',
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease'
            }}
          >
            MUA SẮM NGAY
            <ArrowRight size={24} />
          </Link>
        </section>
      </div>
    </>
  );
};

export default NewHomePage;