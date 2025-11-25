import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import { useCart } from '../hooks/useCart';
import { cartService } from '../services/cartService';
import type { Product } from '../types/product.types';
import type { Review } from '../types/admin.types';
import '../css/product.css';
import '../css/product-detail.css';
import Header from '../components/Header';
import { useToast } from '../context/ToastContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Only useCart if you want to show cart state, but not needed for add/clear
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const { showToast } = useToast();
  const { refreshCart } = useCart();
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [ratingDistribution, setRatingDistribution] = useState<{[key: number]: number}>({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  });
  const [sortBy, setSortBy] = useState<'all' | 'newest'>('all');
  
  // Write review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) throw new Error('Không tìm thấy sản phẩm');
        const prod = await productService.getProductById(Number(id));
        setProduct(prod);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews when product is loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        // Fetch all reviews to calculate distribution
        const allReviewsResponse = await reviewService.getProductReviews(Number(id), {
          page: 1,
          limit: 1000 // Get all reviews for distribution
        });
        
        const allReviews = allReviewsResponse.reviews;
        setTotalReviews(allReviewsResponse.pagination.total_reviews);
        
        // Calculate average rating and distribution
        if (allReviews.length > 0) {
          const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
          setAverageRating(sum / allReviews.length);
          
          // Calculate rating distribution
          const distribution: {[key: number]: number} = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
          allReviews.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1;
          });
          setRatingDistribution(distribution);
        }
        
        // Sort and paginate reviews for display
        let sortedReviews = [...allReviews];
        if (sortBy === 'newest') {
          sortedReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        // Paginate
        const startIdx = (reviewPage - 1) * 5;
        const endIdx = startIdx + 5;
        setReviews(sortedReviews.slice(startIdx, endIdx));
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id, reviewPage, sortBy]);

  const [quantity, setQuantity] = useState(1);
  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await cartService.addToCart(product.id, quantity);
      await refreshCart();
      showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
      // Dispatch cartUpdated event for header
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      showToast('Không thể thêm vào giỏ hàng', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await cartService.clearCart();
      await cartService.addToCart(product.id, quantity);
      await refreshCart();
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/checkout');
    } catch (err) {
      // handle error/toast if needed
    }
  };

  const handleSubmitReview = async () => {
    if (!product || !id) return;
    
    if (newReviewRating === 0) {
      showToast('Vui lòng chọn số sao đánh giá', 'error');
      return;
    }
    
    if (!newReviewComment.trim()) {
      showToast('Vui lòng nhập nhận xét', 'error');
      return;
    }
    
    setSubmittingReview(true);
    try {
      await reviewService.createReview(Number(id), newReviewRating, newReviewComment);
      showToast('Đã gửi đánh giá thành công!', 'success');
      
      // Reset form
      setNewReviewRating(0);
      setNewReviewComment('');
      setShowReviewForm(false);
      
      // Refresh reviews
      const response = await reviewService.getProductReviews(Number(id), {
        page: 1,
        limit: 1000
      });
      
      const allReviews = response.reviews;
      setTotalReviews(response.pagination.total_reviews);
      
      if (allReviews.length > 0) {
        const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
        setAverageRating(sum / allReviews.length);
        
        const distribution: {[key: number]: number} = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        allReviews.forEach(review => {
          distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        });
        setRatingDistribution(distribution);
      }
      
      let sortedReviews = [...allReviews];
      if (sortBy === 'newest') {
        sortedReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      
      const startIdx = (reviewPage - 1) * 5;
      const endIdx = startIdx + 5;
      setReviews(sortedReviews.slice(startIdx, endIdx));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Không thể gửi đánh giá', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="product-detail-page loading">Đang tải...</div>;
  if (error || !product) return <div className="product-detail-page error">{error || 'Không tìm thấy sản phẩm'}</div>;

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">☆</span>);
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
      <Header />
      <section className="product-detail-page">
        <div className="product-detail-container">
          <div className="product-detail-image">
            <img src={product.image_url} alt={product.name} onError={e => (e.currentTarget.src = '/placeholder-product.png')} />
          </div>
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <div className="product-detail-price">
              <span className="current">{formatPrice(hasDiscount ? product.discount_price! : product.price)}</span>
              {hasDiscount && <span className="original">{formatPrice(product.price)}</span>}
            </div>
            <div className="product-detail-description">{product.description}</div>
            <div style={{margin: '24px 0 12px 0'}}>
              <label style={{fontWeight: 600, marginBottom: 8, display: 'block'}}>Số lượng</label>
              <div className="product-detail-qty">
                <button
                  className="product-detail-qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >-</button>
                <span className="product-detail-qty-value">{quantity}</span>
                <button
                  className="product-detail-qty-btn"
                  onClick={() => setQuantity(q => q + 1)}
                >+</button>
              </div>
            </div>
            <div className="product-detail-actions">
              <button className="buy-now" onClick={handleBuyNow} disabled={adding}>Mua ngay</button>
              <button className="add-to-cart" onClick={handleAddToCart} disabled={adding}>Thêm vào giỏ</button>
            </div>
            {/* Extra info section below actions */}
            <div style={{marginTop: '32px'}}>
              <div style={{borderTop: '1px solid #222', marginBottom: '18px'}}></div>
              <div className="product-detail-extra-info">
                <div className="product-detail-extra-row"><span role="img" aria-label="truck">🚚</span> Miễn phí vận chuyển trong TP.HCM</div>
                <div className="product-detail-extra-row"><span role="img" aria-label="return">🔄</span> Đổi trả trong 30 ngày</div>
                <div className="product-detail-extra-row"><span role="img" aria-label="secure">🛡️</span> Thanh toán an toàn</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="reviews-title">Đánh giá</h2>
          
          <div className="reviews-content">
            {/* Left side - Rating Overview */}
            <div className="reviews-overview">
              <div className="rating-score">
                <span className="score-number">{averageRating.toFixed(1)}</span>
                <div className="score-stars">{renderStars(Math.round(averageRating))}</div>
                <span className="score-count">{totalReviews} reviews</span>
              </div>
              <button 
                className="write-review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                <span className="btn-icon">💬</span>
                VIẾT ĐÁNH GIÁ
              </button>
            </div>

            {/* Right side - Rating Distribution & Reviews */}
            <div className="reviews-main">
              {/* Rating Distribution Bars */}
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = ratingDistribution[star] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="rating-bar-row">
                      <span className="bar-label">{star}</span>
                      <span className="bar-star">★</span>
                      <div className="bar-container">
                        <div className="bar-fill" style={{width: `${percentage}%`}}></div>
                      </div>
                      <span className="bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Reviews List Header */}
              <div className="reviews-list-header">
                <h3>Tất cả đánh giá</h3>
                <div className="reviews-sort">
                  <button 
                    className={`sort-btn ${sortBy === 'all' ? 'active' : ''}`}
                    onClick={() => setSortBy('all')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
                    onClick={() => setSortBy('newest')}
                  >
                    Mới nhất
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="reviews-loading">Đang tải đánh giá...</div>
              ) : reviews.length === 0 ? (
                <div className="reviews-empty">
                  <span className="empty-icon">💬</span>
                  <p className="empty-title">Chưa có đánh giá</p>
                  <p className="empty-subtitle">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-user">
                          <div className="review-avatar">
                            {review.user_full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="review-user-info">
                            <span className="review-user-name">{review.user_full_name}</span>
                            <span className="review-date">{formatDate(review.created_at)}</span>
                          </div>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              )}

              {totalReviews > 5 && (
                <div className="reviews-pagination">
                  <button 
                    onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                    disabled={reviewPage === 1}
                    className="pagination-btn"
                  >
                    ← Trước
                  </button>
                  <span className="pagination-info">Trang {reviewPage}</span>
                  <button 
                    onClick={() => setReviewPage(p => p + 1)}
                    disabled={reviews.length < 5}
                    className="pagination-btn"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Write Review Form */}
        {showReviewForm && (
          <div className="write-review-form">
            <h3>Viết đánh giá</h3>
            
            <div className="form-group">
              <label>Đánh giá</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${newReviewRating >= star ? 'filled' : ''}`}
                    onClick={() => setNewReviewRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Nhận xét</label>
              <textarea
                className="review-textarea"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                rows={5}
              />
            </div>

            <button 
              className="submit-review-btn"
              onClick={handleSubmitReview}
              disabled={submittingReview}
            >
              {submittingReview ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductDetailPage;
