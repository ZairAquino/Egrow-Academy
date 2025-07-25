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
  const [subscriptionData, setSubscriptionData] = useState<{
    hasActiveSubscription: boolean;
    membershipLevel: string;
  } | null>(null);

  // Verificar estado de suscripción cuando cambie el usuario o status
  useEffect(() => {
    if (status === 'authenticated' && user) {
      const checkSubscription = async () => {
        try {
          console.log('🔍 [DynamicLogo] Checking subscription for user:', user.email);
          const response = await fetch('/api/auth/subscription-status');
          if (response.ok) {
            const data = await response.json();
            console.log('🔍 [DynamicLogo] Subscription data received:', data);
            setSubscriptionData({
              hasActiveSubscription: data.hasActiveSubscription,
              membershipLevel: data.membershipLevel || 'FREE'
            });
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      };
      
      checkSubscription();
    }
  }, [status, user?.id, user?.membershipLevel]); // Re-check cuando cambie membership

  // Determinar si es premium basado en múltiples fuentes
  const isPremium = status === 'authenticated' && user && (
    user.membershipLevel === 'PREMIUM' ||
    subscriptionData?.membershipLevel === 'PREMIUM' ||
    subscriptionData?.hasActiveSubscription === true
  );

  const logoSrc = isPremium ? "/images/logop.png" : "/images/logog.png";
  const logoAlt = isPremium ? "eGrow Academy Premium" : "eGrow Academy";

  console.log(`🎨 [DynamicLogo] Status: ${status}, User: ${user?.email}, User membership: ${user?.membershipLevel}, API membership: ${subscriptionData?.membershipLevel}, Active subscription: ${subscriptionData?.hasActiveSubscription}, Using logo: ${logoSrc}`);

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