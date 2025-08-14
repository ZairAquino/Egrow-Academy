'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAdminAccess(redirectPath: string = '/courses') {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🔒 [useAdminAccess] Status:', status, 'User:', user?.email, 'Role:', user?.role);
    
    // Esperar a que se resuelva la autenticación
    if (status === 'loading') {
      console.log('🔒 [useAdminAccess] Status loading, esperando...');
      return;
    }

    // Si no está autenticado, redirigir al login con redirect parameter
    if (status === 'unauthenticated' || !user) {
      console.log('🔒 [useAdminAccess] Usuario no autenticado, redirigiendo a login');
      const currentPath = window.location.pathname;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
      return;
    }

    // Si está autenticado pero no es admin, redirigir
    if (user.role !== 'ADMIN') {
      console.warn('🔒 [useAdminAccess] Acceso denegado: Usuario no es administrador. Role actual:', user.role);
      router.push(redirectPath);
      return;
    }
    
    console.log('✅ [useAdminAccess] Acceso ADMIN concedido para:', user.email);
  }, [user, status, router, redirectPath]);

  return {
    isAdmin: user?.role === 'ADMIN',
    isLoading: status === 'loading',
    user
  };
}

export function useAdminCheck() {
  const { user } = useAuth();
  
  return {
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',
    hasRole: (role: 'ADMIN' | 'USER') => user?.role === role
  };
}