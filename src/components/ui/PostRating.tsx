'use client';

import React, { useState } from 'react';
import StarRating from './StarRating';
import { useRating } from '@/hooks/useRating';
import { useAuth } from '@/contexts/AuthContext';

interface PostRatingProps {
  postId: string;
  showStats?: boolean;
}

const PostRating: React.FC<PostRatingProps> = ({ postId, showStats = true }) => {
  const { user } = useAuth();
  const { ratings, stats, loading, submitRating } = useRating('COMMUNITY_POST', undefined, postId);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleRatingSubmit = async (rating: number, comment: string) => {
    await submitRating(rating, comment);
  };

  const userRating = ratings.find(r => r.user.id === user?.id);

  return (
    <div className="post-rating-container">
      {showStats && stats && (
        <div className="rating-stats mb-3">
          <div className="flex items-center gap-2">
            <StarRating 
              rating={stats.averageRating} 
              readonly 
              size="small"
              showValue
            />
            <span className="text-sm text-gray-600">
              ({stats.totalRatings} valoraciones)
            </span>
          </div>
        </div>
      )}

      {user && (
        <div className="user-rating-section">
          {userRating ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tu valoración:</span>
              <StarRating 
                rating={userRating.rating} 
                readonly 
                size="small"
              />
              <button
                onClick={() => setShowRatingModal(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRatingModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Valorar este post
            </button>
          )}
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Valorar Post</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const rating = parseInt(formData.get('rating') as string);
              const comment = formData.get('comment') as string;
              
              if (rating > 0) {
                await handleRatingSubmit(rating, comment);
                setShowRatingModal(false);
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu valoración *
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={0}
                    onRatingChange={(rating) => {
                      const input = document.querySelector('input[name="rating"]') as HTMLInputElement;
                      if (input) input.value = rating.toString();
                    }}
                    size="large"
                    showValue
                  />
                </div>
                <input type="hidden" name="rating" value="0" />
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario (opcional)
                </label>
                <textarea
                  name="comment"
                  placeholder="Comparte tu opinión sobre este post..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enviar Valoración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostRating; 