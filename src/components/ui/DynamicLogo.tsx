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
  const [isLoading, setIsLoading] = useState(true);

  // Verificar estado premium cuando cambie el usuario
  useEffect(() => {
    const checkPremiumStatus = async () => {
      setIsLoading(true);
      
      try {
        if (status === 'authenticated' && user) {
          console.log('🔍 [DynamicLogo] Checking premium status for:', user.email);
          
          // Primera verificación: membershipLevel del usuario
          const userIsPremium = user.membershipLevel === 'PREMIUM';
          console.log('🔍 [DynamicLogo] User membershipLevel:', user.membershipLevel);
          console.log('🔍 [DynamicLogo] User is premium by membership:', userIsPremium);
          
          if (userIsPremium) {
            setIsPremium(true);
            setIsLoading(false);
            return;
          }
          
          // Segunda verificación: API de suscripción
          const response = await fetch('/api/auth/subscription-status', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('🔍 [DynamicLogo] API response:', data);
            
            const apiIsPremium = data.hasActiveSubscription || data.membershipLevel === 'PREMIUM';
            console.log('🔍 [DynamicLogo] API indicates premium:', apiIsPremium);
            
            setIsPremium(apiIsPremium);
          } else {
            console.error('❌ [DynamicLogo] API error:', response.status);
            setIsPremium(false);
          }
        } else {
          console.log('🔍 [DynamicLogo] User not authenticated or no user');
          setIsPremium(false);
        }
      } catch (error) {
        console.error('❌ [DynamicLogo] Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [status, user?.id, user?.membershipLevel]);

  // Generar URL del logo
  const timestamp = Date.now();
  const logoSrc = isPremium 
    ? `/images/logop.png?v=${timestamp}&premium=true` 
    : `/images/logog.png?v=${timestamp}&premium=false`;
  const logoAlt = isPremium ? "eGrow Academy Premium" : "eGrow Academy";

  // Logs de depuración
  console.log(`🎨 [DynamicLogo] ===== RENDER INFO =====`);
  console.log(`🎨 [DynamicLogo] Status: ${status}`);
  console.log(`🎨 [DynamicLogo] User: ${user?.email || 'No user'}`);
  console.log(`🎨 [DynamicLogo] User membershipLevel: ${user?.membershipLevel || 'No level'}`);
  console.log(`🎨 [DynamicLogo] Is Premium: ${isPremium}`);
  console.log(`🎨 [DynamicLogo] Is Loading: ${isLoading}`);
  console.log(`🎨 [DynamicLogo] Using logo: ${logoSrc}`);
  console.log(`🎨 [DynamicLogo] ========================`);

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ width, height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Image 
      key={`${isPremium}-${timestamp}`}
      src={logoSrc}
      alt={logoAlt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      unoptimized={true}
      onError={(e) => {
        console.error(`❌ [DynamicLogo] Error loading logo: ${logoSrc}`);
        if (fallbackToFree && logoSrc.includes('logop.png')) {
          console.log(`🔄 [DynamicLogo] Falling back to free logo...`);
          const fallbackSrc = `/images/logog.png?v=${timestamp}&fallback=true`;
          (e.target as HTMLImageElement).src = fallbackSrc;
        }
      }}
      onLoad={() => {
        console.log(`✅ [DynamicLogo] Logo loaded successfully: ${logoSrc}`);
      }}
    />
  );
}