import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/api/reviewService';
import { reviewSchema, ReviewFormData } from '../../utils/validation';
import { RatingStars } from '../book/RatingStars';
import { Review } from '../../types/review';

interface ReviewFormProps {
  bookId: number;
  existingReview?: Review;
  onDone?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, existingReview, onDone }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
    },
  });

  const rating = watch('rating');

  const submitMutation = useMutation({
    mutationFn: (data: ReviewFormData) => {
      if (existingReview) {
        return reviewService.updateReview(existingReview.reviewId, data);
      }
      return reviewService.createReview({ bookId, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
      toast.success(existingReview ? 'Review updated!' : 'Review submitted!');
      onDone?.();
    },
    onError: () => toast.error('Failed to submit review'),
  });

  const onSubmit = (data: ReviewFormData) => submitMutation.mutate(data);
  const comment = watch('comment');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">
        {existingReview ? 'Edit Review' : 'Write a Review'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <RatingStars
          rating={rating}
          interactive
          onChange={(val) => setValue('rating', val)}
          size="lg"
        />
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
        <textarea
          {...register('comment')}
          rows={4}
          placeholder="Share your thoughts about this book..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex justify-between mt-1">
          {errors.comment && <p className="text-xs text-red-500">{errors.comment.message}</p>}
          <span className="text-xs text-gray-400 ml-auto">{(comment || '').length}/500</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitMutation.isPending}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          {submitMutation.isPending ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
