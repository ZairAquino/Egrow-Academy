'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

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
  const { hasPremiumAccess, membershipLevel } = useSubscriptionStatus();

  // Determinar qué logo usar basado en múltiples fuentes
  const isPremium = status === 'authenticated' && (
    user?.membershipLevel === 'PREMIUM' ||
    membershipLevel === 'PREMIUM' ||
    hasPremiumAccess
  );

  const logoSrc = isPremium ? "/images/logop.png" : "/images/logog.png";
  const logoAlt = isPremium ? "eGrow Academy Premium" : "eGrow Academy";

  console.log(`🎨 [DynamicLogo] Status: ${status}, User membership: ${user?.membershipLevel}, Hook membership: ${membershipLevel}, Premium access: ${hasPremiumAccess}, Using logo: ${logoSrc}`);

  return (
    <Image 
      src={logoSrc}
      alt={logoAlt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={(e) => {
        console.error(`❌ [DynamicLogo] Error loading logo: ${logoSrc}`);
        if (fallbackToFree && logoSrc.includes('logop.png')) {
          // Fallback to free logo if premium fails
          (e.target as HTMLImageElement).src = "/images/logog.png";
        }
      }}
    />
  );
}