import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/products/ProductGrid.tsx';
import SearchBar from '../components/products/SearchBar.tsx';
import FilterSection from '../components/products/FilterSection.tsx';
import Pagination from '../components/products/Pagination.tsx';
import productService from '../services/productService.ts';
import { cartService } from '../services/cartService';
import type { Product, Category, ProductFilters } from '../types/product.types.ts';
import { useToast } from '../context/ToastContext';
import '../css/products-page.css';

const AllProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { showToast } = useToast();

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

  const getEffectivePrice = useCallback((product: Product) => {
    return product.discount_price ?? product.price;
  }, []);

  const sortProductsList = useCallback((list: Product[], sortOption: string) => {
    const sorted = [...list];

    switch (sortOption) {
      case 'price_asc':
        sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case 'price_desc':
        sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return sorted;
  }, [getEffectivePrice]);

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
        const sortedProducts = sortProductsList(response.data.products, sortBy);

        setProducts(sortedProducts);
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
  }, [currentPage, selectedCategory, searchQuery, sortBy, sortProductsList]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

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

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      await cartService.addToCart(product.id, 1);
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      const errorMessage = err?.message || 'Không thể thêm vào giỏ hàng';
      showToast(`Lỗi: ${errorMessage}`, 'error');
      console.error('Add to cart error:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <>
      <Header />
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
            isLoading={isLoading || addingToCart !== null}
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
    </>
  );
};

export default AllProductsPage;
