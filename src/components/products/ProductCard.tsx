import React from 'react';
import type { Product } from '../../types/product.types.ts';
import '../../css/product.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart && product.status === 'available') {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card">
      {hasDiscount && (
        <div className="product-card__badge">-{discountPercentage}%</div>
      )}
      
      <div className="product-card__image">
        <img 
          src={product.image_url} 
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.png';
          }}
        />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        
        <div className="product-card__price">
          <span className="product-card__price--current">
            {formatPrice(hasDiscount ? product.discount_price! : product.price)}
          </span>
          {hasDiscount && (
            <span className="product-card__price--original">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          className="product-card__button"
          onClick={handleAddToCart}
          disabled={product.status !== 'available'}
        >
          {product.status === 'available' ? 'Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
