'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeMessage from './WelcomeMessage';
import PremiumSubscriptionBanner from '../PremiumSubscriptionBanner';

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
      }, 800); // Delay para ver mejor el efecto
      
      return () => clearTimeout(animationTimer);
    }
  }, [status]);

  // No mostrar nada mientras se verifica el estado de autenticación
  if (!isReady) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 py-0">
      {/* Banner Promocional - Ancho completo del background */}
      <div className="banner-full-width">
        <PremiumSubscriptionBanner skipDelay={true} />
      </div>
      
      <div className="container mx-auto px-4">
        {!isAuthenticated ? (
          /* Solo mensaje de bienvenida para usuarios no registrados */
          <div className={`welcome-message ${showWelcome ? 'show' : ''}`}>
            <WelcomeMessage />
          </div>
        ) : (
          /* Layout para usuarios registrados */
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Mensaje de Bienvenida - Animación sencilla */}
            <div className={`w-full lg:w-1/2 welcome-message ${showWelcome ? 'show' : ''}`}>
              <WelcomeMessage />
            </div>
            
            {/* Espacio para balance visual */}
            <div className="w-full lg:w-1/2"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Banner Promocional - Sin animación duplicada, usa la de PremiumSubscriptionBanner */
        .banner-full-width {
          width: 100%;
        }

        /* Mensaje de Bienvenida - Animación suave y limpia */
        .welcome-message {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transition-delay: 0.5s;
          position: relative;
          z-index: 20;
        }

        .welcome-message.show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Mobile - animaciones optimizadas */
        @media (max-width: 1024px) {
          .welcome-message {
            transform: translateY(30px) scale(0.98);
          }

          .welcome-message.show {
            transform: translateY(0) scale(1);
          }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .welcome-message {
            transition: none;
            transform: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}