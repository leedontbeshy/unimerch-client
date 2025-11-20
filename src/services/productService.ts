import type { Product } from '../types/product.types';
import api from './api';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Áo thun UniMerch Classic',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Áo hoodie Phi Hành Gia',
    price: 389000,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Áo khoác Varsity Xanh Mint',
    price: 459000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Túi vải Canvas Logo',
    price: 149000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
  }
];

const mockApiGet = async <T>(data: T, delay = 250): Promise<T> => {
  const response = await api.get<T>('/mock/products', {
    adapter: async (config) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    }
  });

  return response.data;
};

export const productService = {
  getMockProducts: async (): Promise<Product[]> => {
    return mockApiGet(mockProducts);
  }
};

export type { Product };

import type {
  Product,
  ProductFilters,
  ProductsResponse,
  CategoryResponse,
  ProductResponse,
} from '../types/product.types.ts';

class ProductService {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>('/api/products', {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const response = await api.get<{ success: boolean; message: string; data: Product[] }>(
      `/api/products/featured?limit=${limit}`
    );
    return response.data.data;
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const response = await api.get<ProductResponse>(`/api/products/${id}`);
    return response.data.data;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoryResponse> {
    const response = await api.get<CategoryResponse>('/api/categories');
    return response.data;
  }

  /**
   * Search products using the search API
   */
  async searchProducts(query: string, filters?: Partial<ProductFilters>): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    params.append('q', query);

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.min_price) params.append('min_price', filters.min_price.toString());
    if (filters?.max_price) params.append('max_price', filters.max_price.toString());

    const response = await api.get<ProductsResponse>(`/api/search/products?${params.toString()}`);
    return response.data;
  }

  /**
   * Get products by seller
   */
  async getProductsBySeller(
    sellerId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>(
      `/api/products/seller/${sellerId}?page=${page}&limit=${limit}`
    );
    return response.data;
  }
}

export default new ProductService();
