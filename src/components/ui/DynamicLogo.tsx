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
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Verificar estado de suscripción cuando cambie el usuario o status
  useEffect(() => {
    if (status === 'authenticated' && user) {
      setIsLoading(true);
      const checkSubscription = async () => {
        try {
          console.log(`🔍 [DynamicLogo] Checking subscription for user:`, user.email);
          console.log(`🔍 [DynamicLogo] User membershipLevel from context:`, user.membershipLevel);
          
          const response = await fetch('/api/auth/subscription-status');
          console.log(`🔍 [DynamicLogo] Response status:`, response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`🔍 [DynamicLogo] Subscription data received:`, data);
            setSubscriptionData({
              hasActiveSubscription: data.hasActiveSubscription,
              membershipLevel: data.membershipLevel || 'FREE'
            });
          } else {
            console.error(`❌ [DynamicLogo] Error response:`, response.status);
            const errorText = await response.text();
            console.error(`❌ [DynamicLogo] Error text:`, errorText);
          }
        } catch (error) {
          console.error(`❌ [DynamicLogo] Error checking subscription:`, error);
        } finally {
          setIsLoading(false);
        }
      };
      
      checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, [status, user?.id, user?.membershipLevel]);

  // Determinar si es premium basado en múltiples fuentes
  const isPremium = status === 'authenticated' && user && (
    user.membershipLevel === 'PREMIUM' ||
    subscriptionData?.membershipLevel === 'PREMIUM' ||
    subscriptionData?.hasActiveSubscription === true
  );

  // Forzar re-render cuando cambie el estado premium
  useEffect(() => {
    if (isPremium) {
      console.log(`🎯 [DynamicLogo] User is PREMIUM - forcing logo reload`);
      setLogoKey(prev => prev + 1);
    }
  }, [isPremium]);

  // Generar URL con parámetros de cache busting
  const logoSrc = isPremium 
    ? `/images/optimized/logop.webp?key=${logoKey}&premium=true` 
    : `/images/logog.png?key=${logoKey}&free=true`;
  const logoAlt = isPremium ? "eGrow Academy Premium" : "eGrow Academy";

  // Clase CSS dinámica - agregar 'premium' si es usuario premium
  const dynamicClassName = isPremium 
    ? `${className} premium`.trim()
    : className;

  // Logs detallados para depuración
  console.log(`🎨 [DynamicLogo] ===== DEBUG INFO =====`);
  console.log(`🎨 [DynamicLogo] Status: ${status}`);
  console.log(`🎨 [DynamicLogo] User: ${user?.email || 'No user'}`);
  console.log(`🎨 [DynamicLogo] User membershipLevel: ${user?.membershipLevel || 'No level'}`);
  console.log(`🎨 [DynamicLogo] API membershipLevel: ${subscriptionData?.membershipLevel || 'No API data'}`);
  console.log(`🎨 [DynamicLogo] API hasActiveSubscription: ${subscriptionData?.hasActiveSubscription || 'No API data'}`);
  console.log(`🎨 [DynamicLogo] Is Premium: ${isPremium}`);
  console.log(`🎨 [DynamicLogo] Logo Key: ${logoKey}`);
  console.log(`🎨 [DynamicLogo] Using logo: ${logoSrc}`);
  console.log(`🎨 [DynamicLogo] Loading: ${isLoading}`);
  console.log(`🎨 [DynamicLogo] CSS Class: ${dynamicClassName}`);
  console.log(`🎨 [DynamicLogo] ========================`);

  // Si está cargando, mostrar logo gratuito temporalmente
  if (isLoading) {
    return (
      <Image 
        key="loading"
        src="/images/logog.png?key=loading"
        alt="eGrow Academy"
        width={width}
        height={height}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image 
      ref={imgRef}
      key={`${logoKey}-${isPremium}-${logoSrc}`}
      src={logoSrc}
      alt={logoAlt}
      width={width}
      height={height}
      priority={priority}
      className={dynamicClassName}
      onError={(e) => {
        console.error(`❌ [DynamicLogo] Error loading logo: ${logoSrc}`);
        if (fallbackToFree && logoSrc.includes('logop.webp')) {
          // Fallback to free logo if premium fails
          console.log(`🔄 [DynamicLogo] Falling back to free logo`);
          (e.target as HTMLImageElement).src = `/images/logog.png?key=${logoKey}&fallback=true`;
        }
      }}
      onLoad={() => {
        console.log(`✅ [DynamicLogo] Logo loaded successfully: ${logoSrc}`);
        if (isPremium) {
          console.log(`🌟 [DynamicLogo] Premium logo loaded successfully!`);
        }
      }}
    />
  );
}