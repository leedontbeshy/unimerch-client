import api from './api';
import type { CreateOrderRequest, PaymentMethod, Payment } from '../types/payment.types';
import type { Order } from '../types/order.types';
import { cartService } from './cartService';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface OrderResponse {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

const ORDER_PAYMENT_METHOD_MAP: Record<PaymentMethod, 'COD' | 'Banking' | 'Credit Card' | 'E-Wallet'> = {
  cod: 'COD',
  bank_transfer: 'Banking',
  credit_card: 'Credit Card',
  debit_card: 'Credit Card',
  momo: 'E-Wallet',
  zalopay: 'E-Wallet',
  vnpay: 'E-Wallet',
  paypal: 'E-Wallet',
  stripe: 'E-Wallet',
};

export const paymentService = {
  /**
   * Create an order with payment information
   * POST /api/orders
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      const normalizedPaymentMethod = ORDER_PAYMENT_METHOD_MAP[orderData.payment_method] ?? 'COD';
      const orderPayload: Omit<CreateOrderRequest, 'payment_method'> & { payment_method: string } = {
        ...orderData,
        shipping_address: orderData.shipping_address.trim(),
        payment_method: normalizedPaymentMethod,
      };

      const response = await api.post<ApiResponse<OrderResponse>>(
        '/api/orders',
        orderPayload
      );

      const orderResponse = response.data.data;

      // Transform API response to frontend Order type
      const order: Order = {
        id: orderResponse.id,
        orderNumber: `UN${orderResponse.id.toString().padStart(5, '0')}`,
        orderDate: orderResponse.created_at,
        status: orderResponse.status as any,
        items: orderResponse.items.map((item) => ({
          productId: item.product_id,
          name: '', // Will be populated from product details if needed
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: orderResponse.total_amount,
      };

      // Clear cart after successful order (if order was created from cart)
      if (orderData.from_cart) {
        await cartService.clearCart();
      }

      return order;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể tạo đơn hàng';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get available payment methods
   */
  getPaymentMethods: async (): Promise<Array<{
    id: PaymentMethod;
    name: string;
    description: string;
    icon: string;
  }>> => {
    return [
      {
        id: 'cod' as PaymentMethod,
        name: 'Thanh toán khi nhận hàng (COD)',
        description: 'Thanh toán bằng tiền mặt khi nhận hàng',
        icon: '💵',
      },
      {
        id: 'momo' as PaymentMethod,
        name: 'Ví MoMo',
        description: 'Thanh toán qua ví điện tử MoMo',
        icon: '🟣',
      },
      {
        id: 'zalopay' as PaymentMethod,
        name: 'ZaloPay',
        description: 'Thanh toán qua ví ZaloPay',
        icon: '🔵',
      },
      {
        id: 'vnpay' as PaymentMethod,
        name: 'VNPay',
        description: 'Thanh toán qua cổng VNPay',
        icon: '🔴',
      },
      {
        id: 'bank_transfer' as PaymentMethod,
        name: 'Chuyển khoản ngân hàng',
        description: 'Chuyển khoản trực tiếp qua ngân hàng',
        icon: '🏦',
      },
      {
        id: 'credit_card' as PaymentMethod,
        name: 'Thẻ tín dụng',
        description: 'Thanh toán bằng thẻ tín dụng Visa/Mastercard',
        icon: '💳',
      },
      {
        id: 'debit_card' as PaymentMethod,
        name: 'Thẻ ghi nợ',
        description: 'Thanh toán bằng thẻ ghi nợ nội địa',
        icon: '💳',
      },
    ];
  },

  /**
   * Create payment record for an order
   */
  createPaymentRecord: async (
    orderId: number,
    paymentMethod: PaymentMethod,
    transactionId?: string
  ): Promise<Payment> => {
    try {
      const response = await api.post<ApiResponse<Payment>>('/api/payments', {
        order_id: orderId,
        payment_method: paymentMethod,
        transaction_id: transactionId?.trim() || undefined,
      });

      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể lưu thông tin thanh toán';
      throw new Error(errorMessage);
    }
  },
};
