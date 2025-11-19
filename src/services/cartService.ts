import type { AxiosResponse } from 'axios';
import api from './api';
import type { Cart } from '../types/cart.types';
import type { Product } from '../types/product.types';
import { productService } from './productService';

const INITIAL_CART: Cart = {
  items: [],
  totalPrice: 0
};

let cartState: Cart = { ...INITIAL_CART };

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApiRequest = async <T>(method: 'get' | 'post', data: T, ms = 250): Promise<T> => {
  const adapter = async (config: any): Promise<AxiosResponse<T>> => {
    await delay(ms);
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      request: {}
    };
  };

  const response =
    method === 'get'
      ? await api.get<T>('/mock/cart', { adapter })
      : await api.post<T>('/mock/cart', {}, { adapter });

  return response.data;
};

const cloneCart = (): Cart => ({
  items: cartState.items.map((item) => ({ ...item, product: { ...item.product } })),
  totalPrice: cartState.totalPrice
});

const recalculateTotal = () => {
  cartState.totalPrice = cartState.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
};

const seedCart = async () => {
  if (cartState.items.length === 0) {
    const products = await productService.getMockProducts();
    cartState.items = products.slice(0, 2).map((product, index) => ({
      product,
      quantity: index + 1
    }));
    recalculateTotal();
  }
};

const findProduct = async (productId: number): Promise<Product> => {
  const products = await productService.getMockProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }
  return product;
};

export const cartService = {
  async getCart(): Promise<Cart> {
    await seedCart();
    return mockApiRequest('get', cloneCart());
  },

  async addToCart(productId: number, quantity: number): Promise<Cart> {
    await seedCart();
    const product = await findProduct(productId);
    const existingItem = cartState.items.find((item) => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartState.items.push({ product, quantity });
    }

    recalculateTotal();
    return mockApiRequest('post', cloneCart());
  },

  async updateCartItemQuantity(productId: number, quantity: number): Promise<Cart> {
    await seedCart();
    const itemIndex = cartState.items.findIndex((item) => item.product.id === productId);

    if (itemIndex === -1) {
      throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    if (quantity <= 0) {
      cartState.items.splice(itemIndex, 1);
    } else {
      cartState.items[itemIndex].quantity = quantity;
    }

    recalculateTotal();
    return mockApiRequest('post', cloneCart());
  },

  async removeFromCart(productId: number): Promise<Cart> {
    await seedCart();
    cartState.items = cartState.items.filter((item) => item.product.id !== productId);
    recalculateTotal();
    return mockApiRequest('post', cloneCart());
  },

  async clearCart(): Promise<Cart> {
    cartState = { ...INITIAL_CART };
    return mockApiRequest('post', cloneCart());
  }
};


