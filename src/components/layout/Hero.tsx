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
        </div>
      </div>

      <style jsx>{`
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
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