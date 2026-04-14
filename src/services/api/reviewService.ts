import apiClient from '../axios';
import { useAuthStore } from '../../stores/authStore';
import { Review, CreateReviewPayload } from '../../types/review';

export const reviewService = {
  getBookReviews: async (bookId: number): Promise<Review[]> => {
    const { data } = await apiClient.get(`/review/reviews/book/${bookId}`);
    return data;
  },

  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.post('/review/reviews', {
      ...payload,
      userId: user.userId,
    });
    return data;
  },

  updateReview: async (reviewId: number, payload: Partial<CreateReviewPayload>): Promise<Review> => {
    const { data } = await apiClient.put(`/review/reviews/${reviewId}`, payload);
    return data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await apiClient.delete(`/review/reviews/${reviewId}`);
  },

  canUserReview: async (bookId: number): Promise<boolean> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    try {
      const { data } = await apiClient.get(`/review/reviews/can-review/${bookId}`, {
        params: { userId: user.userId },
      });
      return data.canReview;
    } catch {
      return false;
    }
  },

  getAllReviews: async (): Promise<Review[]> => {
    const { data } = await apiClient.get('/review/reviews');
    return data;
  },
};
