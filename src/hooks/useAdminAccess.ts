'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAdminAccess(redirectPath: string = '/courses') {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Esperar a que se resuelva la autenticación
    if (status === 'loading') {
      return;
    }

    // Si no está autenticado, redirigir al login
    if (status === 'unauthenticated' || !user) {
      router.push('/login');
      return;
    }

    // Si está autenticado pero no es admin, redirigir
    if (user.role !== 'ADMIN') {
      console.warn('Acceso denegado: Usuario no es administrador');
      router.push(redirectPath);
      return;
    }
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