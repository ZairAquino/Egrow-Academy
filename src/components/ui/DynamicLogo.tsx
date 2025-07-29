'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface DynamicLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackToFree?: boolean;
}

export default function DynamicLogo({ 
  width = 95, 
  height = 95, 
  className = '', 
  priority = false,
  fallbackToFree = true
}: DynamicLogoProps) {
  const { user, status } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const checkSubscription = async () => {
        try {
          const response = await fetch('/api/auth/subscription-status');
          if (response.ok) {
            const data = await response.json();
            setIsPremium(
              user.membershipLevel === 'PREMIUM' ||
              data.membershipLevel === 'PREMIUM' ||
              data.hasActiveSubscription === true
            );
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      };
      
      checkSubscription();
    } else {
      setIsPremium(false);
    }
  }, [status, user?.id, user?.membershipLevel]);

  // Mostrar logo gratuito mientras se hidrata
  if (!isHydrated) {
    return (
      <Image 
        src="/images/logog.png"
        alt="eGrow Academy"
        width={width}
        height={height}
        priority={priority}
        className={className}
      />
    );
  }

  const logoSrc = isPremium 
    ? "/images/optimized/logop.webp" 
    : "/images/logog.png";
  const logoAlt = isPremium ? "eGrow Academy Premium" : "eGrow Academy";

  return (
    <Image 
      src={logoSrc}
      alt={logoAlt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={(e) => {
        if (fallbackToFree && logoSrc.includes('logop.webp')) {
          (e.target as HTMLImageElement).src = "/images/logog.png";
        }
      }}
    />
  );
}