import api from './api';
import type { Order } from '../types/order.types';
import { cartService } from './cartService';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get(`/api/orders`);
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data.orders)) return response.data.orders;
    if (Array.isArray(response.data.data)) return response.data.data;
    if (Array.isArray(response.data.data?.orders)) return response.data.data.orders;
    return [];
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await api.get<{ data: Order }>(`/api/orders/${id}`);
    return response.data.data ?? response.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const response = await api.patch<{ data: Order }>(`/api/orders/${id}/cancel`);
    return response.data.data ?? response.data;
  },

  async createOrder(): Promise<Order> {
    const cart = await cartService.getCart();
    if (cart.items.length === 0) {
      throw new Error('Giỏ hàng của bạn đang trống');
    }
    const payload = {
      items: cart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    };
    const response = await api.post<{ data: Order }>(`/api/orders`, payload);
    await cartService.clearCart();
    return response.data.data ?? response.data;
  }
};

