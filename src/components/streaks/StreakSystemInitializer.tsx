'use client';

import { useEffect } from 'react';
import { initializeLessonCompletionDetector } from '@/lib/lesson-completion-detector';
import { initializeLessonButtonDetector } from '@/lib/lesson-button-detector';

/**
 * Inicializa todos los sistemas relacionados con rachas
 */
export default function StreakSystemInitializer() {
  useEffect(() => {
    // Inicializar detector de lecciones completadas (método API)
    initializeLessonCompletionDetector();
    
    // Inicializar detector de botones (método directo) - NUEVO
    initializeLessonButtonDetector();
    
    // Funciones de prueba removidas (archivos eliminados en limpieza)
    
    console.log('🏆 Sistema de rachas completamente inicializado (API + Botones)');
  }, []);

  return null;
}