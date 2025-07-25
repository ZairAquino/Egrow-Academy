import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useLogo() {
  const { user, status } = useAuth();

  const logoSrc = useMemo(() => {
    // Si está cargando, usar logo por defecto
    if (status === 'loading') {
      return "/images/logog.png";
    }

    // Si no hay usuario, usar logo gratuito
    if (!user) {
      return "/images/logog.png";
    }

    // Verificar membership level con múltiples condiciones
    const isPremium = user.membershipLevel === 'PREMIUM' || 
                     user.membershipLevel === 'premium' ||
                     user.membershipLevel === 'Premium';

    console.log('Logo Hook - User:', user.email, 'MembershipLevel:', user.membershipLevel, 'IsPremium:', isPremium);

    return isPremium ? "/images/logop.png" : "/images/logog.png";
  }, [user, status]);

  const logoAlt = useMemo(() => {
    if (!user) return "eGrow Academy";
    
    const isPremium = user.membershipLevel === 'PREMIUM' || 
                     user.membershipLevel === 'premium' ||
                     user.membershipLevel === 'Premium';
    
    return isPremium ? "eGrow Academy Premium" : "eGrow Academy";
  }, [user]);

  return {
    logoSrc,
    logoAlt,
    isPremium: user?.membershipLevel === 'PREMIUM' || 
               user?.membershipLevel === 'premium' ||
               user?.membershipLevel === 'Premium',
    isLoading: status === 'loading'
  };
}