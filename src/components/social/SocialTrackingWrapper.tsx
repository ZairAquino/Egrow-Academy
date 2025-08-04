'use client';

import { useEffect } from 'react';
import { initializeSocialTracking } from '@/lib/social-tracking';

interface SocialTrackingWrapperProps {
  children: React.ReactNode;
}

export default function SocialTrackingWrapper({ children }: SocialTrackingWrapperProps) {
  useEffect(() => {
    // Inicializar tracking de redes sociales
    initializeSocialTracking();
  }, []);

  return <>{children}</>;
} 