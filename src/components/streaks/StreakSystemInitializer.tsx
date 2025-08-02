'use client';

import { useEffect } from 'react';
import { initializeLessonCompletionDetector } from '@/lib/lesson-completion-detector';
import { initializeTestNotifications } from '@/lib/test-notifications';

/**
 * Inicializa todos los sistemas relacionados con rachas
 */
export default function StreakSystemInitializer() {
  useEffect(() => {
    // Inicializar detector de lecciones completadas
    initializeLessonCompletionDetector();
    
    // Inicializar funciones de prueba en desarrollo
    if (process.env.NODE_ENV === 'development') {
      initializeTestNotifications();
    }
    
    console.log('🏆 Sistema de rachas completamente inicializado');
  }, []);

  return null;
}