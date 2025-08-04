import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from './useSubscriptionStatus';

interface Course {
  id: string;
  title: string;
  category: string;
  isFree: boolean;
  requiresAuth: boolean;
}

export function useCourseAccess() {
  const { user, status } = useAuth();
  const { hasPremiumAccess } = useSubscriptionStatus();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const isAuthenticated = status === 'authenticated';

  const canAccessCourse = (course: Course): boolean => {
    if (course.isFree) {
      return true;
    }
    if (course.requiresAuth && !isAuthenticated) {
      return false;
    }
    if (course.category === 'cursos-cortos') {
      return isAuthenticated;
    }
    // Usar el hook de suscripción que maneja automáticamente la verificación
    return hasPremiumAccess;
  };

  const handleCourseAccess = (course: Course): boolean => {
    if (canAccessCourse(course)) {
      return true;
    }
    
    if (course.category !== 'cursos-cortos' && !hasPremiumAccess) {
      // Si no tiene acceso premium, mostrar modal de suscripción o redirigir a la página de suscripción
      if (!isAuthenticated) {
        // Usuario no registrado: redirigir a la página de suscripción para que vea los planes
        window.location.href = '/subscription';
        return false;
      } else {
        // Usuario registrado pero sin premium: mostrar modal
        setSelectedCourse(course);
        setShowSubscriptionModal(true);
        return false;
      }
    }
    
    if (!isAuthenticated) {
      // Para cursos que requieren login pero no son premium, redirigir al login
      window.location.href = '/login';
      return false;
    }
    
    return false;
  };

  const closeSubscriptionModal = () => {
    setShowSubscriptionModal(false);
    setSelectedCourse(null);
  };

  const getAccessMessage = (course: Course): string => {
    if (course.isFree) {
      return 'Gratis';
    }
    if (course.category === 'cursos-cortos') {
      return isAuthenticated ? 'Acceso Libre' : 'Requiere Login';
    }
    return hasPremiumAccess ? 'Premium' : 'Requiere Premium';
  };

  const getAccessBadgeColor = (course: Course): string => {
    if (course.isFree) {
      return 'bg-green-100 text-green-800';
    }
    if (course.category === 'cursos-cortos') {
      return isAuthenticated ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
    }
    return hasPremiumAccess ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800';
  };

  return {
    canAccessCourse,
    handleCourseAccess,
    showSubscriptionModal,
    selectedCourse,
    closeSubscriptionModal,
    getAccessMessage,
    getAccessBadgeColor,
    isAuthenticated,
    userMembershipLevel: user?.membershipLevel
  };
} 