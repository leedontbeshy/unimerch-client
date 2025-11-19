import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import '../css/category.css';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    categories,
    selectedCategory,
    products,
    isCategoryLoading,
    isProductLoading,
    error
  } = useCategories(slug);

  const handleSelectCategory = (categorySlug: string) => {
    if (categorySlug !== slug) {
      navigate(`/categories/${categorySlug}`);
    }
  };

  return (
    <section className="category-page">
      <div className="category-container">
        <div className="category-hero">
          <p style={{ color: '#48d9a4', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Danh mục nổi bật
          </p>
          <h1>Khám phá phong cách riêng của bạn</h1>
          <p style={{ color: '#9aa5b1', maxWidth: '640px' }}>
            Chọn danh mục phù hợp để xem những sản phẩm được tuyển chọn kỹ càng, cập nhật xu hướng
            mới nhất dành riêng cho sinh viên UniMerch.
          </p>
        </div>

        {error && <div className="category-alert error">{error}</div>}

        <div className="category-nav">
          {isCategoryLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="category-card"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="category-card-content">
                    <h3>Đang tải...</h3>
                  </div>
                </div>
              ))
            : categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`category-card${slug === category.slug ? ' active' : ''}`}
                  style={{ backgroundImage: `url(${category.featuredImage})` }}
                  onClick={() => handleSelectCategory(category.slug)}
                >
                  <div className="category-card-content">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>
                </button>
              ))}
        </div>

        <div className="category-products">
          <div className="category-products-header">
            <div>
              <p style={{ margin: 0, color: '#9aa5b1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {selectedCategory ? selectedCategory.name : 'Danh mục'}
              </p>
              <h2>{selectedCategory ? 'Sản phẩm nổi bật' : 'Chọn danh mục để xem sản phẩm'}</h2>
            </div>
            {selectedCategory && (
              <span style={{ color: '#48d9a4' }}>
                {products.length} sản phẩm
              </span>
            )}
          </div>

          {isProductLoading ? (
            <div className="category-empty">Đang tải sản phẩm...</div>
          ) : !slug ? (
            <div className="category-alert info">
              Hãy chọn một danh mục trong danh sách ở trên để xem sản phẩm chi tiết.
            </div>
          ) : products.length === 0 ? (
            <div className="category-empty">
              Chưa có sản phẩm trong danh mục này. Vui lòng quay lại sau nhé!
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <div className="product-card-body">
                    <h4>{product.name}</h4>
                    <span className="product-price">
                      {currencyFormatter.format(product.price)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;


