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
    </section>
  );
} 