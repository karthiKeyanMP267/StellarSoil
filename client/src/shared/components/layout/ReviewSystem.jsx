import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const ReviewSystem = ({ productId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ productId, rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1"
            >
              {star <= rating ? (
                <StarIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <StarOutline className="h-6 w-6 text-yellow-400" />
              )}
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows="3"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          disabled={!rating || !comment}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewSystem;
