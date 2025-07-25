'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Hero() {
  const { user, status } = useAuth();
  const { hasPremiumAccess, isLoading } = useSubscriptionStatus();

  // Lógica mejorada para el logo
  const isPremium = hasPremiumAccess || (status === 'authenticated' && user?.membershipLevel === 'PREMIUM');
  const logoSrc = isPremium ? '/images/logop.png' : '/images/logog.png';
  const logoAlt = isPremium ? 'eGrow Academy Premium' : 'eGrow Academy';

  // Logs de depuración
  useEffect(() => {
    console.log('🔍 [HERO] Status:', status);
    console.log('🔍 [HERO] User:', user?.email);
    console.log('🔍 [HERO] User Membership:', user?.membershipLevel);
    console.log('🔍 [HERO] Has Premium Access:', hasPremiumAccess);
    console.log('🔍 [HERO] Is Premium:', isPremium);
    console.log('🔍 [HERO] Logo Source:', logoSrc);
  }, [status, user, hasPremiumAccess, isPremium, logoSrc]);

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
          {/* Logo debajo del texto */}
          <div className="hero-bottom-logo">
            <div className="logo-animation-wrapper">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={95}
                height={95}
                priority
                className="hero-bottom-logo-image"
                unoptimized
              />
            </div>
          </div>
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
        @media (max-width: 768px) {
          .hero-bottom-logo-image {
            max-width: 76px;
            max-height: 57px;
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