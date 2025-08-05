'use client';

import React, { useState } from 'react';
import { Webinar } from '@/types/webinar';

interface WebinarCarouselProps {
  webinars: Webinar[];
  onRegister: (webinarId: string) => void;
  isUserRegistered: (webinarId: string) => boolean;
}

export default function WebinarCarousel({ webinars, onRegister, isUserRegistered }: WebinarCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3; // Mostrar 3 webinars por vista
  const totalSlides = Math.ceil(webinars.length / itemsPerView);

  // Obtener los webinars para la vista actual
  const getCurrentWebinars = () => {
    const startIndex = currentIndex * itemsPerView;
    return webinars.slice(startIndex, startIndex + itemsPerView);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const formatWebinarDate = (date: Date) => {
    const webinarDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (webinarDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (webinarDate.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return webinarDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getTimeUntilWebinar = (date: Date) => {
    const webinarDate = new Date(date);
    const now = new Date();
    const diff = webinarDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'En vivo';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `En ${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `En ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return `En ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
  };

  if (webinars.length === 0) {
    return (
      <div className="no-webinars-message">
        <div className="no-webinars-icon">🎥</div>
        <h3>No hay webinars próximos</h3>
        <p>Mantente atento a nuestros próximos webinars y eventos especiales.</p>
        <div className="no-webinars-cta">
          <a href="/webinars" className="btn btn-primary">
            Ver todos los webinars
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="webinar-carousel">
      <div className="carousel-container">
        {/* Botón anterior */}
        {totalSlides > 1 && (
          <button 
            className="carousel-button prev-button"
            onClick={prevSlide}
            aria-label="Webinars anteriores"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

                {/* Contenido del carrusel */}
        <div className="carousel-content">
          <div 
            className="carousel-slides-container"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }, (_, slideIndex) => {
              const startIndex = slideIndex * itemsPerView;
              const slideWebinars = webinars.slice(startIndex, startIndex + itemsPerView);
              
              return (
                <div 
                  key={slideIndex}
                  className="carousel-slide"
                >
                  <div className="webinar-grid">
                    {slideWebinars.map((webinar, index) => (
                      <div key={webinar.id} className="webinar-card">
                        <div className="webinar-image">
                          {webinar.imageUrl ? (
                            <img src={webinar.imageUrl} alt={webinar.title} />
                          ) : (
                            <div className="webinar-placeholder">
                              <span>🎥</span>
                            </div>
                          )}
                          <div className="webinar-overlay">
                            <div className="webinar-status">
                              {new Date(webinar.dateTime) <= new Date() ? (
                                <span className="status-live">🔴 EN VIVO</span>
                              ) : (
                                <span className="status-upcoming">⏰ {getTimeUntilWebinar(webinar.dateTime)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="webinar-content">
                          <div className="webinar-header">
                            <h3 className="webinar-title">{webinar.title}</h3>
                            <p className="webinar-description">{webinar.description}</p>
                          </div>

                          <div className="webinar-details">
                            <div className="webinar-meta">
                              <div className="meta-item">
                                <span className="meta-icon">📅</span>
                                <span className="meta-text">{formatWebinarDate(webinar.dateTime)}</span>
                              </div>
                              <div className="meta-item">
                                <span className="meta-icon">🕐</span>
                                <span className="meta-text">
                                  {new Date(webinar.dateTime).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <div className="meta-item">
                                <span className="meta-icon">👨‍💼</span>
                                <span className="meta-text">{webinar.hostName}</span>
                              </div>
                              <div className="meta-item">
                                <span className="meta-icon">👥</span>
                                <span className="meta-text">
                                  {webinar.currentAttendees}/{webinar.maxAttendees || 'Sin límite'}
                                </span>
                              </div>
                            </div>

                            <div className="webinar-tags">
                              {webinar.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span key={tagIndex} className="webinar-tag">
                                  {tag}
                                </span>
                              ))}
                              {webinar.tags.length > 2 && (
                                <span className="webinar-tag more-tag">
                                  +{webinar.tags.length - 2}
                                </span>
                              )}
                            </div>

                            <div className="webinar-actions">
                              {isUserRegistered(webinar.id) ? (
                                <button className="btn btn-success btn-full" disabled>
                                  ✅ Ya registrado
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-primary btn-full"
                                  onClick={() => onRegister(webinar.id)}
                                >
                                  🎥 Registrarse
                                </button>
                              )}
                              
                              <a 
                                href={`/webinar/${webinar.slug}`}
                                className="btn btn-outline btn-full"
                              >
                                📋 Ver detalles
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón siguiente */}
        {totalSlides > 1 && (
          <button 
            className="carousel-button next-button"
            onClick={nextSlide}
            aria-label="Siguientes webinars"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Indicadores */}
      {totalSlides > 1 && (
        <div className="carousel-indicators">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a la vista ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .webinar-carousel {
          position: relative;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
        }

        .carousel-container {
          position: relative;
          overflow: visible;
          border-radius: 16px;
          padding: 0 60px;
          width: 100%;
        }

        .carousel-content {
          overflow: hidden;
          width: 100%;
          position: relative;
        }

        .carousel-slides-container {
          display: flex;
          width: 100%;
          transition: transform 0.5s ease-in-out;
        }

        .carousel-slide {
          width: 100%;
          min-width: 100%;
          flex-shrink: 0;
          position: relative;
        }

        .webinar-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 0.5rem;
          width: 100%;
          min-width: 100%;
        }

        .webinar-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f3f4f6;
        }

        .webinar-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .webinar-image {
          position: relative;
          height: 160px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .webinar-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .webinar-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 2.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .webinar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 0.75rem;
        }

        .webinar-status {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-live {
          color: #ef4444;
        }

        .status-upcoming {
          color: #fbbf24;
        }

        .webinar-content {
          padding: 1.25rem;
        }

        .webinar-header {
          margin-bottom: 1rem;
        }

        .webinar-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .webinar-description {
          color: #6b7280;
          line-height: 1.4;
          margin: 0;
          font-size: 0.875rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .webinar-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .webinar-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4b5563;
          font-size: 0.8rem;
        }

        .meta-icon {
          font-size: 1rem;
        }

        .meta-text {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .webinar-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .webinar-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 0.2rem 0.5rem;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .more-tag {
          background: #e5e7eb;
          color: #6b7280;
        }

        .webinar-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn-full {
          width: 100%;
          justify-content: center;
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          color: #374151;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .carousel-button:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .prev-button {
          left: 0;
        }

        .next-button {
          right: 0;
        }

        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: #667eea;
          transform: scale(1.3);
        }

        .indicator:hover {
          background: #9ca3af;
          transform: scale(1.1);
        }

        .no-webinars-message {
          text-align: center;
          padding: 3rem 2rem;
          background: #f9fafb;
          border-radius: 16px;
          border: 2px dashed #d1d5db;
        }

        .no-webinars-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .no-webinars-message h3 {
          color: #374151;
          margin: 0 0 0.5rem 0;
        }

        .no-webinars-message p {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
        }

        .no-webinars-cta {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .webinar-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .webinar-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .webinar-content {
            padding: 1rem;
          }

          .webinar-title {
            font-size: 1rem;
          }

          .carousel-container {
            padding: 0 40px;
          }

          .carousel-button {
            width: 36px;
            height: 36px;
          }

          .prev-button {
            left: 0;
          }

          .next-button {
            right: 0;
          }
        }
      `}</style>
    </div>
  );
} 