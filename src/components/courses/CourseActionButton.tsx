'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CourseActionButtonProps {
  courseSlug: string;
  type: 'start' | 'continue' | 'resume';
  className?: string;
  completedLessons?: number;
  totalLessons?: number;
  progressPercentage?: number;
}

export default function CourseActionButton({
  courseSlug,
  type,
  className = '',
  completedLessons = 0,
  totalLessons = 0,
  progressPercentage = 0
}: CourseActionButtonProps) {
  
  const { user } = useAuth();
  
  // Función de redirección que verifica autenticación
  const goToCourseContent = () => {
    console.log(`🎯 Botón clickeado - Usuario logueado: ${!!user}`);
    
    if (!user) {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/${courseSlug}/contenido`;
      console.log(`🔐 Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    // Si el usuario está logueado, ir directamente al contenido
    const contentUrl = `/curso/${courseSlug}/contenido`;
    console.log(`✅ Usuario logueado - Redirigiendo a contenido: ${contentUrl}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = contentUrl;
    }
  };

  // Configuración estática de botones para evitar diferencias de hidratación
  const buttonConfig = {
    start: {
      text: '🎯 Comenzar Curso Gratis',
      baseClass: 'course-action-button course-action-start'
    },
    continue: {
      text: '🚀 Continuar con el curso',
      baseClass: 'course-action-button course-action-continue'
    },
    resume: {
      text: '🔄 Continuar donde lo dejaste',
      baseClass: 'course-action-button course-action-resume'
    }
  };

  const config = buttonConfig[type];

  // Renderizar siempre con las mismas clases CSS para evitar diferencias de hidratación
  return (
    <button
      type="button"
      className={`${config.baseClass} ${className}`}
      onClick={goToCourseContent}
      style={{}} // Estilo vacío para evitar diferencias
    >
      {config.text}
    </button>
  );
}

// Componente de progreso para mostrar información del curso
export function CourseProgressInfo({
  currentLesson,
  totalLessons,
  completedLessons,
  progressPercentage
}: {
  currentLesson: number;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}) {
  return (
    <div className="progress-info-new">
      <p className="progress-text-new">
        📚 <strong>Progreso actual:</strong> Lección {currentLesson + 1} de {totalLessons}
      </p>
      <p className="progress-detail-new">
        {completedLessons} lecciones completadas • {Math.round(progressPercentage)}% del curso
      </p>
    </div>
  );
}