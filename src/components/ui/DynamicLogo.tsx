'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';

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
  const [logoKey, setLogoKey] = useState(0);
  const [forceReload, setForceReload] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

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
  }, [status, user?.id, user?.membershipLevel]);

  // Determinar si es premium basado en múltiples fuentes
  const isPremium = status === 'authenticated' && user && (
    user.membershipLevel === 'PREMIUM' ||
    subscriptionData?.membershipLevel === 'PREMIUM' ||
    subscriptionData?.hasActiveSubscription === true
  );

  // Forzar re-render y recarga cuando cambie el estado premium
  useEffect(() => {
    setLogoKey(prev => prev + 1);
    setForceReload(prev => prev + 1);
    
    // Forzar recarga de la imagen si ya está cargada
    if (imgRef.current) {
      const currentSrc = imgRef.current.src;
      imgRef.current.src = '';
      setTimeout(() => {
        if (imgRef.current) {
          imgRef.current.src = currentSrc;
        }
      }, 10);
    }
  }, [isPremium]);

  // Generar URL con múltiples parámetros de cache busting
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const logoSrc = isPremium 
    ? `/images/logop.png?v=${timestamp}&key=${logoKey}&reload=${forceReload}&r=${randomId}` 
    : `/images/logog.png?v=${timestamp}&key=${logoKey}&reload=${forceReload}&r=${randomId}`;
  const logoAlt = isPremium ? "eGrow Academy Premium" : "eGrow Academy";

  // Logs detallados para depuración
  console.log(`🎨 [DynamicLogo] ===== DEBUG INFO =====`);
  console.log(`🎨 [DynamicLogo] Status: ${status}`);
  console.log(`🎨 [DynamicLogo] User: ${user?.email || 'No user'}`);
  console.log(`🎨 [DynamicLogo] User membershipLevel: ${user?.membershipLevel || 'No level'}`);
  console.log(`🎨 [DynamicLogo] API membershipLevel: ${subscriptionData?.membershipLevel || 'No API data'}`);
  console.log(`🎨 [DynamicLogo] API hasActiveSubscription: ${subscriptionData?.hasActiveSubscription || 'No API data'}`);
  console.log(`🎨 [DynamicLogo] Is Premium: ${isPremium}`);
  console.log(`🎨 [DynamicLogo] Logo Key: ${logoKey}`);
  console.log(`🎨 [DynamicLogo] Force Reload: ${forceReload}`);
  console.log(`🎨 [DynamicLogo] Using logo: ${logoSrc}`);
  console.log(`🎨 [DynamicLogo] ========================`);

  return (
    <Image 
      ref={imgRef}
      key={`${logoKey}-${isPremium}-${forceReload}`}
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
          (e.target as HTMLImageElement).src = `/images/logog.png?v=${timestamp}&key=${logoKey}&reload=${forceReload}&r=${randomId}`;
        }
      }}
      onLoad={() => {
        console.log(`✅ [DynamicLogo] Logo loaded successfully: ${logoSrc}`);
      }}
    />
  );
}