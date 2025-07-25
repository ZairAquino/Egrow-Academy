'use client';

import Image from 'next/image';
import { useLogo } from '@/hooks/useLogo';

interface DynamicLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function DynamicLogo({ 
  width = 95, 
  height = 95, 
  className = "hero-bottom-logo-image",
  priority = true 
}: DynamicLogoProps) {
  const { logoSrc, logoAlt, isPremium, isLoading } = useLogo();

  return (
    <div className="logo-animation-wrapper">
      <Image 
        src={logoSrc}
        alt={logoAlt}
        width={width}
        height={height}
        priority={priority}
        className={className}
        key={logoSrc} // Forzar re-render cuando cambie la imagen
        onLoad={() => {
          if (typeof window !== 'undefined') {
            console.log('DynamicLogo loaded:', logoSrc, 'isPremium:', isPremium);
          }
        }}
        onError={(e) => {
          if (typeof window !== 'undefined') {
            console.error('Error loading logo:', logoSrc);
            // Fallback al logo gratuito si hay error
            (e.target as HTMLImageElement).src = "/images/logog.png";
          }
        }}
      />
      {/* Debug info en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'absolute', 
          top: '-20px', 
          left: '0', 
          fontSize: '10px', 
          background: 'rgba(0,0,0,0.7)', 
          color: 'white', 
          padding: '2px 4px',
          borderRadius: '2px',
          zIndex: 1000
        }}>
          {isPremium ? 'PREMIUM' : 'FREE'} {isLoading && '(loading)'}
        </div>
      )}
    </div>
  );
}