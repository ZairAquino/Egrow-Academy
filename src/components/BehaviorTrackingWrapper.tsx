'use client';

import { useBehaviorTracking } from '@/hooks/useBehaviorTracking';

interface BehaviorTrackingWrapperProps {
  children: React.ReactNode;
}

export default function BehaviorTrackingWrapper({ children }: BehaviorTrackingWrapperProps) {
  // Inicializar el tracking de comportamiento
  useBehaviorTracking();
  
  return <>{children}</>;
}