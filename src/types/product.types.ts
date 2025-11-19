export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  quantity: number;
  image_url: string;
  status: 'available' | 'out_of_stock' | 'discontinued';
  category_id: number;
  category_name?: string;
  seller_id: number;
  seller_name?: string;
  seller_full_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category_id?: number;
  status?: 'available' | 'out_of_stock' | 'discontinued';
  search?: string;
  min_price?: number;
  max_price?: number;
  seller_id?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}
