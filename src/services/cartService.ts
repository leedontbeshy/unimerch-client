import api from './api';
import type { Cart, CartItem } from '../types/cart.types';
import type { Product } from '../types/product.types';

const CART_BASE_PATH = '/api/cart';

interface CartItemResponse {
  id?: number;
  product_id: number;
  quantity: number;
  product?: Product;
  name?: string;
  price?: number;
  image?: string;
  image_url?: string;
}

interface CartApiData {
  items?: CartItemResponse[];
  total_price?: number;
  total?: number;
}

interface CartApiEnvelope {
  success?: boolean;
  message?: string;
  data: CartApiData;
}

type CartApiResponse = CartApiData | CartApiEnvelope;

const toProduct = (item: CartItemResponse): Product => {
  if (item.product) {
    return {
      ...item.product,
      image: item.product.image ?? item.product.image_url ?? ''
    };
  }

  return {
    id: item.product_id,
    name: item.name ?? 'Sản phẩm',
    price: item.price ?? 0,
    image: item.image ?? item.image_url ?? ''
  };
};

const toCartItem = (item: CartItemResponse): CartItem => ({
  product: toProduct(item),
  quantity: item.quantity
});

const calculateTotal = (items: CartItem[]): number =>
  items.reduce((sum, cartItem) => sum + cartItem.product.price * cartItem.quantity, 0);

const extractCartPayload = (payload: CartApiResponse): CartApiData =>
  'data' in payload ? payload.data ?? {} : payload ?? {};

const mapToCart = (payload: CartApiResponse): Cart => {
  const data = extractCartPayload(payload);
  const items = (data.items ?? []).map(toCartItem);
  const totalPrice = data.total_price ?? data.total ?? calculateTotal(items);

  return {
    items,
    totalPrice
  };
};

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<CartApiResponse>(CART_BASE_PATH);
    return mapToCart(response.data);
  },

  async addToCart(productId: number, quantity: number): Promise<Cart> {
    const response = await api.post<CartApiResponse>(`${CART_BASE_PATH}/items`, {
      product_id: productId,
      quantity
    });
    return mapToCart(response.data);
  },

  async updateCartItemQuantity(productId: number, quantity: number): Promise<Cart> {
    const response = await api.patch<CartApiResponse>(`${CART_BASE_PATH}/items/${productId}`, {
      quantity
    });
    return mapToCart(response.data);
  },

  async removeFromCart(productId: number): Promise<Cart> {
    const response = await api.delete<CartApiResponse>(`${CART_BASE_PATH}/items/${productId}`);
    return mapToCart(response.data);
  },

  async clearCart(): Promise<Cart> {
    const response = await api.delete<CartApiResponse>(CART_BASE_PATH);
    return mapToCart(response.data);
  }
};


