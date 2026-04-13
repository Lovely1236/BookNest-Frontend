import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}) => {
  const [hovered, setHovered] = React.useState(0);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) onChange(value);
  };

  const displayRating = interactive && hovered ? hovered : rating;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const value = i + 1;
        const filled = displayRating >= value;
        const halfFilled = !filled && displayRating >= value - 0.5;

        return (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              filled
                ? 'text-yellow-400 fill-yellow-400'
                : halfFilled
                ? 'text-yellow-400 fill-yellow-200'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onMouseEnter={() => interactive && setHovered(value)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => handleClick(value)}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
