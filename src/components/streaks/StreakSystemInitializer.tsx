'use client';

import { useEffect } from 'react';
import { initializeLessonCompletionDetector } from '@/lib/lesson-completion-detector';
import { initializeLessonButtonDetector } from '@/lib/lesson-button-detector';
import { initializeTestNotifications } from '@/lib/test-notifications';

/**
 * Inicializa todos los sistemas relacionados con rachas
 */
export default function StreakSystemInitializer() {
  useEffect(() => {
    // Inicializar detector de lecciones completadas (método API)
    initializeLessonCompletionDetector();
    
    // Inicializar detector de botones (método directo) - NUEVO
    initializeLessonButtonDetector();
    
    // Inicializar funciones de prueba en desarrollo
    if (process.env.NODE_ENV === 'development') {
      initializeTestNotifications();
    }
    
    console.log('🏆 Sistema de rachas completamente inicializado (API + Botones)');
  }, []);

  return null;
}