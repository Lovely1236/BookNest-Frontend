import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/api/reviewService';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { Review } from '../../types/review';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { MessageSquarePlus } from 'lucide-react';

interface ReviewListProps {
  bookId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ bookId }) => {
  const { isAuthenticated } = useAuthStore();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', bookId],
    queryFn: () => reviewService.getBookReviews(bookId),
  });

  const { data: canReview } = useQuery({
    queryKey: ['can-review', bookId],
    queryFn: () => reviewService.canUserReview(bookId),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      toast.success('Review deleted');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Reviews ({reviews?.length || 0})
        </h3>
        {isAuthenticated && canReview && !showForm && !editingReview && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write Review
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          bookId={bookId}
          onDone={() => setShowForm(false)}
        />
      )}

      {editingReview && (
        <ReviewForm
          bookId={bookId}
          existingReview={editingReview}
          onDone={() => setEditingReview(null)}
        />
      )}

      {reviews?.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {reviews?.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              onEdit={setEditingReview}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
