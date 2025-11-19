// Admin Types & Interfaces

// Dashboard Overview
export interface DashboardOverview {
  total_users: number;
  total_sellers: number;
  total_admins: number;
  total_products: number;
  available_products: number;
  total_categories: number;
  total_orders: number;
  completed_orders: number;
  total_reviews: number;
  total_revenue: string;
  successful_payments: number;
  conversion_rate: number;
  average_order_value: string;
  payment_success_rate: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  calculated_at: string;
}

// Recent Activity
export interface RecentActivity {
  activity_type: 'user_registered' | 'order_created' | 'product_created' | 'payment_completed';
  title: string;
  description: string;
  timestamp: string;
  entity_id: number;
  time_ago: string;
}

export interface RecentActivityResponse {
  activities: RecentActivity[];
  total: number;
  fetched_at: string;
}

// Revenue Data
export interface RevenueData {
  period: string;
  total_orders: number;
  completed_orders: number;
  revenue: string;
  avg_order_value: string;
}

export interface RevenueSummary {
  total_revenue: string;
  total_orders: number;
  completed_orders: number;
  avg_order_value: string;
  conversion_rate: number;
  periods_count: number;
}

export interface RevenueAnalytics {
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
  data: RevenueData[];
  summary: RevenueSummary;
  generated_at: string;
}

// Payment Methods
export interface PaymentMethodStat {
  payment_method: string;
  transaction_count: number;
  successful_count: number;
  failed_count: number;
  total_amount: string;
  avg_amount: string;
  success_rate: number;
  percentage_of_revenue: string;
  percentage_of_transactions: string;
}

export interface PaymentMethodAnalytics {
  payment_methods: PaymentMethodStat[];
  summary: {
    total_amount: string;
    total_transactions: number;
    overall_success_rate: string;
  };
  generated_at: string;
}

// Product Analytics
export interface TopProduct {
  id: number;
  name: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  category_name: string;
  seller_name: string;
  total_sold: number;
  total_revenue: string;
  order_count: number;
  avg_revenue_per_order: string;
}

export interface CategoryAnalysis {
  id: number;
  name: string;
  description: string;
  product_count: number;
  available_products: number;
  total_sold: number;
  total_revenue: string;
  avg_rating: number;
  review_count: number;
  avg_revenue_per_product: string;
  revenue_percentage: string;
}

export interface ProductAnalytics {
  top_products: TopProduct[];
  category_analysis: CategoryAnalysis[];
  summary: {
    total_categories: number;
    total_revenue_all_categories: string;
    best_performing_category: string;
    avg_products_per_category: string;
  };
  generated_at: string;
}

// Seller Analytics
export interface TopSeller {
  id: number;
  username: string;
  full_name: string;
  email: string;
  created_at: string;
  product_count: number;
  active_products: number;
  total_sold: number;
  total_revenue: string;
  order_count: number;
  avg_rating: number;
  review_count: number;
  avg_revenue_per_product: string;
  avg_revenue_per_order: string;
  product_activity_rate: string;
}

export interface SellerAnalytics {
  top_sellers: TopSeller[];
  summary: {
    total_sellers_analyzed: number;
    total_revenue_all_sellers: string;
    total_products_all_sellers: number;
    avg_revenue_per_seller: string;
    avg_products_per_seller: string;
    best_seller: string;
  };
  generated_at: string;
}

// Order Analytics
export interface OrderStatusStat {
  status: string;
  count: number;
  total_amount: string;
  avg_amount: string;
  percentage_of_orders: string;
  percentage_of_revenue: string;
  status_label: string;
}

export interface OrderAnalytics {
  order_status_breakdown: OrderStatusStat[];
  conversion_funnel: {
    pending_to_processing: string;
    processing_to_shipped: string;
    shipped_to_delivered: string;
    overall_completion: string;
    cancellation_rate: string;
  };
  summary: {
    total_orders: number;
    total_revenue: string;
    avg_order_value: string;
    completion_rate: string;
  };
  generated_at: string;
}

// User Growth
export interface UserGrowthData {
  period: string;
  new_users: number;
  new_sellers: number;
}

export interface UserGrowthAnalytics {
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
  growth_data: UserGrowthData[];
  summary: {
    total_new_users: number;
    total_new_sellers: number;
    avg_new_users_per_period: string;
    peak_registration_period: {
      period: string;
      new_users: number;
      new_sellers: number;
    };
  };
  generated_at: string;
}

// User Management
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  studentId?: string;
  phone?: string;
  address?: string;
  role: 'user' | 'seller' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
  };
}

// Product Management
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  quantity: number;
  image_url: string;
  status: 'available' | 'out_of_stock' | 'discontinued';
  category_id: number;
  category_name?: string;
  seller_id: number;
  seller_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Order Management
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
  items_count?: number;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_orders: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Payment Management
export interface Payment {
  id: number;
  order_id: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  amount: string;
  user_id?: number;
  order_total?: string;
  created_at: string;
  updated_at?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_payments: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Filter & Query Types
export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category_id?: number;
  status?: string;
  search?: string;
  seller_id?: number;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  user_id?: number;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
}

// Category Management
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryListResponse {
  categories: Category[];
  total?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

// Review Management
export interface Review {
  id: number;
  product_id: number;
  product_name: string;
  user_id: number;
  username: string;
  user_full_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewListResponse {
  reviews: Review[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_reviews: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  product_id?: number;
  user_id?: number;
  rating?: number;
}
