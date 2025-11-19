import type { Product } from '../types/product.types';
import api from './api';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Áo thun UniMerch Classic',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Áo hoodie Phi Hành Gia',
    price: 389000,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Áo khoác Varsity Xanh Mint',
    price: 459000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Túi vải Canvas Logo',
    price: 149000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
  }
];

const mockApiGet = async <T>(data: T, delay = 250): Promise<T> => {
  const response = await api.get<T>('/mock/products', {
    adapter: async (config) => {
      await new Promise((resolve) => setTimeout(resolve, delay));
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

  return response.data;
};

export const productService = {
  getMockProducts: async (): Promise<Product[]> => {
    return mockApiGet(mockProducts);
  }
};

export type { Product };


