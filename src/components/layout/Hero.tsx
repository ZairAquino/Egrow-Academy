'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionButton from '@/components/payments/SubscriptionButton';
import DynamicLogo from '@/components/ui/DynamicLogo';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="hero">
      {/* Imagen de fondo del header */}
      {isClient && (
        <>
          <img
            src="/images/background.png"
            alt="Header background"
            className="hero-background"
          />
          
          {/* Imagen v-11 1.png en la esquina inferior derecha de background.png */}
          <img
            src="/images/v-11 1.png"
            alt="Hero decoration"
            className="hero-decoration"
          />
        </>
      )}
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-content">
          <h1 className="hero-title">
         Domina la inteligencia
         <span className="block">artificial desde cero </span>
          </h1>
          <p className="hero-description">
            Desarrolla habilidades irremplazables y consigue mejores oportunidades profesionales
          </p>
          
          {/* Logo blanco debajo del texto */}
          <div className="hero-bottom-logo">
            <div className="logo-animation-wrapper">
              <DynamicLogo 
                width={95}
                height={95}
                priority={true}
                className="hero-bottom-logo-image"
              />
            </div>
          </div>
          
          {/* Botones removidos - solo se mantiene el contenido informativo */}
        </div>
      </div>

      <style jsx>{`
        .hero-decoration {
          position: absolute;
          width: 240px;
          height: 285px;
          right: calc(50% - 620px + 20px);
          bottom: calc(50% - 230px + 20px);
          z-index: 0;
          opacity: 0.9;
          object-fit: contain;
        }

        .hero-bottom-logo {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .hero-bottom-logo-image {
          height: auto;
          max-height: 71px;
          width: auto;
          max-width: 95px;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .logo-animation-wrapper:hover .hero-bottom-logo-image {
          transform: scale(1.1) rotate(5deg);
          filter: brightness(1.2);
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes logoFloatMobile {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .logo-animation-wrapper {
          animation: logoFloat 3s ease-in-out infinite;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-animation-wrapper:hover {
          animation-play-state: paused;
        }

        .hero-subtitle {
          font-size: 118%;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-top: 32px;
          flex-wrap: wrap;
        }

        .hero-button {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 160px;
        }

        .hero-button.primary {
          background: #3b82f6;
          color: white;
          border: 2px solid #3b82f6;
        }

        .hero-button.primary:hover {
          background: #2563eb;
          border-color: #2563eb;
          transform: translateY(-2px);
        }

        .hero-button.secondary {
          background: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
        }

        .hero-button.secondary:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #000;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-top: 16px;
        }

        .hero-decoration {
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .hero-bottom-logo {
            margin-top: 24px;
          }

          .hero-bottom-logo-image {
            max-width: 76px;
            max-height: 57px;
          }

          .logo-animation-wrapper {
            animation: logoFloatMobile 4s ease-in-out infinite;
          }

          .logo-animation-wrapper:hover .hero-bottom-logo-image {
            transform: scale(1.05) rotate(3deg);
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-button {
            width: 100%;
            max-width: 280px;
          }

          .hero-decoration {
            width: 180px !important;
            height: 214px !important;
            right: calc(50% - 384px + 15px) !important;
            bottom: calc(50% - 192px + 15px) !important;
          }
        }

        @media (max-width: 640px) {
          .hero-decoration {
            width: 140px !important;
            height: 166px !important;
            right: 10px !important;
            bottom: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-bottom-logo {
            margin-top: 20px;
          }

          .hero-bottom-logo-image {
            max-width: 66px;
            max-height: 48px;
          }

          .hero-decoration {
            width: 100px !important;
            height: 119px !important;
            right: calc(50% - 240px + 10px) !important;
            bottom: calc(50% - 120px + 10px) !important;
          }
        }

        @media (max-width: 375px) {
          .hero-decoration {
            width: 80px !important;
            height: 95px !important;
            right: calc(50% - 187px + 5px) !important;
            bottom: calc(50% - 93px + 5px) !important;
          }
        }
      `}</style>
    </section>
  );
} 