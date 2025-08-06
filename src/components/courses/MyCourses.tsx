'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface UserCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  progress: number;
  lastAccessed: Date;
  totalLessons: number;
  completedLessons: number;
  category: string;
  level: string;
}

export default function MyCourses() {
  const { user } = useAuth();
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/courses');
      
      if (!response.ok) {
        throw new Error('Error al cargar tus cursos');
      }
      
      const data = await response.json();
      setUserCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatLastAccessed = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return `Hace ${Math.ceil(diffDays / 30)} meses`;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return '#e5e7eb';
    if (progress < 30) return '#fbbf24';
    if (progress < 70) return '#3b82f6';
    if (progress < 100) return '#10b981';
    return '#059669';
  };

  const getProgressText = (progress: number) => {
    if (progress === 0) return 'Sin empezar';
    if (progress < 100) return 'En progreso';
    return '¡Completado!';
  };

  // Funciones del carrusel
  const nextSlide = () => {
    if (userCourses.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(userCourses.length / getItemsPerView()));
    }
  };

  const prevSlide = () => {
    if (userCourses.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + Math.ceil(userCourses.length / getItemsPerView())) % Math.ceil(userCourses.length / getItemsPerView()));
    }
  };

  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // desktop
      if (window.innerWidth >= 768) return 2;  // tablet
      return 1; // mobile
    }
    return 3; // default
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="my-courses-section">
        <div className="container">
          <div className="section-header">
            <h2>Tus Cursos</h2>
          </div>
          <div className="loading-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="course-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-courses-section">
        <div className="container">
          <div className="error-state">
            <p>Error al cargar tus cursos: {error}</p>
            <button onClick={fetchUserCourses} className="retry-btn">
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay cursos, no mostrar esta sección
  if (userCourses.length === 0) {
    return null;
  }

  // Ordenar cursos por último acceso
  const sortedCourses = userCourses
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());

  const totalSlides = Math.ceil(sortedCourses.length / getItemsPerView());

  return (
    <section className="my-courses-section">
      <div className="container">
        <div className="section-header">
          <div className="header-content">
            <div className="header-text">
              <h2>Tus Cursos ({userCourses.length})</h2>
              <p>Continúa tu progreso y domina la IA</p>
            </div>
            {sortedCourses.length > getItemsPerView() && (
              <div className="carousel-controls">
                <button 
                  onClick={prevSlide} 
                  className="carousel-btn prev"
                  aria-label="Curso anterior"
                >
                  ←
                </button>
                <button 
                  onClick={nextSlide} 
                  className="carousel-btn next"
                  aria-label="Siguiente curso"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="courses-carousel">
          <div 
            className="courses-track"
            ref={carouselRef}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {sortedCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="course-img"
                  />
                ) : (
                  <div className="course-placeholder">
                    <span>📚</span>
                  </div>
                )}
                <div className="course-progress-overlay">
                  <div 
                    className="progress-circle"
                    style={{"--progress": `${course.progress}%`} as React.CSSProperties}
                  >
                    <span className="progress-text">{Math.round(course.progress)}%</span>
                  </div>
                </div>
              </div>

              <div className="course-content">
                <div className="course-meta">
                  <span className="course-category">{course.category}</span>
                  <span className="course-level">{course.level}</span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">
                  {course.description.length > 100 
                    ? `${course.description.substring(0, 100)}...` 
                    : course.description
                  }
                </p>

                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-icon">📖</span>
                    <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">🕒</span>
                    <span>{formatLastAccessed(course.lastAccessed)}</span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: getProgressColor(course.progress)
                    }}
                  ></div>
                </div>
                <p className="progress-label">{getProgressText(course.progress)}</p>

                <div className="course-actions">
                  <Link 
                    href={`/curso/${course.slug}`}
                    className="btn btn-primary continue-btn"
                  >
                    {course.progress === 0 ? 'Comenzar' : 'Continuar'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Indicadores de página */}
        {totalSlides > 1 && (
          <div className="carousel-indicators">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                aria-label={`Ir a la página ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Link para ver todos los cursos si hay más de lo visible */}
        {userCourses.length > getItemsPerView() && (
          <div className="view-all-section">
            <Link href="/dashboard/courses" className="btn btn-outline">
              Ver todos mis cursos ({userCourses.length})
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .my-courses-section {
          padding: 3rem 0;
          background: #f9fafb;
        }


        .section-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-text {
          text-align: left;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .section-header p {
          font-size: 1.125rem;
          color: #6b7280;
          margin: 0;
        }

        /* Estilos del carrusel */
        .courses-carousel {
          overflow: hidden;
          margin-bottom: 2rem;
          position: relative;
        }

        .courses-track {
          display: flex;
          gap: 2rem;
          transition: transform 0.3s ease-in-out;
          width: fit-content;
        }

        .carousel-controls {
          display: flex;
          gap: 0.5rem;
        }

        .carousel-btn {
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .carousel-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .carousel-btn:active {
          transform: translateY(0);
        }

        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border: none;
          border-radius: 50%;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scale(1.2);
        }

        .indicator:hover {
          background: #9ca3af;
        }

        .indicator.active:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .course-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          min-width: 350px;
          flex: 0 0 350px;
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
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

        .course-progress-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .progress-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: conic-gradient(
            #10b981 0deg,
            #10b981 calc(var(--progress) * 3.6deg),
            rgba(255, 255, 255, 0.3) calc(var(--progress) * 3.6deg)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .progress-text {
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .course-content {
          padding: 1.5rem;
        }

        .course-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
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
          margin-bottom: 1rem;
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

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-label {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: right;
          margin: 0 0 1.5rem 0;
        }

        .course-actions {
          display: flex;
          justify-content: center;
        }

        .continue-btn {
          width: 100%;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
        }

        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .view-all-section {
          text-align: center;
          margin-top: 2rem;
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-outline:hover {
          background: #667eea;
          color: white;
        }


        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .course-card-skeleton {
          background: white;
          border-radius: 16px;
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

        .error-state {
          text-align: center;
          padding: 2rem;
          color: #dc2626;
        }

        .retry-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .course-card {
            min-width: 320px;
            flex: 0 0 320px;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .header-text {
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2rem;
          }

          .course-card {
            min-width: 280px;
            flex: 0 0 280px;
          }
          
          .course-stats {
            flex-direction: column;
            gap: 0.75rem;
          }

          .carousel-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}