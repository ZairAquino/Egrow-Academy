'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionButton from '@/components/payments/SubscriptionButton';
import DynamicLogo from '@/components/ui/DynamicLogo';

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="hero gradient-bg">

      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            La IA es la nueva electricidad.
            <span className="block">Tú eres la chispa.</span>
          </h1>
          <p className="hero-description">
            Domina el aprendizaje automático e inteligencia artificial con
            cursos gratuitos y recursos de alta calidad. Comienza tu viaje
            en IA hoy mismo.
          </p>
          
          {/* Logo blanco debajo del texto */}
          <div className="hero-bottom-logo">
            <div className="logo-animation-wrapper">
              <DynamicLogo 
                width={95}
                height={95}
                priority={true}
                className="hero-bottom-logo-image"
                sizes="95px"
                quality={90}
              />
            </div>
          </div>
          
          {/* Botones removidos - solo se mantiene el contenido informativo */}
        </div>
      </div>

      <style jsx>{`
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

        .logo-animation-wrapper {
          animation: logoFloat 3s ease-in-out infinite;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-animation-wrapper:hover {
          animation-play-state: paused;
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

        @media (max-width: 768px) {
          .hero-bottom-logo-image {
            max-width: 76px;
            max-height: 57px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-button {
            width: 100%;
            max-width: 280px;
          }
        }

        @media (max-width: 480px) {
          .hero-bottom-logo-image {
            max-width: 66px;
            max-height: 48px;
          }
        }
      `}</style>
    </section>
  );
} 