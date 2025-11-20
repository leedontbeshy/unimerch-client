import api from './api';
import type { Cart } from '../types/cart.types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CartItemResponse {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product_name: string;
  product_price: number;
  product_discount_price: number | null;
  product_image: string | null;
  product_status: string;
  available_quantity: number;
  subtotal: number;
}

interface CartSummaryResponse {
  total_items: number;
  total_amount: number;
  item_count: number;
}

interface CartApiResponse {
  items: CartItemResponse[];
  summary: CartSummaryResponse;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';

const transformCartResponse = (cartData: CartApiResponse): Cart => {
  const cartItems = cartData.items.map((item) => ({
    product: {
      id: item.product_id,
      name: item.product_name,
      price: item.product_discount_price ?? item.product_price,
      image: item.product_image || DEFAULT_IMAGE,
    },
    quantity: item.quantity,
  }));

  const totalPrice = cartData.summary?.total_amount ?? cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    items: cartItems,
    totalPrice,
  };
};

const getCartData = async (): Promise<CartApiResponse> => {
  const response = await api.get<ApiResponse<CartApiResponse>>('/api/cart');
  const data = response.data.data;

  if (!data || !Array.isArray(data.items)) {
    return {
      items: [],
      summary: { total_amount: 0, total_items: 0, item_count: 0 },
    };
  }

  return {
    items: data.items,
    summary: data.summary || { total_amount: 0, total_items: 0, item_count: data.items.length },
  };
};

export const cartService = {
  /**
   * Get cart items
   * GET /api/cart
   */
  async getCart(): Promise<Cart> {
    try {
      const cartData = await getCartData();
      return transformCartResponse(cartData);
    } catch (error: any) {
      console.error('Get cart error:', error);
      
      // If error is 404 or cart is empty, return empty cart
      if (error.response?.status === 404) {
        return { items: [], totalPrice: 0 };
      }
      
      // If unauthorized, let it throw to be handled by interceptor
      if (error.response?.status === 401) {
        throw error;
      }
      
      // For other errors, return empty cart instead of throwing
      console.warn('Cart error, returning empty cart:', error.response?.data?.message);
      return { items: [], totalPrice: 0 };
    }
  },

  /**
   * Add product to cart
   * POST /api/cart/add
   */
  async addToCart(productId: number, quantity: number): Promise<Cart> {
    try {
      console.log('Adding to cart:', { product_id: productId, quantity });
      const response = await api.post<ApiResponse<CartItemResponse>>('/api/cart/add', {
        product_id: productId,
        quantity,
      });
      console.log('Add to cart response:', response.data);
      
      // Fetch updated cart
      const updatedCart = await this.getCart();
      console.log('Updated cart:', updatedCart);
      return updatedCart;
    } catch (error: any) {
      console.error('Add to cart error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      throw new Error(errorMessage);
    }
  },

  /**
   * Update cart item quantity
   * PUT /api/cart/update/:id
   */
  async updateCartItemQuantity(productId: number, quantity: number): Promise<Cart> {
    try {
      const cartData = await getCartData();
      const apiCartItem = cartData.items.find((item) => item.product_id === productId);

      if (!apiCartItem) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      if (quantity <= 0) {
        return await this.removeFromCart(productId);
      }

      await api.put<ApiResponse<CartItemResponse>>(`/api/cart/update/${apiCartItem.id}`, {
        quantity,
      });

      // Fetch updated cart
      return await this.getCart();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật giỏ hàng';
      throw new Error(errorMessage);
    }
  },

  /**
   * Remove item from cart
   * DELETE /api/cart/remove/:id
   */
  async removeFromCart(productId: number): Promise<Cart> {
    try {
      const cartData = await getCartData();
      const apiCartItem = cartData.items.find((item) => item.product_id === productId);
      
      if (!apiCartItem) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      await api.delete<ApiResponse<null>>(`/api/cart/remove/${apiCartItem.id}`);

      // Fetch updated cart
      return await this.getCart();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể xóa sản phẩm';
      throw new Error(errorMessage);
    }
  },

  /**
   * Clear all cart items
   * DELETE /api/cart/clear
   */
  async clearCart(): Promise<Cart> {
    try {
      await api.delete<ApiResponse<null>>('/api/cart/clear');
      return { items: [], totalPrice: 0 };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể xóa giỏ hàng';
      throw new Error(errorMessage);
    }
  },
};


