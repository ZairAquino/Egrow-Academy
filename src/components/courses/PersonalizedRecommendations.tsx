'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface RecommendedCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  rating: number;
  studentsCount: number;
  tags: string[];
  recommendationReason: string;
  matchScore: number;
}

interface RecommendationData {
  courses: RecommendedCourse[];
  reasons: {
    basedOnProgress: string[];
    basedOnInterests: string[];
    trending: string[];
  };
}

export default function PersonalizedRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/recommendations');
      
      if (!response.ok) {
        throw new Error('Error al cargar recomendaciones');
      }
      
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      // Fallback con datos mock para demo
      setRecommendations(getMockRecommendations());
    } finally {
      setLoading(false);
    }
  };

  const getMockRecommendations = (): RecommendationData => ({
    courses: [
      {
        id: '1',
        title: 'ChatGPT Avanzado: Prompts Profesionales',
        slug: 'chatgpt-avanzado-prompts',
        description: 'Domina el arte de crear prompts efectivos para ChatGPT y optimiza tu productividad',
        imageUrl: '/images/courses/chatgpt-advanced.jpg',
        category: 'Inteligencia Artificial',
        level: 'Intermedio',
        duration: '4 horas',
        price: 97,
        rating: 4.8,
        studentsCount: 1250,
        tags: ['ChatGPT', 'Prompts', 'Productividad'],
        recommendationReason: 'Basado en tu progreso en cursos de IA',
        matchScore: 95
      },
      {
        id: '2',
        title: 'Automatización de Negocios con IA',
        slug: 'automatizacion-negocios-ia',
        description: 'Implementa sistemas de IA para automatizar procesos empresariales',
        imageUrl: '/images/courses/business-automation.jpg',
        category: 'Emprendimiento',
        level: 'Avanzado',
        duration: '6 horas',
        price: 197,
        rating: 4.9,
        studentsCount: 850,
        tags: ['Automatización', 'Negocios', 'IA'],
        recommendationReason: 'Popular entre estudiantes como tú',
        matchScore: 88
      },
      {
        id: '3',
        title: 'Marketing Digital con IA: Estrategias 2024',
        slug: 'marketing-digital-ia',
        description: 'Revoluciona tu marketing con herramientas de IA y técnicas avanzadas',
        imageUrl: '/images/courses/ai-marketing.jpg',
        category: 'Marketing Digital',
        level: 'Intermedio',
        duration: '5 horas',
        price: 147,
        rating: 4.7,
        studentsCount: 2100,
        tags: ['Marketing', 'IA', 'Estrategias'],
        recommendationReason: 'Complementa tus habilidades actuales',
        matchScore: 82
      }
    ],
    reasons: {
      basedOnProgress: ['Cursos de IA completados', 'Interés en automatización'],
      basedOnInterests: ['Marketing Digital', 'Emprendimiento'],
      trending: ['ChatGPT', 'Automatización', 'Marketing con IA']
    }
  });

  const getRecommendationIcon = (reason: string) => {
    if (reason.includes('progreso')) return '📈';
    if (reason.includes('popular')) return '🔥';
    if (reason.includes('complementa')) return '🎯';
    return '⭐';
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#6b7280';
  };

  if (loading) {
    return (
      <section className="recommendations-section">
        <div className="container">
          <div className="section-header">
            <h2>Recomendado para Ti</h2>
          </div>
          <div className="loading-content">
            <div className="recommendations-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="recommendation-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !recommendations) {
    return null; // No mostrar la sección si hay error
  }

  return (
    <section className="recommendations-section">
      <div className="container">
        <div className="section-header">
          <div className="header-content">
            <h2>Recomendado para Ti</h2>
            <p>Cursos seleccionados especialmente para continuar tu crecimiento</p>
          </div>
          <div className="recommendation-badge">
            <span className="badge-icon">🤖</span>
            <span>Personalizado con IA</span>
          </div>
        </div>

        <div className="recommendations-grid">
          {recommendations.courses.map((course) => (
            <div key={course.id} className="recommendation-card">
              <div className="card-header">
                <div className="course-image">
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      width={300}
                      height={180}
                      className="course-img"
                    />
                  ) : (
                    <div className="course-placeholder">
                      <span>📚</span>
                    </div>
                  )}
                  <div className="match-score">
                    <span 
                      className="score-badge"
                      style={{ backgroundColor: getMatchScoreColor(course.matchScore) }}
                    >
                      {course.matchScore}% match
                    </span>
                  </div>
                </div>

                <div className="recommendation-reason">
                  <span className="reason-icon">
                    {getRecommendationIcon(course.recommendationReason)}
                  </span>
                  <span className="reason-text">{course.recommendationReason}</span>
                </div>
              </div>

              <div className="card-content">
                <div className="course-meta">
                  <span className="course-category">{course.category}</span>
                  <span className="course-level">{course.level}</span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>

                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-icon">⭐</span>
                    <span>{course.rating}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">👥</span>
                    <span>{course.studentsCount.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="course-tags">
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="price-section">
                    <span className="price">${course.price}</span>
                    <span className="price-label">USD</span>
                  </div>
                  <Link 
                    href={`/curso/${course.slug}`}
                    className="btn btn-primary"
                  >
                    Ver Curso
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-section">
          <Link href="/courses" className="btn btn-outline">
            Explorar Más Cursos
          </Link>
        </div>
      </div>

      <style jsx>{`
        .recommendations-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .header-content p {
          font-size: 1.125rem;
          color: #6b7280;
          margin: 0;
        }

        .recommendation-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .badge-icon {
          font-size: 1.125rem;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .recommendation-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .recommendation-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          position: relative;
        }

        .course-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .course-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .recommendation-card:hover .course-img {
          transform: scale(1.05);
        }

        .course-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
        }

        .match-score {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .score-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .recommendation-reason {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: white;
          padding: 2rem 1.5rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .reason-icon {
          font-size: 1.25rem;
        }

        .reason-text {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .card-content {
          padding: 1.5rem;
        }

        .course-meta {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .course-category,
        .course-level {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .course-category {
          background: #dbeafe;
          color: #1e40af;
        }

        .course-level {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .course-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }

        .course-description {
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
        }

        .course-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stat-icon {
          font-size: 1rem;
        }

        .course-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .price-section {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .price {
          font-size: 2rem;
          font-weight: 700;
          color: #10b981;
        }

        .price-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline:hover {
          background: #667eea;
          color: white;
        }

        .view-all-section {
          text-align: center;
        }

        .recommendations-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .recommendation-skeleton {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          animation: pulse 2s infinite;
        }

        .skeleton-image {
          height: 200px;
          background: #e5e7eb;
        }

        .skeleton-content {
          padding: 1.5rem;
        }

        .skeleton-line {
          height: 1rem;
          background: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }

        .skeleton-line.short {
          width: 60%;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .recommendations-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-content h2 {
            font-size: 2rem;
          }
          
          .course-stats {
            gap: 1rem;
          }
          
          .card-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .btn {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}