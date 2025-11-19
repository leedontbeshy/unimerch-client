import React from 'react';
import type { Product } from '../../types/product.types.ts';
import ProductCard from './ProductCard.tsx';
import '../../css/product.css';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  isLoading?: boolean;
  addingProductId?: number | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart,
  isLoading = false,
  addingProductId = null
}) => {
  if (isLoading) {
    return (
      <div className="product-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="product-card product-card--skeleton">
            <div className="skeleton skeleton--image"></div>
            <div className="skeleton skeleton--text"></div>
            <div className="skeleton skeleton--text skeleton--text-short"></div>
            <div className="skeleton skeleton--button"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <p>Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
          isAdding={addingProductId === product.id}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
