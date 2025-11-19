export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: number;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
}


