import apiClient from '../axios';
import { Review, CreateReviewPayload } from '../../types/review';

export const reviewService = {
  getBookReviews: async (bookId: number): Promise<Review[]> => {
    const { data } = await apiClient.get(`/reviews/book/${bookId}`);
    return data;
  },

  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const { data } = await apiClient.post('/reviews', payload);
    return data;
  },

  updateReview: async (reviewId: number, payload: Partial<CreateReviewPayload>): Promise<Review> => {
    const { data } = await apiClient.put(`/reviews/${reviewId}`, payload);
    return data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  canUserReview: async (bookId: number): Promise<boolean> => {
    const { data } = await apiClient.get(`/reviews/can-review/${bookId}`);
    return data.canReview;
  },

  getAllReviews: async (): Promise<Review[]> => {
    const { data } = await apiClient.get('/reviews');
    return data;
  },
};
