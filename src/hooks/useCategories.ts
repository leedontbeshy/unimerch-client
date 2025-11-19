import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Category } from '../types/category.types';
import type { Product } from '../types/product.types';
import { categoryService } from '../services/categoryService';

interface UseCategoriesResult {
  categories: Category[];
  selectedCategory: Category | null;
  products: Product[];
  isLoading: boolean;
  isCategoryLoading: boolean;
  isProductLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useCategories = (slug?: string): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(true);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsCategoryLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
      setError(null);
    } catch {
      setError('Không thể tải danh mục. Vui lòng thử lại.');
    } finally {
      setIsCategoryLoading(false);
    }
  }, []);

  const fetchProductsForSlug = useCallback(async () => {
    if (!slug) {
      setSelectedCategory(null);
      setProducts([]);
      return;
    }

    setIsProductLoading(true);
    try {
      const category = await categoryService.getCategoryBySlug(slug);
      if (!category) {
        setSelectedCategory(null);
        setProducts([]);
        setError('Không tìm thấy danh mục.');
      } else {
        const items = await categoryService.getProductsByCategorySlug(slug);
        setSelectedCategory(category);
        setProducts(items);
        setError(null);
      }
    } catch {
      setSelectedCategory(null);
      setProducts([]);
      setError('Không thể tải sản phẩm cho danh mục này.');
    } finally {
      setIsProductLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    void fetchProductsForSlug();
  }, [fetchProductsForSlug]);

  return {
    categories,
    selectedCategory,
    products,
    isLoading: useMemo(() => isCategoryLoading || isProductLoading, [isCategoryLoading, isProductLoading]),
    isCategoryLoading,
    isProductLoading,
    error,
    refresh: fetchCategories
  };
};


