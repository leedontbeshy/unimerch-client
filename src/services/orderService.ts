import type { AxiosResponse } from 'axios';
import api from './api';
import type { CartItem as OrderItem, Order } from '../types/order.types';
import { cartService } from './cartService';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const withAdapter = <T>(data: T, ms = 350) => ({
  adapter: async (config: any): Promise<AxiosResponse<T>> => {
    await delay(ms);
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

const mockOrders: Order[] = [
  {
    id: 101,
    orderNumber: 'UN24001',
    orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'Processing',
    items: [
      { productId: 1, name: 'Áo thun UniMerch Classic', price: 199000, quantity: 1 },
      { productId: 4, name: 'Túi vải Canvas Logo', price: 149000, quantity: 1 }
    ],
    totalAmount: 348000
  },
  {
    id: 102,
    orderNumber: 'UN24002',
    orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'Delivered',
    items: [{ productId: 3, name: 'Áo khoác Varsity Xanh Mint', price: 459000, quantity: 1 }],
    totalAmount: 459000
  }
];

let orders: Order[] = [...mockOrders];
let lastOrderId = orders.reduce((max, order) => Math.max(max, order.id), 1000);

const mapCartItemsToOrderItems = (cartItems: { product: { id: number; name: string; price: number }; quantity: number }[]): OrderItem[] =>
  cartItems.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity
  }));

const calculateTotal = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/mock/orders', withAdapter([...orders]));
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const order = orders.find((item) => item.id === id);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    const response = await api.get<Order>(`/mock/orders/${id}`, withAdapter(order));
    return response.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const order = orders.find((item) => item.id === id);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    if (order.status !== 'Pending') {
      throw new Error('Chỉ có thể hủy đơn hàng đang chờ xử lý');
    }
    order.status = 'Cancelled';
    const response = await api.post<Order>(`/mock/orders/${id}/cancel`, {}, withAdapter(order));
    return response.data;
  },

  async createOrder(): Promise<Order> {
    const cart = await cartService.getCart();

    if (cart.items.length === 0) {
      throw new Error('Giỏ hàng của bạn đang trống');
    }

    const orderItems = mapCartItemsToOrderItems(cart.items);
    const newOrder: Order = {
      id: ++lastOrderId,
      orderNumber: `UN${lastOrderId}`,
      items: orderItems,
      totalAmount: calculateTotal(orderItems),
      status: 'Pending',
      orderDate: new Date().toISOString()
    };

    orders = [newOrder, ...orders];
    await cartService.clearCart();

    const response = await api.post<Order>('/mock/orders', newOrder, withAdapter(newOrder));
    return response.data;
  }
};

