import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/products/ProductGrid.tsx';
import SearchBar from '../components/products/SearchBar.tsx';
import FilterSection from '../components/products/FilterSection.tsx';
import Pagination from '../components/products/Pagination.tsx';
import productService from '../services/productService.ts';
import type { Product, Category, ProductFilters } from '../types/product.types.ts';
import '../css/products-page.css';

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const ITEMS_PER_PAGE = 12;

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const filters: ProductFilters = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          status: 'available',
        };

        if (selectedCategory) {
          filters.category_id = selectedCategory;
        }

        if (searchQuery) {
          filters.search = searchQuery;
        }

        // Apply sorting
        if (sortBy !== 'newest') {
          filters.sort_by = sortBy as any;
        }

        const response = await productService.getProducts(filters);
        
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
        setTotalProducts(response.data.pagination.total);
        
      } catch (err: any) {
        console.error('Failed to load products:', err);
        setError(err?.response?.data?.message || 'Không thể tải sản phẩm');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, selectedCategory, searchQuery, sortBy]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle category filter
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add to cart (placeholder)
  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="products-hero__content">
          <h1 className="products-hero__title">
            BỘ SƯU TẬP <span className="products-hero__highlight">UEH 2025</span>
          </h1>
          <p className="products-hero__subtitle">
            KHÁM PHÁ TOÀN BỘ SẢN PHẨM CHÍNH HÃNG
          </p>
          <div className="products-hero__search">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="products-content">
        <div className="products-content__container">
          {/* Filter Section */}
          <FilterSection
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          {/* Product Count */}
          <div className="products-count">
            Hiển thị {products.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE + 1) : 0}-
            {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} trong tổng số {totalProducts} sản phẩm
          </div>

          {/* Error Message */}
          {error && (
            <div className="products-error">
              <p>{error}</p>
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {!isLoading && products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AllProductsPage;
