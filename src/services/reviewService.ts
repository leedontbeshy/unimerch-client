import api from './api';
import type { Review, ReviewListResponse, ReviewFilters } from '../types/admin.types';

class ReviewService {
  /**
   * Get reviews for a specific product
   */
  async getProductReviews(productId: number, filters: Omit<ReviewFilters, 'product_id'> = {}): Promise<ReviewListResponse> {
    const response = await api.get('/api/reviews', { 
      params: { ...filters, product_id: productId } 
    });
    return response.data.data;
  }

  /**
   * Get review by ID
   */
  async getReviewById(id: number): Promise<Review> {
    const response = await api.get(`/api/reviews/${id}`);
    return response.data.data;
  }

  /**
   * Create a new review (requires authentication)
   */
  async createReview(productId: number, rating: number, comment: string): Promise<Review> {
    const response = await api.post('/api/reviews', {
      product_id: productId,
      rating,
      comment
    });
    return response.data.data;
  }

  /**
   * Update a review (requires authentication and ownership)
   */
  async updateReview(reviewId: number, rating: number, comment: string): Promise<Review> {
    const response = await api.put(`/api/reviews/${reviewId}`, {
      rating,
      comment
    });
    return response.data.data;
  }

  /**
   * Delete a review (requires authentication and ownership)
   */
  async deleteReview(reviewId: number): Promise<void> {
    await api.delete(`/api/reviews/${reviewId}`);
  }
}

export default new ReviewService();
