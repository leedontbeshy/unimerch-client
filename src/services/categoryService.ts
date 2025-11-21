import type { Category } from '../types/category.types';
import type { Product } from '../types/product.types';
import api from './api';
import productService from './productService';

const categories: Category[] = [
  {
    id: 1,
    name: 'Áo Thun & Hoodie',
    slug: 'tops',
    description: 'BST áo thun, hoodie, sweater trendy cho sinh viên.',
    featuredImage:
      'https://images.unsplash.com/photo-1542131596-53742104d811?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Áo Khoác & Varsity',
    slug: 'outerwear',
    description: 'Áo khoác varsity, denim jacket, bomber cá tính.',
    featuredImage:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Phụ Kiện & Túi',
    slug: 'accessories',
    description: 'Túi canvas, nón lưỡi trai, phụ kiện daily đi học.',
    featuredImage:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
  }
];

const categoryProductMap: Record<string, number[]> = {
  tops: [1, 2],
  outerwear: [3],
  accessories: [4]
};

const mockApi = async <T>(data: T, delay = 220): Promise<T> => {
  const response = await api.get<T>('/mock/categories', {
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

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return mockApi(categories);
  },

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const data = await this.getCategories();
    return data.find((category) => category.slug === slug);
  },

  async getProductsByCategorySlug(slug: string): Promise<Product[]> {
    const ids = categoryProductMap[slug] ?? [];
    const response = await productService.getProducts();
    return response.data.products.filter((product: any) => ids.includes(product.id));
  }
};

export type { Category };


