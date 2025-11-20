export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  shipping_address?: string;
  payment_method?: string;
  notes?: string;
}


