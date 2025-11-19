import api from './api';
import type {
  DashboardStats,
  RecentActivityResponse,
  RevenueAnalytics,
  PaymentMethodAnalytics,
  ProductAnalytics,
  SellerAnalytics,
  OrderAnalytics,
  UserGrowthAnalytics,
  UserListResponse,
  User,
  ProductListResponse,
  Product,
  OrderListResponse,
  Order,
  PaymentListResponse,
  Payment,
  UserFilters,
  ProductFilters,
  OrderFilters,
  PaymentFilters,
  Category,
  CategoryListResponse,
  CreateCategoryData,
  UpdateCategoryData,
  Review,
  ReviewListResponse,
  ReviewFilters,
} from '../types/admin.types';

const adminService = {
  // ============ Dashboard & Statistics ============
  
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/api/admin/stats/dashboard');
    return response.data.data;
  },

  async getRecentActivity(limit = 20): Promise<RecentActivityResponse> {
    const response = await api.get('/api/admin/stats/recent-activity', {
      params: { limit },
    });
    return response.data.data;
  },

  async getRevenueAnalytics(
    period: 'hour' | 'day' | 'week' | 'month' | 'year' = 'day',
    limit = 30
  ): Promise<RevenueAnalytics> {
    const response = await api.get('/api/admin/stats/revenue', {
      params: { period, limit },
    });
    return response.data.data;
  },

  async getPaymentMethodStats(): Promise<PaymentMethodAnalytics> {
    const response = await api.get('/api/admin/stats/payment-methods');
    return response.data.data;
  },

  async getProductAnalytics(limit = 10): Promise<ProductAnalytics> {
    const response = await api.get('/api/admin/stats/products', {
      params: { limit },
    });
    return response.data.data;
  },

  async getSellerAnalytics(limit = 10): Promise<SellerAnalytics> {
    const response = await api.get('/api/admin/stats/sellers', {
      params: { limit },
    });
    return response.data.data;
  },

  async getOrderAnalytics(): Promise<OrderAnalytics> {
    const response = await api.get('/api/admin/stats/orders');
    return response.data.data;
  },

  async getUserGrowthAnalytics(
    period: 'hour' | 'day' | 'week' | 'month' | 'year' = 'day',
    limit = 30
  ): Promise<UserGrowthAnalytics> {
    const response = await api.get('/api/admin/stats/users/growth', {
      params: { period, limit },
    });
    return response.data.data;
  },

  // ============ User Management ============

  async getUsers(filters?: UserFilters): Promise<UserListResponse> {
    const response = await api.get('/api/users', { params: filters });
    return response.data.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get(`/api/users/${id}`);
    return response.data.data;
  },

  async updateUser(
    id: number,
    data: Partial<User>
  ): Promise<User> {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/api/users/${id}`);
  },

  // ============ Product Management ============

  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const response = await api.get('/api/products', { params: filters });
    return response.data.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await api.get(`/api/products/${id}`);
    return response.data.data;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post('/api/products', data);
    return response.data.data;
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/api/products/${id}`);
  },

  // ============ Order Management ============

  async getOrders(filters?: OrderFilters): Promise<OrderListResponse> {
    const response = await api.get('/api/admin/orders', { params: filters });
    return response.data.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await api.get(`/api/orders/${id}`);
    return response.data.data;
  },

  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<Order> {
    const response = await api.put(`/api/orders/${id}/status`, { status });
    return response.data.data;
  },

  // ============ Payment Management ============

  async getPayments(filters?: PaymentFilters): Promise<PaymentListResponse> {
    const response = await api.get('/api/admin/payments', { params: filters });
    return response.data.data || response.data;
  },

  async getPaymentById(id: number): Promise<Payment> {
    const response = await api.get(`/api/payments/detail/${id}`);
    return response.data.data;
  },

  async updatePaymentStatus(
    id: number,
    status: string,
    transaction_id?: string
  ): Promise<Payment> {
    const response = await api.put(`/api/payments/${id}/status`, {
      status,
      transaction_id,
    });
    return response.data.data;
  },

  async refundPayment(id: number, reason: string): Promise<Payment> {
    const response = await api.post(`/api/payments/${id}/refund`, { reason });
    return response.data.data;
  },

  async getPaymentStats(
    start_date?: string,
    end_date?: string
  ): Promise<any> {
    const response = await api.get('/api/payments/stats', {
      params: { start_date, end_date },
    });
    return response.data.data;
  },

  // ============ Category Management ============

  async getCategories(): Promise<CategoryListResponse> {
    const response = await api.get('/api/categories');
    // Handle both response.data.data and response.data
    if (response.data.data) {
      return response.data.data;
    }
    // If API returns array directly
    if (Array.isArray(response.data)) {
      return { categories: response.data };
    }
    return response.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get(`/api/categories/${id}`);
    return response.data.data || response.data;
  },

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post('/api/categories', data);
    return response.data.data || response.data;
  },

  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data.data || response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/api/categories/${id}`);
  },

  // ============ Review Management ============

  async getReviews(filters: ReviewFilters = {}): Promise<ReviewListResponse> {
    const response = await api.get('/api/reviews', { params: filters });
    return response.data.data || response.data;
  },

  async getReviewById(id: number): Promise<Review> {
    const response = await api.get(`/api/reviews/${id}`);
    return response.data.data || response.data;
  },

  async deleteReview(id: number): Promise<void> {
    await api.delete(`/api/reviews/${id}`);
  },
};

export default adminService;
