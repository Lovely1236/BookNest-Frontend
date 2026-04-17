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
      verified:true,
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

  getUserReviews: async (): Promise<Review[]> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    const { data } = await apiClient.get(`/review/reviews/user/${user.userId}`);
    return data;
  },

  canUserReview: async (bookId: number): Promise<boolean> => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('User not authenticated');
    try {
      // Check if user has already reviewed this book
      const userReviews = await reviewService.getUserReviews();
      return !userReviews.some(r => r.bookId === bookId);
    } catch {
      return true; // Allow review if we can't fetch user reviews
    }
  },

  getAllReviews: async (): Promise<Review[]> => {
    const { data } = await apiClient.get('/review/reviews');
    return data;
  },

  getAverageRating: async (bookId: number): Promise<number> => {
    const { data } = await apiClient.get(`/review/reviews/avg/${bookId}`);
    return data;
  },
};
