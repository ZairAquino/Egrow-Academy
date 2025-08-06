'use client';

import { useEffect } from 'react';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';
import { useAuth } from '@/contexts/AuthContext';

interface FacebookPixelTrackerProps {
  // Eventos automáticos
  trackPageView?: boolean;
  trackUserLogin?: boolean;
  trackUserRegistration?: boolean;
  
  // Datos específicos de la página
  pageData?: {
    content_name?: string;
    content_category?: string;
    content_type?: string;
    content_ids?: string[];
    value?: number;
    currency?: string;
  };
  
  // Eventos personalizados
  customEvents?: Array<{
    event: string;
    data?: Record<string, any>;
    delay?: number; // Delay en ms antes de ejecutar
  }>;
}

export default function FacebookPixelTracker({
  trackPageView = true,
  trackUserLogin = false,
  trackUserRegistration = false,
  pageData = {},
  customEvents = []
}: FacebookPixelTrackerProps) {
  const { trackEvent, trackLogin, trackRegistration, isUserLoggedIn } = useFacebookPixel();
  const { user } = useAuth();

  useEffect(() => {
    // Track PageView automáticamente
    if (trackPageView) {
      trackEvent('PageView', pageData);
    }
  }, [trackPageView, pageData, trackEvent]);

  useEffect(() => {
    // Track login automáticamente si el usuario está logueado
    if (trackUserLogin && isUserLoggedIn && user) {
      trackLogin();
    }
  }, [trackUserLogin, isUserLoggedIn, user, trackLogin]);

  useEffect(() => {
    // Track registration automáticamente si es un usuario nuevo
    if (trackUserRegistration && isUserLoggedIn && user) {
      // Solo trackear si el usuario se registró recientemente
      const userCreated = new Date(user.createdAt);
      const now = new Date();
      const timeDiff = now.getTime() - userCreated.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      // Si el usuario se registró en los últimos 5 minutos, trackear
      if (minutesDiff < 5) {
        trackRegistration(user.email);
      }
    }
  }, [trackUserRegistration, isUserLoggedIn, user, trackRegistration]);

  useEffect(() => {
    // Ejecutar eventos personalizados
    customEvents.forEach(({ event, data = {}, delay = 0 }) => {
      const timeoutId = setTimeout(() => {
        trackEvent(event as any, {
          ...pageData,
          ...data
        });
      }, delay);

      return () => clearTimeout(timeoutId);
    });
  }, [customEvents, pageData, trackEvent]);

  // Este componente no renderiza nada
  return null;
}

// Componente específico para tracking de cursos
export function CourseTracker({ 
  courseId, 
  courseName, 
  courseValue = 0 
}: { 
  courseId: string; 
  courseName: string; 
  courseValue?: number; 
}) {
  const { trackCourseView } = useFacebookPixel();

  useEffect(() => {
    trackCourseView({
      course_id: courseId,
      course_name: courseName
    });
  }, [courseId, courseName, trackCourseView]);

  return null;
}

// Componente específico para tracking de lecciones
export function LessonTracker({ 
  courseId, 
  lessonId, 
  lessonName, 
  progressPercentage 
}: { 
  courseId: string; 
  lessonId: string; 
  lessonName: string; 
  progressPercentage: number; 
}) {
  const { trackLessonComplete } = useFacebookPixel();

  useEffect(() => {
    if (progressPercentage >= 100) {
      trackLessonComplete({
        course_id: courseId,
        lesson_id: lessonId,
        lesson_name: lessonName,
        progress_percentage: progressPercentage
      });
    }
  }, [courseId, lessonId, lessonName, progressPercentage, trackLessonComplete]);

  return null;
}

// Componente específico para tracking de certificados
export function CertificateTracker({ 
  courseId, 
  courseName, 
  certificateId 
}: { 
  courseId: string; 
  courseName: string; 
  certificateId: string; 
}) {
  const { trackCertificateEarned } = useFacebookPixel();

  useEffect(() => {
    trackCertificateEarned({
      course_id: courseId,
      course_name: courseName,
      certificate_id: certificateId
    });
  }, [courseId, courseName, certificateId, trackCertificateEarned]);

  return null;
}

// Componente específico para tracking de webinars
export function WebinarTracker({ 
  webinarId, 
  webinarName 
}: { 
  webinarId: string; 
  webinarName: string; 
}) {
  const { trackWebinarRegistration } = useFacebookPixel();

  useEffect(() => {
    trackWebinarRegistration({
      webinar_id: webinarId,
      webinar_name: webinarName
    });
  }, [webinarId, webinarName, trackWebinarRegistration]);

  return null;
}

// Componente específico para tracking de recursos
export function ResourceTracker({ 
  resourceId, 
  resourceName, 
  resourceType 
}: { 
  resourceId: string; 
  resourceName: string; 
  resourceType: string; 
}) {
  const { trackResourceDownload } = useFacebookPixel();

  useEffect(() => {
    trackResourceDownload({
      resource_id: resourceId,
      resource_name: resourceName,
      resource_type: resourceType
    });
  }, [resourceId, resourceName, resourceType, trackResourceDownload]);

  return null;
} 