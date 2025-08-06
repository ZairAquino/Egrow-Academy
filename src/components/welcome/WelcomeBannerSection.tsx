'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeMessage from './WelcomeMessage';
import PromotionBannerWrapper from '../PromotionBannerWrapper';

export default function WelcomeBannerSection() {
  const { status } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    // Esperar a que el estado de autenticación esté completamente verificado
    if (status !== 'loading') {
      setIsReady(true);
      
      // Ejecutar animaciones después de que el estado esté listo
      const animationTimer = setTimeout(() => {
        setShowWelcome(true);
      }, 300);
      
      return () => clearTimeout(animationTimer);
    }
  }, [status]);

  // No mostrar nada mientras se verifica el estado de autenticación
  if (!isReady) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        {!isAuthenticated ? (
          /* Banner Promocional - Desliza desde la Derecha (usuarios no registrados) */
          <div className={`banner-slide ${showWelcome ? 'show' : ''}`}>
            <PromotionBannerWrapper skipDelay={true} />
          </div>
        ) : (
          /* Layout para usuarios registrados */
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Mensaje de Bienvenida - Animación sencilla */}
            <div className={`w-full lg:w-1/2 welcome-message ${showWelcome ? 'show' : ''}`}>
              <WelcomeMessage />
            </div>
            
            {/* Banner Promocional - Desliza desde la Derecha */}
            <div className={`w-full lg:w-1/2 banner-slide ${showWelcome ? 'show' : ''}`} style={{ transitionDelay: '0.2s' }}>
              <PromotionBannerWrapper skipDelay={true} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Mensaje de Bienvenida - Animación suave y limpia */
        .welcome-message {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .welcome-message.show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Banner Promocional - Desliza desde la Derecha con efecto suave */
        .banner-slide {
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .banner-slide.show {
          transform: translateX(0);
          opacity: 1;
        }

        /* Mobile - animaciones optimizadas */
        @media (max-width: 1024px) {
          .welcome-message {
            transform: translateY(30px) scale(0.98);
          }

          .welcome-message.show {
            transform: translateY(0) scale(1);
          }

          .banner-slide {
            transform: translateY(40px);
          }

          .banner-slide.show {
            transform: translateY(0);
          }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .welcome-message,
          .banner-slide {
            transition: none;
            transform: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}