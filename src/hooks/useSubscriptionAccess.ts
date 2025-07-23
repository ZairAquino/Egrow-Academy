import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  currentPeriodEnd?: string;
  isLoading: boolean;
  error?: string;
}

export const useSubscriptionAccess = (): SubscriptionStatus => {
  const { user, isAuthenticated, token } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    hasActiveSubscription: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!isAuthenticated || !user || !token) {
        setSubscriptionStatus({
          hasActiveSubscription: false,
          isLoading: false,
        });
        return;
      }

      try {
        const response = await fetch('/api/auth/subscription-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Incluir cookies
        });

        if (!response.ok) {
          throw new Error('Error al verificar suscripción');
        }

        const data = await response.json();
        
        setSubscriptionStatus({
          hasActiveSubscription: data.hasActiveSubscription,
          subscriptionType: data.subscriptionType,
          currentPeriodEnd: data.currentPeriodEnd,
          isLoading: false,
        });
      } catch (error) {
        console.error('❌ useSubscriptionAccess - Error:', error);
        setSubscriptionStatus({
          hasActiveSubscription: false,
          isLoading: false,
          error: 'Error al verificar suscripción',
        });
      }
    };

    checkSubscriptionStatus();
  }, [isAuthenticated, user, token]);

  return subscriptionStatus;
};

// Hook específico para verificar acceso a un curso
export const useCourseAccess = (courseSlug: string) => {
  const { hasActiveSubscription, isLoading } = useSubscriptionAccess();
  const { token } = useAuth();
  const [courseAccess, setCourseAccess] = useState<{
    hasAccess: boolean;
    isLoading: boolean;
    error?: string;
  }>({
    hasAccess: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkCourseAccess = async () => {
      if (isLoading || !token) return;

      try {
        const response = await fetch(`/api/courses/${courseSlug}/access`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Incluir cookies
        });

        if (!response.ok) {
          throw new Error('Error al verificar acceso al curso');
        }

        const data = await response.json();
        
        setCourseAccess({
          hasAccess: data.hasAccess,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error checking course access:', error);
        setCourseAccess({
          hasAccess: false,
          isLoading: false,
          error: 'Error al verificar acceso al curso',
        });
      }
    };

    checkCourseAccess();
  }, [courseSlug, isLoading, hasActiveSubscription, token]);

  return courseAccess;
}; 