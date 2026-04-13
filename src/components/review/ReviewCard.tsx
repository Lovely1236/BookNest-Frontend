import React from 'react';
import { User, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { Review } from '../../types/review';
import { RatingStars } from '../book/RatingStars';
import { formatDate } from '../../utils/formatters';
import { useAuthStore } from '../../stores/authStore';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  const isAuthor = user?.userId === review.userId;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900 text-sm">{review.userFullName || `User #${review.userId}`}</p>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" /> Verified Purchase
                </span>
              )}
            </div>
            <RatingStars rating={review.rating} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">{formatDate(review.reviewDate)}</p>
          {isAuthor && (
            <div className="flex gap-1">
              {onEdit && (
                <button onClick={() => onEdit(review)} className="p-1 text-gray-400 hover:text-blue-600 rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(review.reviewId)} className="p-1 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
