'use client';

import React, { useState, useEffect } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = 'medium',
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleMouseEnter = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      setCurrentRating(starIndex);
      onRatingChange(starIndex);
    }
  };

  const getStarSize = () => {
    switch (size) {
      case 'small': return 'w-4 h-4';
      case 'large': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = hoverRating >= starValue || (hoverRating === 0 && currentRating >= starValue);
    
    return (
      <svg
        key={index}
        className={`${getStarSize()} cursor-pointer transition-colors duration-200 ${
          readonly ? 'cursor-default' : ''
        } ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(starValue)}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, index) => renderStar(index))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {currentRating > 0 ? `${currentRating}/5` : 'Sin valorar'}
        </span>
      )}
    </div>
  );
};

export default StarRating; 