'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  initializeUTMTracking, 
  getStoredUTMData, 
  trackUTMConversion,
  UTMConversionData 
} from '@/lib/utm-tracking';

export default function UTMTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Inicializar tracking UTM cuando cambie la URL
    initializeUTMTracking();
  }, [pathname, searchParams]);

  // Función para trackear conversiones (disponible globalmente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Hacer disponible la función de tracking UTM globalmente
      (window as any).trackUTMConversion = (
        conversionData: UTMConversionData
      ) => {
        const utmData = getStoredUTMData();
        if (utmData) {
          trackUTMConversion(conversionData, utmData);
        }
      };

      // Función para trackear vista de curso
      (window as any).trackUTMCourseView = (courseId: string, courseName: string) => {
        const utmData = getStoredUTMData();
        if (utmData) {
          trackUTMConversion({
            conversion_type: 'course_view',
            course_id: courseId,
            course_name: courseName,
          }, utmData);
        }
      };

      // Función para trackear inscripción a curso
      (window as any).trackUTMCourseEnroll = (courseId: string, courseName: string, value?: number) => {
        const utmData = getStoredUTMData();
        if (utmData) {
          trackUTMConversion({
            conversion_type: 'course_enroll',
            course_id: courseId,
            course_name: courseName,
            value: value || 97, // Valor por defecto del curso
            currency: 'USD',
          }, utmData);
        }
      };

      // Función para trackear pago
      (window as any).trackUTMPayment = (courseId: string, courseName: string, value: number) => {
        const utmData = getStoredUTMData();
        if (utmData) {
          trackUTMConversion({
            conversion_type: 'payment',
            course_id: courseId,
            course_name: courseName,
            value: value,
            currency: 'USD',
          }, utmData);
        }
      };

      console.log('🎯 [UTM Tracker] Funciones de tracking UTM disponibles globalmente');
    }
  }, []);

  // Trackear automáticamente vista de página según la ruta
  useEffect(() => {
    const utmData = getStoredUTMData();
    
    if (utmData && pathname) {
      // Trackear vista de página específica según la ruta
      if (pathname.includes('/curso/monetiza-voz-ia-elevenlabs')) {
        (window as any).trackUTMCourseView?.('monetiza-voz-ia-elevenlabs', 'Monetiza tu Voz con IA');
      } else if (pathname === '/payment') {
        (window as any).trackUTMPayment?.('monetiza-voz-ia-elevenlabs', 'Monetiza tu Voz con IA', 97);
      }
    }
  }, [pathname]);

  return null; // Componente invisible
}