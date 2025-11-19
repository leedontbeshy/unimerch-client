import api from './api.ts';
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
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.min_price) params.append('min_price', filters.min_price.toString());
    if (filters?.max_price) params.append('max_price', filters.max_price.toString());
    if (filters?.seller_id) params.append('seller_id', filters.seller_id.toString());

    const queryString = params.toString();
    const url = `/api/products${queryString ? `?${queryString}` : ''}`;

    const response = await api.get<ProductsResponse>(url);
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
