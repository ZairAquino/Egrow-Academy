'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface RecommendationItem {
  id: string;
  type: 'course' | 'resource' | 'event';
  title: string;
  description: string;
  image?: string;
  score: number;
  reason: string;
  url: string;
}

interface RecommendationsSectionProps {
  title?: string;
  limit?: number;
  showReason?: boolean;
  className?: string;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  title = 'Recomendado para ti',
  limit = 6,
  showReason = true,
  className = '',
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/recommendations?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar recomendaciones');
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('No se pudieron cargar las recomendaciones');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?.id, limit]);

  const trackRecommendationClick = async (recommendation: RecommendationItem) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'click_recommendation',
          targetId: recommendation.id,
          targetType: recommendation.type,
          metadata: {
            score: recommendation.score,
            reason: recommendation.reason,
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      case 'resource': return '📖';
      case 'event': return '🎯';
      default: return '📋';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (!user) {
    return null; // No mostrar recomendaciones para usuarios no autenticados
  }

  if (isLoading) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container">
          <div className="text-center text-gray-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <Link
                href={recommendation.url}
                onClick={() => trackRecommendationClick(recommendation)}
                className="block"
              >
                <div className="relative h-48 bg-gray-100">
                  {recommendation.image ? (
                    <Image
                      src={recommendation.image}
                      alt={recommendation.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">
                      {getTypeIcon(recommendation.type)}
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(recommendation.score)} bg-white/90`}>
                      {Math.round(recommendation.score * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">
                      {getTypeIcon(recommendation.type)}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {recommendation.type === 'course' ? 'Curso' : 
                       recommendation.type === 'resource' ? 'Recurso' : 'Evento'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {recommendation.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {recommendation.description}
                  </p>

                  {showReason && (
                    <p className="text-xs text-blue-600 font-medium">
                      {recommendation.reason}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 