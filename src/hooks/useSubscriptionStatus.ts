import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  membershipLevel: string;
  subscription: any;
  isLoading: boolean;
  error: string | null;
}

export function useSubscriptionStatus() {
  const { user, status, refreshUser } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    hasActiveSubscription: false,
    membershipLevel: 'FREE',
    subscription: null,
    isLoading: true,
    error: null
  });
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const isAuthenticated = status === 'authenticated';

  const checkSubscriptionStatus = useCallback(async () => {
    // Solo verificar una vez por sesión
    if (hasChecked || !isAuthenticated) {
      return;
    }

    try {
      setSubscriptionStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/auth/subscription-status');
      if (response.ok) {
        const data = await response.json();
        
        setSubscriptionStatus({
          hasActiveSubscription: data.hasActiveSubscription,
          membershipLevel: data.membershipLevel || 'FREE',
          subscription: data.subscription,
          isLoading: false,
          error: null
        });

        // Solo actualizar contexto si hay discrepancia
        if (data.hasActiveSubscription && user?.membershipLevel !== 'PREMIUM') {
          console.log('🔄 Actualizando contexto de autenticación...');
          refreshUser();
        }
        
        setHasChecked(true);
      } else {
        setSubscriptionStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Error al verificar suscripción'
        }));
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setSubscriptionStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error de conexión'
      }));
    }
  }, [isAuthenticated, user?.membershipLevel, hasChecked]); // Removemos refreshUser

  // Verificación inicial SOLO UNA VEZ
  useEffect(() => {
    if (isAuthenticated && !hasChecked) {
      checkSubscriptionStatus();
    }
  }, [isAuthenticated, hasChecked]); // Removemos checkSubscriptionStatus

  // Actualizar cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setSubscriptionStatus(prev => ({
        ...prev,
        membershipLevel: user.membershipLevel
      }));
    }
  }, [user]);

  const hasPremiumAccess = subscriptionStatus.hasActiveSubscription || 
                          subscriptionStatus.membershipLevel === 'PREMIUM' ||
                          user?.membershipLevel === 'PREMIUM';

  return {
    ...subscriptionStatus,
    hasPremiumAccess,
    refresh: checkSubscriptionStatus
  };
} 