'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';
import AchievementNotification from '@/components/ui/AchievementNotification';

export default function ContenidoVideosProfesionalesIAPage() {
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  
  // Estados para notificaciones de logros
  const [showModuleNotification, setShowModuleNotification] = useState(false);
  const [showCourseNotification, setShowCourseNotification] = useState(false);
  const [achievementData, setAchievementData] = useState({
    type: 'module' as 'module' | 'course',
    title: '',
    message: '',
    stats: {
      completed: 0,
      total: 0,
      percentage: 0
    }
  });
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    progress,
    isLoading,
    progressPercentage,
    saveProgress,
    markLessonComplete,
    setCurrentLesson
  } = useCourseProgress('videos-profesionales-ia', isEnrolled);

  const courseData = {
    id: 'videos-profesionales-ia',
    title: 'Videos Profesionales con IA',
    description: 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.',
    lessons: [
      // MÓDULO 1 - Fundamentos de Videos con IA
      {
        id: 'vpc-mod1-les1',
        moduleId: 1,
        title: '1.1 Introducción: El poder de los videos con IA',
        duration: '12 min',
        type: 'video',
        description: 'Descubre cómo la inteligencia artificial está revolucionando la creación de contenido audiovisual',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp1',
        content: `
          <h2>1.1 Introducción: El poder de los videos con IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">La inteligencia artificial ha democratizado la creación de videos profesionales, permitiendo a cualquier persona producir contenido de alta calidad sin necesidad de equipos costosos o conocimientos técnicos avanzados.</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>¿Qué aprenderás en este curso?</strong></p>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Crear videos con avatares digitales ultra-realistas</li>
              <li style="margin: 0.5rem 0;">✓ Generar voces naturales en múltiples idiomas</li>
              <li style="margin: 0.5rem 0;">✓ Editar videos automáticamente con IA</li>
              <li style="margin: 0.5rem 0;">✓ Aplicar efectos especiales sin experiencia previa</li>
              <li style="margin: 0.5rem 0;">✓ Optimizar contenido para diferentes plataformas</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">La revolución del contenido audiovisual</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;"><strong>Reducción de costos:</strong> Hasta 90% menos que producción tradicional</li>
              <li style="margin: 0.5rem 0;"><strong>Velocidad:</strong> Crea videos en minutos, no días</li>
              <li style="margin: 0.5rem 0;"><strong>Escalabilidad:</strong> Produce contenido en masa personalizado</li>
              <li style="margin: 0.5rem 0;"><strong>Accesibilidad:</strong> No necesitas cámaras, estudios ni actores</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod1-les2',
        moduleId: 1,
        title: '1.2 Las mejores herramientas de IA para videos',
        duration: '18 min',
        type: 'video',
        description: 'Conoce y compara las principales herramientas: Synthesia, D-ID, HeyGen, RunwayML',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp2',
        content: `
          <h2>1.2 Las mejores herramientas de IA para videos</h2>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Synthesia - El líder en avatares digitales</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ +150 avatares digitales diversos</li>
              <li style="margin: 0.5rem 0;">✓ +120 idiomas y acentos</li>
              <li style="margin: 0.5rem 0;">✓ Sincronización labial perfecta</li>
              <li style="margin: 0.5rem 0;">✓ Plantillas profesionales incluidas</li>
              <li style="margin: 0.5rem 0;">✓ Precio: Desde $30/mes</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">D-ID - Animación facial avanzada</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Convierte fotos en videos hablantes</li>
              <li style="margin: 0.5rem 0;">✓ Expresiones faciales naturales</li>
              <li style="margin: 0.5rem 0;">✓ API para desarrolladores</li>
              <li style="margin: 0.5rem 0;">✓ Ideal para presentadores personalizados</li>
              <li style="margin: 0.5rem 0;">✓ Precio: Desde $5.9/mes</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod1-les3',
        moduleId: 1,
        title: '1.3 Casos de uso y aplicaciones prácticas',
        duration: '15 min',
        type: 'video',
        description: 'Videos educativos, marketing, presentaciones corporativas y más',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp3',
        content: `
          <h2>1.3 Casos de uso y aplicaciones prácticas</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Los videos con IA tienen aplicaciones en prácticamente todas las industrias. Veamos los casos de uso más rentables y efectivos.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Marketing y Publicidad</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Anuncios personalizados por segmento</li>
              <li style="margin: 0.5rem 0;">✓ Videos de producto en múltiples idiomas</li>
              <li style="margin: 0.5rem 0;">✓ Testimoniales con avatares de marca</li>
              <li style="margin: 0.5rem 0;">✓ Contenido para redes sociales</li>
            </ul>
          </div>
        `
      },
      
      // MÓDULO 2 - Avatares y Presentadores
      {
        id: 'vpc-mod2-les1',
        moduleId: 2,
        title: '2.1 Creación de avatares digitales realistas',
        duration: '20 min',
        type: 'lab',
        description: 'Aprende a crear y personalizar avatares digitales con Synthesia y D-ID',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp5',
        content: `
          <h2>2.1 Creación de avatares digitales realistas</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Los avatares digitales son la clave para crear videos escalables y profesionales sin necesidad de grabaciones físicas.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Trabajando con Synthesia</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>Configuración inicial:</strong></p>
            <ol style="margin: 0 0 1rem 1.5rem; color: #475569; line-height: 1.7;">
              <li style="margin: 0.75rem 0;">Selecciona avatar por industria y demografía</li>
              <li style="margin: 0.75rem 0;">Ajusta vestimenta y fondo</li>
              <li style="margin: 0.75rem 0;">Configura gestos y expresiones</li>
              <li style="margin: 0.75rem 0;">Define velocidad de habla y pausas</li>
            </ol>
          </div>
        `
      },
      {
        id: 'vpc-mod2-les2',
        moduleId: 2,
        title: '2.2 Sincronización labial y expresiones faciales',
        duration: '16 min',
        type: 'video',
        description: 'Técnicas avanzadas para lograr naturalidad en tus avatares',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp6',
        content: `
          <h2>2.2 Sincronización labial y expresiones faciales</h2>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Principios de sincronización labial</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Correspondencia fonética precisa</li>
              <li style="margin: 0.5rem 0;">✓ Timing natural de movimientos</li>
              <li style="margin: 0.5rem 0;">✓ Coordinación con énfasis vocal</li>
              <li style="margin: 0.5rem 0;">✓ Pausas y respiraciones realistas</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod2-les3',
        moduleId: 2,
        title: '2.3 Voces con IA: ElevenLabs y alternativas',
        duration: '14 min',
        type: 'lab',
        description: 'Genera voces naturales y profesionales para tus videos',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp7',
        content: `
          <h2>2.3 Voces con IA: ElevenLabs y alternativas</h2>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">ElevenLabs - El estándar de oro</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>Características principales:</strong></p>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Clonación de voz en 1 minuto</li>
              <li style="margin: 0.5rem 0;">✓ 29 idiomas con acentos naturales</li>
              <li style="margin: 0.5rem 0;">✓ Control de emociones y tono</li>
              <li style="margin: 0.5rem 0;">✓ API para automatización</li>
            </ul>
          </div>
        `
      },
      
      // MÓDULO 3 - Edición y Postproducción
      {
        id: 'vpc-mod3-les1',
        moduleId: 3,
        title: '3.1 Edición automatizada con RunwayML',
        duration: '22 min',
        type: 'lab',
        description: 'Domina las herramientas de edición potenciadas por IA',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp8',
        content: `
          <h2>3.1 Edición automatizada con RunwayML</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">RunwayML revoluciona la edición de video con más de 30 herramientas de IA que automatizan tareas complejas en segundos.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Herramientas esenciales de RunwayML</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ <strong>Green Screen:</strong> Elimina fondos sin pantalla verde</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Inpainting:</strong> Borra objetos no deseados</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Super Slow-Mo:</strong> Convierte 30fps a 240fps</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Scene Detection:</strong> Corta automáticamente por escenas</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Motion Tracking:</strong> Sigue objetos automáticamente</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod3-les2',
        moduleId: 3,
        title: '3.2 Efectos especiales y corrección de color con IA',
        duration: '18 min',
        type: 'video',
        description: 'Aplica efectos profesionales sin experiencia previa',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp9',
        content: `
          <h2>3.2 Efectos especiales y corrección de color con IA</h2>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Corrección de color automática</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ <strong>Balance de blancos:</strong> Ajuste automático por escena</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Gradación cinematográfica:</strong> LUTs profesionales con IA</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Matching de color:</strong> Iguala tonos entre tomas</li>
              <li style="margin: 0.5rem 0;">✓ <strong>HDR conversion:</strong> SDR a HDR automático</li>
            </ul>
          </div>
        `
      },
      
      // MÓDULO 4 - Proyecto Final
      {
        id: 'vpc-mod4-les1',
        moduleId: 4,
        title: '4.1 Proyecto: Video promocional completo',
        duration: '30 min',
        type: 'project',
        description: 'Crea un video promocional profesional de principio a fin',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp11',
        content: `
          <h2>4.1 Proyecto: Video promocional completo</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;"><strong>Objetivo:</strong> Crear un video promocional de 60-90 segundos para un producto o servicio real, aplicando todas las técnicas aprendidas.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Fase 1: Pre-producción (10 min)</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ol style="margin: 0; color: #475569; line-height: 1.7; padding-left: 1.5rem;">
              <li style="margin: 0.75rem 0;">Define objetivo y audiencia target</li>
              <li style="margin: 0.75rem 0;">Escribe guión con estructura AIDA</li>
              <li style="margin: 0.75rem 0;">Crea storyboard básico (6-8 escenas)</li>
              <li style="margin: 0.75rem 0;">Selecciona música y estilo visual</li>
            </ol>
          </div>
        `
      },
      {
        id: 'vpc-mod4-les2',
        moduleId: 4,
        title: '4.2 Monetización y distribución de contenido',
        duration: '25 min',
        type: 'video',
        description: 'Estrategias para monetizar tus videos y llegar a tu audiencia',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp12',
        content: `
          <h2>4.2 Monetización y distribución de contenido</h2>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Modelos de monetización</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ <strong>Servicios de video:</strong> $500-5000 por proyecto</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Suscripciones:</strong> Paquetes mensuales de contenido</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Licencias:</strong> Vende videos en stock platforms</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Cursos:</strong> Enseña tus técnicas online</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Agencia:</strong> Escala con equipo y sistemas</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod4-les3',
        moduleId: 4,
        title: '4.3 Casos de éxito y siguientes pasos',
        duration: '20 min',
        type: 'video',
        description: 'Inspira tu carrera con casos reales y planifica tu futuro',
        videoUrl: 'https://www.youtube.com/watch?v=example-vp13',
        content: `
          <h2>4.3 Casos de éxito y siguientes pasos</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Conoce casos reales de éxito y planifica tu camino hacia el dominio de los videos profesionales con IA.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Casos de éxito</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ <strong>Startup EdTech:</strong> Redujo costos de producción 85%</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Agencia de Marketing:</strong> Incrementó capacidad 300%</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Creator Individual:</strong> $50K/mes con videos IA</li>
              <li style="margin: 0.5rem 0;">✓ <strong>Empresa Fortune 500:</strong> Contenido en 25 idiomas</li>
            </ul>
          </div>
        `
      }
    ]
  };

  // Estados y funciones necesarias para replicar exactamente el comportamiento
  const isModuleCompleted = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    if (moduleLessons.length === 0) return false;
    
    return moduleLessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };

  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const completedCount = moduleLessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length;
    
    return {
      completed: completedCount,
      total: moduleLessons.length,
      percentage: moduleLessons.length > 0 ? Math.round((completedCount / moduleLessons.length) * 100) : 0
    };
  };

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    // En este curso, todas las lecciones son accesibles (navegación libre)
    return true;
  };

  const getLessonStatus = (lessonIndex: number, lessonId: string) => {
    if (lessonIndex === progress.currentLesson) {
      return '▶️'; // Lección actual
    }
    if (isLessonCompleted(lessonId)) {
      return '✅'; // Completada
    }
    if (!isLessonAccessible(lessonIndex)) {
      return '🔒'; // Bloqueada
    }
    return '⭕'; // Disponible
  };

  const handleManualLessonChange = (lessonIndex: number) => {
    if (isLessonAccessible(lessonIndex)) {
      setCurrentLesson(lessonIndex);
    }
  };

  const handlePreviousLesson = () => {
    if (progress.currentLesson > 0) {
      setCurrentLesson(progress.currentLesson - 1);
    }
  };

  const handleNextLesson = () => {
    if (progress.currentLesson < courseData.lessons.length - 1) {
      setCurrentLesson(progress.currentLesson + 1);
    }
  };

  const handleCompleteCurrentLesson = async () => {
    const currentLessonData = courseData.lessons[progress.currentLesson];
    if (currentLessonData && !progress.completedLessons.includes(currentLessonData.id)) {
      await markLessonComplete(currentLessonData.id);
    }
  };

  const handleCompleteModule = async (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const currentLessonData = courseData.lessons[progress.currentLesson];
    
    // Completar la lección actual si no está completada
    if (currentLessonData && !progress.completedLessons.includes(currentLessonData.id)) {
      await markLessonComplete(currentLessonData.id);
    }
  };

  const isLastLessonOfModule = (lessonId: string, moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const lastLesson = moduleLessons[moduleLessons.length - 1];
    return lastLesson?.id === lessonId;
  };

  const canCompleteModuleWithPrerequisites = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const currentLessonData = courseData.lessons[progress.currentLesson];
    
    // Verificar que todas las lecciones del módulo estén completadas excepto la actual
    const otherLessons = moduleLessons.filter(lesson => lesson.id !== currentLessonData?.id);
    return otherLessons.every(lesson => progress.completedLessons.includes(lesson.id));
  };

  const getModuleTitle = (moduleId: number) => {
    switch (moduleId) {
      case 1: return 'MÓDULO 1: Fundamentos de Videos con IA';
      case 2: return 'MÓDULO 2: Avatares y Presentadores';
      case 3: return 'MÓDULO 3: Edición y Postproducción';
      case 4: return 'MÓDULO 4: Proyecto Final';
      default: return `MÓDULO ${moduleId}`;
    }
  };

  const handleReturnToCourse = async () => {
    setIsSaving(true);
    try {
      const currentLessonData = courseData.lessons[progress.currentLesson];
      if (currentLessonData) {
        await saveProgress(
          progress.currentLesson,
          progress.completedLessons,
          currentLessonData.id,
          currentLessonData.title,
          'exit',
          1
        );
      }
      router.push('/curso/videos-profesionales-ia');
    } catch (error) {
      console.error('Error guardando progreso al salir:', error);
      router.push('/curso/videos-profesionales-ia');
    } finally {
      setIsSaving(false);
    }
  };

  // Efecto para verificar inscripción
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        console.log('🔍 [DEBUG] Verificando inscripción para curso:', courseData.id);
        const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`);
        console.log('🔍 [DEBUG] Respuesta del servidor:', { status: response.status, ok: response.ok });
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 [DEBUG] Datos de inscripción:', data);
          
          if (!data.isEnrolled) {
            console.log('🔍 [DEBUG] Usuario no inscrito, inscribiendo automáticamente...');
            // Intentar inscribir automáticamente
            const enrollResponse = await fetch('/api/courses/enroll', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ courseId: courseData.id }),
              credentials: 'include',
            });
            
            if (enrollResponse.ok) {
              console.log('✅ [DEBUG] Usuario inscrito automáticamente');
              setIsEnrolled(true);
            } else {
              console.error('❌ [DEBUG] Error en inscripción automática');
              router.push('/curso/videos-profesionales-ia');
              return;
            }
          } else {
            setIsEnrolled(data.isEnrolled);
          }
        } else {
          // Si el error es de autenticación, redirigir al login
          if (response.status === 401) {
            console.log('🔍 [DEBUG] Error 401 - Token expirado o inválido, redirigiendo al login');
            router.push('/login?redirect=/curso/videos-profesionales-ia/contenido');
            return;
          }
          
          // Para otros errores, intentar inscripción directa
          console.log('🔍 [DEBUG] Error no es 401, intentando inscripción directa...');
          try {
            const directEnrollResponse = await fetch('/api/courses/enroll', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ courseId: courseData.id }),
              credentials: 'include',
            });
            
            if (directEnrollResponse.ok) {
              console.log('✅ [DEBUG] Inscripción directa exitosa');
              setIsEnrolled(true);
            } else {
              console.error('❌ [DEBUG] Error en inscripción directa');
              router.push('/curso/videos-profesionales-ia');
              return;
            }
          } catch (directEnrollError) {
            console.error('❌ [DEBUG] Error en solicitud de inscripción directa:', directEnrollError);
            router.push('/curso/videos-profesionales-ia');
            return;
          }
        }
      } catch (error) {
        console.error('❌ [DEBUG] Error en verificación de inscripción:', error);
        router.push('/curso/videos-profesionales-ia');
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    if (user) {
      checkEnrollment();
    } else {
      setIsCheckingEnrollment(false);
    }
  }, [user, router]);

  // Efecto para expandir módulos por defecto
  useEffect(() => {
    setExpandedModules(new Set([1, 2, 3, 4]));
  }, []);

  if (isCheckingEnrollment || isLoading) {
    return <div className="loading-container" suppressHydrationWarning>Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/videos-profesionales-ia')}>
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar  />
      
      <main className="main-content">
        <section className="course-header pt-14 md:pt-[95px]">
          <div className="container">
            <div className="course-header-content">
              <div className="course-breadcrumb">
                <div className="breadcrumb-container">
                  <a href="/" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🏠</span>
                    <span className="breadcrumb-text">Inicio</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/courses" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Cursos</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/curso/videos-profesionales-ia" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎬</span>
                    <span className="breadcrumb-text">Videos Profesionales con IA</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item active">
                    <span className="breadcrumb-icon">📖</span>
                    <span className="breadcrumb-text">Contenido</span>
                  </span>
                </div>
              </div>
              
              <div className="header-main">
                <div className="header-content">
                  <h1 className="course-title">{courseData.title}</h1>
                  
                  <div className="header-actions">
                    <button 
                      className="btn btn-exit-course btn-save-exit"
                      onClick={handleReturnToCourse}
                      disabled={isSaving}
                    >
                      {isSaving ? '💾 Guardando...' : '🏠 Salir'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              <div className="main-content-area">
                <div className="current-lesson">
                  <div className="lesson-header">
                    <h2>Lección {progress.currentLesson + 1}: {courseData.lessons[progress.currentLesson].title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-type">{courseData.lessons[progress.currentLesson].type}</span>
                      <span className="lesson-duration">{courseData.lessons[progress.currentLesson].duration}</span>
                    </div>
                  </div>
                  
                  <div className="lesson-content">
                    {/* Contenido de la lección */}
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: courseData.lessons[progress.currentLesson].content 
                      }} 
                    />
                  </div>
                  
                  <div className="lesson-actions">
                    <div className="lesson-buttons">
                      <button 
                        className="btn btn-primary"
                        onClick={handlePreviousLesson}
                        disabled={progress.currentLesson === 0}
                      >
                        ← Lección Anterior
                      </button>
                      
                      {/* Botón siguiente - navegación libre */}
                      {progress.currentLesson < courseData.lessons.length - 1 && (
                        <button 
                          className="btn btn-primary"
                          onClick={handleNextLesson}
                        >
                          Siguiente lección →
                        </button>
                      )}
                      
                      {/* Lógica de botones basada en si es la última lección del módulo */}
                      {(() => {
                        const currentLesson = courseData.lessons[progress.currentLesson];
                        const currentModuleId = currentLesson.moduleId;
                        const isLastLesson = isLastLessonOfModule(currentLesson.id, currentModuleId);
                        const isCurrentLessonCompleted = progress.completedLessons.includes(currentLesson.id);
                        const isModuleAlreadyCompleted = isModuleCompleted(currentModuleId);
                        
                        if (isModuleAlreadyCompleted) {
                          // Módulo ya completado - no mostrar botones de completar
                          return null;
                        }
                        
                        if (isLastLesson) {
                          // Última lección del módulo - solo mostrar botón "Completar Módulo"
                          const canComplete = canCompleteModuleWithPrerequisites(currentModuleId);
                          return (
                            <button 
                              className={`btn btn-large ${canComplete ? 'btn-success' : 'btn-secondary'}`}
                              onClick={() => handleCompleteModule(currentModuleId)}
                              disabled={!canComplete}
                              style={{ 
                                fontSize: '1.1em', 
                                padding: '12px 24px',
                                opacity: canComplete ? 1 : 0.6,
                                cursor: canComplete ? 'pointer' : 'not-allowed'
                              }}
                              title={canComplete ? 'Completar módulo' : 'Completa todas las lecciones anteriores del módulo primero'}
                            >
                              🏆 Completar {getModuleTitle(currentModuleId).split(':')[0]}
                            </button>
                          );
                        } else {
                          // Lección regular - mostrar botón "Completar Lección" si no está completada
                          return !isCurrentLessonCompleted && (
                            <button 
                              className="btn btn-primary"
                              onClick={handleCompleteCurrentLesson}
                            >
                              ✅ Completar Lección
                            </button>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-sidebar">
                <div className="lessons-navigation">
                  <div className="navigation-header">
                    <h3>Lecciones del Curso</h3>
                    <div className="progress-indicator">
                      <span className="progress-text">
                        {progress.completedLessons.length} de {courseData.lessons.length} completadas
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(progress.completedLessons.length / courseData.lessons.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {isEnrolled && (
                    <div className="course-guidance">
                      <p className="guidance-text">
                        💡 <strong>Navegación Libre:</strong> Puedes navegar entre todas las lecciones. Para completar el curso, debes marcar como completadas todas las lecciones de todos los módulos.
                      </p>
                    </div>
                  )}
                  <div className="lessons-list">
                    {[1, 2, 3, 4].map(moduleId => {
                      const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
                      const moduleProgress = getModuleProgress(moduleId);
                      const isModuleComplete = isModuleCompleted(moduleId);
                      
                      return (
                        <div key={moduleId} className="module-group">
                          <div 
                            className={`module-header ${isModuleComplete ? 'completed' : ''} ${expandedModules.has(moduleId) ? 'expanded' : ''}`}
                            onClick={() => toggleModuleExpansion(moduleId)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="module-title">
                              <span className="module-icon">
                                {isModuleComplete ? '✅' : '📚'}
                              </span>
                              <span>MÓDULO {moduleId}</span>
                              <span className="expand-icon">
                                {expandedModules.has(moduleId) ? '▼' : '▶'}
                              </span>
                            </div>
                            <div className="module-progress">
                              <span className="progress-text">
                                {moduleProgress.completed}/{moduleProgress.total}
                              </span>
                              <div className="progress-bar-mini">
                                <div 
                                  className="progress-fill-mini" 
                                  style={{ width: `${moduleProgress.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {expandedModules.has(moduleId) && (
                            <div className="module-lessons">
                              {moduleLessons.map((lesson, index) => {
                              const globalIndex = courseData.lessons.findIndex(l => l.id === lesson.id);
                              return (
                                <div 
                                  key={lesson.id} 
                                  className={`lesson-item ${globalIndex === progress.currentLesson ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${!isLessonAccessible(globalIndex) ? 'locked' : ''}`}
                                  onClick={() => {
                                    if (isLessonAccessible(globalIndex)) {
                                      handleManualLessonChange(globalIndex);
                                    }
                                  }}
                                >
                                  <div className="lesson-number">{moduleId}.{index + 1}</div>
                                  <div className="lesson-content">
                                    <h4>{lesson.title}</h4>
                                    <div className="lesson-meta">
                                      <span className="lesson-type">{lesson.type}</span>
                                      <span className="lesson-duration">{lesson.duration}</span>
                                    </div>
                                  </div>
                                  <div className="lesson-status">
                                    {getLessonStatus(globalIndex, lesson.id)}
                                  </div>
                                </div>
                              );
                            })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Botón de completar curso */}
                  {progress.completedLessons.length === courseData.lessons.length && (
                    <div className="complete-course-section">
                      <div className="completion-message">
                        🎉 ¡Has completado todas las lecciones!
                      </div>
                      <button 
                        className="btn btn-success btn-complete-course"
                        onClick={() => router.push(`/certificate/${courseData.id}`)}
                      >
                        🏆 Obtener Certificado
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Notificaciones de logros */}
      {showModuleNotification && (
        <AchievementNotification 
          type="module"
          title={achievementData.title}
          message={achievementData.message}
          stats={achievementData.stats}
        />
      )}
      
      {showCourseNotification && (
        <AchievementNotification 
          type="course"
          title={achievementData.title}
          message={achievementData.message}
          stats={achievementData.stats}
        />
      )}

      <Footer />
      
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: #f8fafc;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #6b7280;
        }

        .enrollment-required {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
          padding: 2rem;
        }

        .enrollment-required h2 {
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .enrollment-required p {
          margin-bottom: 2rem;
          color: #6b7280;
        }

        .enrollment-required button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .enrollment-required button:hover {
          background: #2563eb;
        }

        .main-content {
          min-height: 100vh;
        }

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
          position: relative;
          overflow: hidden;
        }

        .course-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .course-header-content {
          position: relative;
          z-index: 2;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-breadcrumb {
          margin-bottom: 2rem;
        }

        .breadcrumb-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .breadcrumb-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .breadcrumb-item.active {
          color: white;
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
        }

        .breadcrumb-icon {
          font-size: 1rem;
        }

        .breadcrumb-text {
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          margin: 0 0.25rem;
        }

        .header-main {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
          text-align: left;
          width: 100%;
        }

        .course-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-align: left;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
        }

        .btn-exit-course {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: 2px solid #dc2626;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-exit-course:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-color: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-exit-course:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .course-content {
          padding: 3rem 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .current-lesson {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .lesson-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .lesson-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .lesson-type {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .lesson-content {
          line-height: 1.7;
          color: #374151;
        }

        .lesson-content h2 {
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
        }

        .lesson-content h3 {
          color: #1f2937;
          margin: 1.25rem 0 0.75rem 0;
        }

        .lesson-content ul, .lesson-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .lesson-content li {
          margin: 0.5rem 0;
        }

        .lesson-content pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .lesson-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .lesson-actions {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f3f4f6;
        }

        .lesson-buttons {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .lessons-navigation {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
        }

        .navigation-header {
          margin-bottom: 1.5rem;
        }

        .lessons-navigation h3 {
          margin: 0 0 0.75rem 0;
          color: #1f2937;
        }

        .progress-indicator {
          margin-bottom: 1rem;
        }

        .progress-text {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .course-guidance {
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }

        .guidance-text {
          margin: 0;
          font-size: 0.8rem;
          color: #1e40af;
          line-height: 1.5;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .module-group {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .module-header {
          background: #f9fafb;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }

        .module-header:hover {
          background: #f3f4f6;
        }

        .module-header.completed {
          background: #ecfdf5;
          border-color: #d1fae5;
        }

        .module-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.8rem;
          color: #374151;
        }

        .module-icon {
          font-size: 1rem;
        }

        .expand-icon {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-left: 0.5rem;
        }

        .module-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .progress-bar-mini {
          width: 40px;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill-mini {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .module-lessons {
          background: white;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lesson-item:last-child {
          border-bottom: none;
        }

        .lesson-item:hover {
          background: #f9fafb;
        }

        .lesson-item.active {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
        }

        .lesson-item.completed {
          background: #f0fdf4;
        }

        .lesson-item.locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lesson-item.locked:hover {
          background: transparent;
        }

        .lesson-number {
          background: #e5e7eb;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          min-width: 2.5rem;
          text-align: center;
        }

        .lesson-item.active .lesson-number {
          background: #3b82f6;
          color: white;
        }

        .lesson-item.completed .lesson-number {
          background: #10b981;
          color: white;
        }

        .lesson-item .lesson-content {
          flex: 1;
        }

        .lesson-item h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.85rem;
          font-weight: 500;
          color: #1f2937;
          line-height: 1.3;
        }

        .lesson-item .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: #6b7280;
        }

        .lesson-item .lesson-meta .lesson-type {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .lesson-status {
          font-size: 1rem;
        }

        .complete-course-section {
          margin-top: 1.5rem;
          padding: 1rem;
          text-align: center;
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          border-radius: 8px;
        }

        .completion-message {
          font-weight: 600;
          color: #065f46;
          margin-bottom: 0.75rem;
        }

        .btn-complete-course {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-complete-course:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .lessons-navigation {
            position: static;
          }

          .course-title {
            font-size: 1.8rem;
          }

          .current-lesson {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb-container {
            gap: 0.25rem;
          }

          .breadcrumb-item {
            padding: 0.375rem 0.5rem;
            font-size: 0.85rem;
          }

          .breadcrumb-text {
            display: none;
          }

          .lesson-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }

          .lesson-buttons .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
} 