import api from './api';
import type { Order, OrderStatus } from '../types/order.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface OrdersListResponse<T> {
  orders: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_orders: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
}

interface OrderResponse {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItemResponse[];
}

const transformOrderResponse = (orderResponse: OrderResponse): Order => {
  return {
    id: orderResponse.id,
    orderNumber: `UN${orderResponse.id.toString().padStart(5, '0')}`,
    orderDate: orderResponse.created_at,
    status: orderResponse.status as OrderStatus,
    items: orderResponse.items.map((item) => ({
      productId: item.product_id,
      name: item.product?.name || '',
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: orderResponse.total_amount,
    shipping_address: orderResponse.shipping_address,
    payment_method: orderResponse.payment_method,
    notes: orderResponse.notes,
  };
};

export const orderService = {
  /**
   * Get user's orders
   * GET /api/orders
   */
  async getOrders(page = 1, limit = 20): Promise<Order[]> {
    try {
      const response = await api.get<ApiResponse<OrdersListResponse<OrderResponse>>>(
        '/api/orders',
        { params: { page, limit } }
      );
      return response.data.data.orders.map(transformOrderResponse);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể tải danh sách đơn hàng';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await api.get<ApiResponse<OrderResponse>>(`/api/orders/${id}`);
      return transformOrderResponse(response.data.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không tìm thấy đơn hàng';
      throw new Error(errorMessage);
    }
  },

  /**
   * Cancel order
   * PUT /api/orders/:id/cancel
   */
  async cancelOrder(id: number): Promise<Order> {
    try {
      const response = await api.delete<ApiResponse<OrderResponse>>(`/api/orders/${id}`);
      return transformOrderResponse(response.data.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể hủy đơn hàng';
      throw new Error(errorMessage);
    }
  },

  /**
   * Create new order from cart
   * POST /api/orders
   */
  async createOrder(): Promise<Order> {
    try {
      const response = await api.post<ApiResponse<OrderResponse>>('/api/orders');
      return transformOrderResponse(response.data.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể tạo đơn hàng';
      throw new Error(errorMessage);
    }
  },
};

