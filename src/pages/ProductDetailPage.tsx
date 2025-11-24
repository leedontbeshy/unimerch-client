import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useCart } from '../hooks/useCart';
import { cartService } from '../services/cartService';
import type { Product } from '../types/product.types';
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

  if (loading) return <div className="product-detail-page loading">Đang tải...</div>;
  if (error || !product) return <div className="product-detail-page error">{error || 'Không tìm thấy sản phẩm'}</div>;

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

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
      </section>
    </>
  );
};

export default ProductDetailPage;
