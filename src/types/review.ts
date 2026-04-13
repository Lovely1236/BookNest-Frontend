export interface Review {
  reviewId: number;
  bookId: number;
  userId: number;
  userFullName?: string;
  rating: number;
  comment: string;
  reviewDate: string;
  verified: boolean;
}

export interface CreateReviewPayload {
  bookId: number;
  rating: number;
  comment: string;
}
