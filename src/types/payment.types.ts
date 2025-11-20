export type PaymentMethod = 'cod' | 'credit_card' | 'debit_card' | 'momo' | 'zalopay' | 'vnpay' | 'bank_transfer' | 'paypal' | 'stripe';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  order_id: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id: string | null;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  shipping_address: string;
  phone: string;
  payment_method: PaymentMethod;
  notes?: string;
  from_cart: boolean;
  items?: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  shipping_address: string;
  notes?: string;
  payment_method: PaymentMethod;
}
