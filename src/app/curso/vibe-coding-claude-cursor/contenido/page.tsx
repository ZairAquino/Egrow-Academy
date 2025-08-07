'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';
import AchievementNotification from '@/components/ui/AchievementNotification';

export default function ContenidoVibeCodingClaudeCursorPage() {
  
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
  } = useCourseProgress('vibe-coding-claude-cursor', isEnrolled);

  const courseData = {
    id: 'vibe-coding-claude-cursor',
    title: 'Vibe coding con Claude code y Cursor',
    description: 'Domina el desarrollo de código con inteligencia artificial. Aprende a usar Claude Code y Cursor para acelerar tu productividad como desarrollador y crear código más eficiente.',
    lessons: [
      // MÓDULO 1 - Fundamentos del Vibe Coding
      {
        id: 'vcc-mod1-les1',
        moduleId: 1,
        title: '1.1 Introducción al Vibe Coding con IA',
        duration: '15 min',
        type: 'video',
        description: 'Descubre el nuevo paradigma de programación asistida por IA y cómo transformará tu forma de codificar',
        videoUrl: 'https://www.youtube.com/watch?v=example1-1',
        content: `
          <h2>1.1 Introducción al Vibe Coding con IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">El Vibe Coding representa una nueva era en el desarrollo de software, donde la inteligencia artificial se convierte en tu compañero de programación más poderoso. Aprende a sincronizarte con las herramientas más avanzadas del mercado.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">¿Qué es el Vibe Coding?</h3>
          <p style="color: #475569; line-height: 1.6;">El Vibe Coding es una metodología de desarrollo que integra:</p>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Desarrollo asistido por IA en tiempo real</li>
              <li style="margin: 0.5rem 0;">✓ Flujos de trabajo optimizados con Claude Code</li>
              <li style="margin: 0.5rem 0;">✓ Integración perfecta con Cursor Editor</li>
              <li style="margin: 0.5rem 0;">✓ Productividad exponencial en el desarrollo</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vcc-mod1-les2',
        moduleId: 1,
        title: '1.2 Configuración del Entorno de Desarrollo',
        duration: '20 min',
        type: 'video',
        description: 'Prepara tu máquina con todas las herramientas necesarias para comenzar tu viaje en el Vibe Coding',
        videoUrl: 'https://www.youtube.com/watch?v=example1-2',
        content: `
          <h2>1.2 Configuración del Entorno de Desarrollo</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Un entorno de desarrollo bien configurado es la base del éxito en Vibe Coding. Aprende a preparar tu sistema para maximizar el poder de la IA.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Herramientas Esenciales</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Instalación y configuración de Claude Code</li>
              <li style="margin: 0.5rem 0;">✓ Setup completo de Cursor Editor</li>
              <li style="margin: 0.5rem 0;">✓ Configuración de modelos de IA</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Optimización del Sistema</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Configuración de variables de entorno</li>
              <li style="margin: 0.5rem 0;">✓ Integración con sistemas de control de versiones</li>
              <li style="margin: 0.5rem 0;">✓ Configuración de atajos y workflows</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vcc-mod1-les3',
        moduleId: 1,
        title: '1.3 Principios del Desarrollo Asistido por IA',
        duration: '18 min',
        type: 'video',
        description: 'Comprende los fundamentos y mejores prácticas para trabajar eficientemente con asistentes de IA',
        videoUrl: 'https://www.youtube.com/watch?v=example1-3',
        content: `
          <h2>1.3 Principios del Desarrollo Asistido por IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Aprende los principios fundamentales para trabajar eficientemente con asistentes de IA y maximizar tu productividad como desarrollador.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Principios Clave</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Comunicación clara con la IA</li>
              <li style="margin: 0.5rem 0;">✓ Iteración rápida y feedback continuo</li>
              <li style="margin: 0.5rem 0;">✓ Integración con flujos de trabajo existentes</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vcc-mod1-les4',
        moduleId: 1,
        title: '1.4 Tu Primera Sesión de Vibe Coding',
        duration: '25 min',
        type: 'video',
        description: 'Experimenta tu primera sesión práctica creando una aplicación simple con asistencia de IA',
        videoUrl: 'https://www.youtube.com/watch?v=example1-4',
        content: `
          <h2>1.4 Tu Primera Sesión de Vibe Coding</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Pon en práctica todo lo aprendido creando tu primera aplicación con la ayuda de herramientas de IA.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Proyecto Práctico</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Configuración del proyecto</li>
              <li style="margin: 0.5rem 0;">✓ Desarrollo con Claude Code</li>
              <li style="margin: 0.5rem 0;">✓ Testing y deployment</li>
            </ul>
          </div>
        `
      },
      
      // MÓDULO 2 - Maestría en Claude Code
      {
        id: 'vcc-mod2-les1',
        moduleId: 2,
        title: '2.1 Dominio Avanzado de Claude Code',
        duration: '22 min',
        type: 'video',
        description: 'Explora las capacidades avanzadas de Claude Code para proyectos complejos',
        videoUrl: 'https://www.youtube.com/watch?v=example2-1',
        content: `
          <h2>2.1 Dominio Avanzado de Claude Code</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Descubre las funcionalidades avanzadas de Claude Code que te permitirán abordar proyectos de cualquier complejidad.</p>
          </div>
        `
      },
      {
        id: 'vcc-mod2-les2',
        moduleId: 2,
        title: '2.2 Proyecto Final Integrado',
        duration: '45 min',
        type: 'project',
        description: 'Construye una aplicación completa aplicando todo lo aprendido en el curso',
        videoUrl: 'https://www.youtube.com/watch?v=example2-2',
        content: `
          <h2>2.2 Proyecto Final Integrado</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Aplica todo lo aprendido construyendo una aplicación completa con Claude Code y Cursor.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Objetivos del Proyecto</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Planificación del proyecto con IA</li>
              <li style="margin: 0.5rem 0;">✓ Desarrollo full-stack asistido</li>
              <li style="margin: 0.5rem 0;">✓ Testing automatizado</li>
              <li style="margin: 0.5rem 0;">✓ Deployment y optimización</li>
            </ul>
          </div>
        `
      }
    ]
  };

  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/vibe-coding-claude-cursor/contenido');
    }
  }, [user]);

  // Expandir automáticamente el módulo actual
  useEffect(() => {
    if (progress.currentLesson !== undefined && courseData.lessons[progress.currentLesson]) {
      const currentModuleId = courseData.lessons[progress.currentLesson].moduleId;
      setExpandedModules(prev => new Set(prev).add(currentModuleId));
    }
  }, [progress.currentLesson]);

  // Función para alternar expansión de módulos
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

  // Guardar progreso automáticamente al salir de la página
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (isEnrolled) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          try {
            const currentLesson = courseData.lessons[progress.currentLesson];
            if (currentLesson) {
              await saveProgress(progress.currentLesson, progress.completedLessons, currentLesson.id, currentLesson.title, 'progress', 0);
            }
          } catch (error) {
            console.error('Error guardando progreso al salir:', error);
          }
        }
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && isEnrolled) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          try {
            const currentLesson = courseData.lessons[progress.currentLesson];
            if (currentLesson) {
              await saveProgress(progress.currentLesson, progress.completedLessons, currentLesson.id, currentLesson.title, 'progress', 0);
            }
          } catch (error) {
            console.error('Error guardando progreso al cambiar visibilidad:', error);
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [progress.currentLesson, progress.completedLessons, isEnrolled, saveProgress, courseData.lessons]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 [DEBUG] Respuesta de inscripción:', data);
        
        setIsEnrolled(data.isEnrolled || false);
      } else {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.log('🔍 [DEBUG] No se pudo parsear respuesta JSON, usando texto plano');
          errorData = { message: 'Error de respuesta del servidor' };
        }
        console.error('🔍 [DEBUG] Error en respuesta:', errorData);
        
        if (response.status === 401) {
          console.log('🔍 [DEBUG] Error 401 - Token expirado o inválido, redirigiendo al login');
          router.push(`/login?redirect=/curso/${courseData.id}/contenido`);
          return;
        }
        
        // Para otros errores, intentar inscripción directa
        console.log('🔍 [DEBUG] Error no es 401, intentando inscripción directa...');
        try {
          const enrollResponse = await fetch('/api/courses/enroll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId: courseData.id }),
            credentials: 'include',
          });
          
          if (enrollResponse.ok) {
            console.log('✅ [DEBUG] Usuario inscrito exitosamente tras error');
            setIsEnrolled(true);
          } else {
            console.error('❌ [DEBUG] Error en inscripción tras error');
            router.push(`/curso/${courseData.id}`);
          }
        } catch (enrollError) {
          console.error('❌ [DEBUG] Error crítico en inscripción:', enrollError);
          router.push(`/curso/${courseData.id}`);
        }
        
        router.push(`/curso/${courseData.id}`);
      }
    } catch (error) {
      console.error('Error verificando inscripción:', error);
      console.log('🔍 [DEBUG] Error de conexión, intentando inscripción directa...');
      
      try {
        const enrollResponse = await fetch('/api/courses/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ courseId: courseData.id })
        });

        if (enrollResponse.ok) {
          setIsEnrolled(true);
          console.log('✅ [DEBUG] Inscripción automática exitosa');
        } else {
          console.error('❌ [DEBUG] Error en inscripción automática');
          router.push(`/curso/${courseData.id}`);
        }
      } catch (enrollError) {
        console.error('❌ [DEBUG] Error crítico:', enrollError);
        router.push(`/curso/${courseData.id}`);
      }
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  const debouncedSaveProgress = (
    currentLesson: number,
    completedLessons: string[],
    lessonId: string,
    lessonTitle: string,
    action: string = 'progress',
    timeSpent: number = 0
  ) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(currentLesson, completedLessons, lessonId, lessonTitle, action, timeSpent);
    }, 300);
  };

  const handleLessonClick = (lessonIndex: number) => {
    if (isLessonAccessible(lessonIndex)) {
      setCurrentLesson(lessonIndex);
      
      const lesson = courseData.lessons[lessonIndex];
      debouncedSaveProgress(
        lessonIndex,
        progress.completedLessons,
        lesson.id,
        lesson.title,
        'view',
        0
      );
    }
  };

  const handlePreviousLesson = () => {
    if (progress.currentLesson > 0) {
      const newLessonIndex = progress.currentLesson - 1;
      setCurrentLesson(newLessonIndex);
      
      const newLesson = courseData.lessons[newLessonIndex];
      debouncedSaveProgress(
        newLessonIndex,
        progress.completedLessons,
        newLesson.id,
        newLesson.title,
        'navigation',
        0
      );
    }
  };

  const handleNextLesson = () => {
    if (progress.currentLesson < courseData.lessons.length - 1) {
      const newLessonIndex = progress.currentLesson + 1;
      setCurrentLesson(newLessonIndex);
      
      const newLesson = courseData.lessons[newLessonIndex];
      debouncedSaveProgress(
        newLessonIndex,
        progress.completedLessons,
        newLesson.id,
        newLesson.title,
        'navigation',
        0
      );
    }
  };

  // Nueva función para completar una lección individual
  const handleCompleteCurrentLesson = async () => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    await handleMarkLessonComplete(currentLesson.id);
  };

  // Función para verificar si se puede mostrar el botón de completar módulo
  const shouldShowCompleteModuleButton = (moduleId: number) => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const isLastInModule = moduleLessons[moduleLessons.length - 1].id === currentLesson.id;
    const moduleProgress = getModuleProgress(moduleId);
    
    // Verificar si todas las lecciones del módulo menos la actual están completadas
    const allOtherLessonsCompleted = moduleProgress.completed === moduleProgress.total - 1;
    
    return isLastInModule && allOtherLessonsCompleted && !progress.completedLessons.includes(currentLesson.id);
  };

  const handleMarkLessonComplete = async (lessonId: string) => {
    if (isCourseCompleted()) {
      return;
    }

    const currentLessonIndex = courseData.lessons.findIndex(lesson => lesson.id === lessonId);
    const currentLesson = courseData.lessons[currentLessonIndex];
    
    const newCompletedLessons = progress.completedLessons.includes(lessonId) 
      ? progress.completedLessons.filter(id => id !== lessonId)
      : [...progress.completedLessons, lessonId];

    try {
      setIsSaving(true);
      await markLessonComplete(lessonId);
      
      if (!progress.completedLessons.includes(lessonId)) {
        if (currentLessonIndex < courseData.lessons.length - 1) {
          setTimeout(() => {
            setCurrentLesson(currentLessonIndex + 1);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error al marcar lección como completada:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    // Permitir navegación libre: todas las lecciones son siempre accesibles
    return true;
  };

  const getLessonIcon = (lessonIndex: number) => {
    const lesson = courseData.lessons[lessonIndex];
    if (progress.completedLessons.includes(lesson.id)) {
      return '✅';
    } else if (lessonIndex === progress.currentLesson) {
      return '▶️';
    } else {
      return '📖';
    }
  };

  const getLessonStatus = (lessonIndex: number, lessonId: string) => {
    if (isLessonCompleted(lessonId)) {
      // Si el curso está completado, mostrar estado de revisión
      if (isCourseCompleted()) {
        return '📖';
      }
      return '✅';
    } else if (lessonIndex === progress.currentLesson) {
      return '▶️';
    } else {
      return '📖';
    }
  };

  // Función para verificar si se puede mostrar el botón de completar módulo
  const canCompleteModule = (moduleId: number) => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const isLastInModule = moduleLessons[moduleLessons.length - 1].id === currentLesson.id;
    const moduleProgress = getModuleProgress(moduleId);
    
    // Verificar si todas las lecciones del módulo menos la actual están completadas
    const allOtherLessonsCompleted = moduleProgress.completed === moduleProgress.total - 1;
    
    return isLastInModule && allOtherLessonsCompleted && !progress.completedLessons.includes(currentLesson.id);
  };

  // Función para verificar si se pueden completar todas las lecciones anteriores del módulo
  const canCompleteModuleWithPrerequisites = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const currentLesson = courseData.lessons[progress.currentLesson];
    
    // Obtener todas las lecciones del módulo excepto la actual (que es la última)
    const previousLessons = moduleLessons.filter(lesson => lesson.id !== currentLesson.id);
    
    // Verificar que todas las lecciones anteriores estén completadas
    const allPreviousCompleted = previousLessons.every(lesson => progress.completedLessons.includes(lesson.id));
    
    return allPreviousCompleted;
  };

  // Función para verificar si un módulo completo está terminado
  const isModuleCompleted = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    return moduleLessons.every(lesson => progress.completedLessons.includes(lesson.id));
  };

  // Función para obtener el progreso de un módulo
  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const completedInModule = moduleLessons.filter(lesson => progress.completedLessons.includes(lesson.id));
    return {
      completed: completedInModule.length,
      total: moduleLessons.length,
      percentage: (completedInModule.length / moduleLessons.length) * 100
    };
  };

  // Últimas lecciones de cada módulo
  const LAST_LESSONS_BY_MODULE: Record<number, string> = {
    1: 'vcc-mod1-les3', // 1.3 Flujos de Trabajo Avanzados
    2: 'vcc-mod2-les3', // 2.3 Integración con APIs
    3: 'vcc-mod3-les3', // 3.3 Optimización de Código
    4: 'vcc-mod4-les3', // 4.3 Despliegue y CI/CD
    5: 'vcc-mod5-les3'  // 5.3 Mantenimiento y Escalabilidad
  };

  // Función para verificar si es la última lección del módulo
  const isLastLessonOfModule = (lessonId: string, moduleId: number): boolean => {
    return LAST_LESSONS_BY_MODULE[moduleId] === lessonId;
  };

  // Función auxiliar para obtener el título del módulo
  const getModuleTitle = (moduleId: number): string => {
    switch (moduleId) {
      case 1: return 'Módulo 1: FUNDAMENTOS DEL VIBE CODING';
      case 2: return 'Módulo 2: HERRAMIENTAS AVANZADAS';
      case 3: return 'Módulo 3: DESARROLLO PRÁCTICO';
      case 4: return 'Módulo 4: DESPLIEGUE Y PRODUCCIÓN';
      case 5: return 'Módulo 5: MANTENIMIENTO Y ESCALABILIDAD';
      default: return `Módulo ${moduleId}`;
    }
  };

  // Función para completar un módulo completo
  const handleCompleteModule = async (moduleId: number) => {
    if (!isEnrolled) return;

    // Si el curso ya está completado, no permitir completar módulos
    if (isCourseCompleted()) {
      setAchievementData({
        type: 'module',
        title: 'Curso Ya Completado',
        message: 'Este curso ya está completado. Estás en modo de revisión.',
        stats: {
          completed: courseData.lessons.length,
          total: courseData.lessons.length,
          percentage: 100
        }
      });
      setShowModuleNotification(true);
      return;
    }

    // Verificar que se puedan completar todas las lecciones anteriores del módulo
    if (!canCompleteModuleWithPrerequisites(moduleId)) {
      const moduleProgress = getModuleProgress(moduleId);
      setAchievementData({
        type: 'module',
        title: 'Completa las Lecciones Anteriores',
        message: 'Debes completar todas las lecciones anteriores del módulo antes de poder completarlo.',
        stats: {
          completed: moduleProgress.completed,
          total: moduleProgress.total,
          percentage: Math.round((moduleProgress.completed / moduleProgress.total) * 100)
        }
      });
      setShowModuleNotification(true);
      return;
    }
    
    // Obtener todas las lecciones del módulo
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    
    // Crear array con todas las lecciones completadas (existentes + todas las del módulo)
    const allModuleLessonIds = moduleLessons.map(lesson => lesson.id);
    const newCompletedLessons = [
      ...progress.completedLessons.filter(id => !allModuleLessonIds.includes(id)), // Lecciones de otros módulos
      ...allModuleLessonIds // Todas las lecciones de este módulo
    ];

    // Actualizar el estado local con todas las lecciones del módulo
    allModuleLessonIds.forEach(lessonId => {
      if (!progress.completedLessons.includes(lessonId)) {
        markLessonComplete(lessonId);
      }
    });

    // Guardar progreso con todas las lecciones del módulo completadas
    const currentLessonIndex = progress.currentLesson;
    const currentLesson = courseData.lessons[currentLessonIndex];

    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id ? parseInt(currentLesson.id.split('-').pop() || '0') : undefined,
      `Módulo ${moduleId} Completado`,
      'complete',
      10 // Tiempo adicional por completar módulo
    );

    // Mostrar notificación de éxito
    const moduleTitle = getModuleTitle(moduleId);
    const moduleProgress = getModuleProgress(moduleId);
    
    setAchievementData({
      type: 'module',
      title: `¡Módulo Completado!`,
      message: `¡Felicitaciones! Has completado exitosamente el ${moduleTitle}. Continúa con el siguiente módulo para avanzar en tu aprendizaje.`,
      stats: {
        completed: moduleProgress.completed,
        total: moduleProgress.total,
        percentage: Math.round((moduleProgress.completed / moduleProgress.total) * 100)
      }
    });
    setShowModuleNotification(true);

    // Si no es el último módulo, avanzar a la primera lección del siguiente módulo
    if (moduleId < 5) {
      const nextModuleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId + 1);
      if (nextModuleLessons.length > 0) {
        const nextLessonIndex = courseData.lessons.findIndex(lesson => lesson.id === nextModuleLessons[0].id);
        if (nextLessonIndex !== -1) {
          setCurrentLesson(nextLessonIndex);
        }
      }
    }
  };

  const isCourseCompleted = () => {
    return courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };

  const areAllLessonsCompleted = () => {
    return courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };

  const handleCompleteCourse = async () => {
    if (!isEnrolled) return;
    
    // Si el curso ya está completado, mostrar mensaje
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Puedes revisar el contenido cuando quieras.');
      return;
    }
    
    // Verificar si todas las lecciones están completadas
    const allLessonsCompleted = courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
    
    if (!allLessonsCompleted) {
      alert('Debes completar todas las lecciones antes de poder terminar el curso.');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/courses/complete-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseSlug: 'vibe-coding-claude-cursor'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Redirigir a la página de inicio del curso
        router.push('/curso/vibe-coding-claude-cursor');
      } else {
        const error = await response.json();
        console.error('❌ Error al completar curso:', error);
        alert('Error al completar el curso. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('❌ Error al completar curso:', error);
      alert('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isCheckingEnrollment || isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando curso...</p>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Necesitas estar inscrito en este curso para acceder al contenido.</p>
        <button onClick={() => router.push(`/curso/${courseData.id}`)}>
          Ir al curso
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar  />
      
      <div className="course-header">
        <div className="course-header-content">
          <div className="course-breadcrumb">
            <div className="breadcrumb-container">
              <div className="breadcrumb-item" onClick={() => router.push('/dashboard')}>
                <span className="breadcrumb-icon">🏠</span>
                <span className="breadcrumb-text">Dashboard</span>
              </div>
              <div className="breadcrumb-separator">→</div>
              <div className="breadcrumb-item" onClick={() => router.push(`/curso/${courseData.id}`)}>
                <span className="breadcrumb-icon">📚</span>
                <span className="breadcrumb-text">Curso</span>
              </div>
              <div className="breadcrumb-separator">→</div>
              <div className="breadcrumb-item active">
                <span className="breadcrumb-icon">🎓</span>
                <span className="breadcrumb-text">Contenido</span>
              </div>
            </div>
          </div>

          <div className="header-main">
            <div className="header-content">
              <h1 className="course-title">{courseData.title}</h1>
            </div>
            <div className="header-actions">
              <button 
                className="btn-exit-course"
                onClick={() => router.push(`/curso/${courseData.id}`)}
                disabled={isSaving}
              >
                ← Volver al Curso
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="content-layout">
          <div className="main-content-area">
            <div className="current-lesson">
            <div className="lesson-header">
              <h2>{courseData.lessons[progress.currentLesson]?.title}</h2>
              <div className="lesson-meta">
                <span className="lesson-type">
                  {courseData.lessons[progress.currentLesson]?.type}
                </span>
                <span className="lesson-duration">
                  {courseData.lessons[progress.currentLesson]?.duration}
                </span>
              </div>
            </div>

            <div className="lesson-content">
              <div 
                className="lesson-text-content"
                dangerouslySetInnerHTML={{ 
                  __html: courseData.lessons[progress.currentLesson]?.content || '' 
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
                  const isLastLesson = shouldShowCompleteModuleButton(currentModuleId);
                  const isCurrentLessonCompleted = progress.completedLessons.includes(currentLesson.id);
                  const isModuleAlreadyCompleted = isModuleCompleted(currentModuleId);
                  
                  if (isModuleAlreadyCompleted) {
                    // Módulo ya completado - no mostrar botones de completar
                    return null;
                  }
                  
                  if (isLastLesson) {
                    // Última lección del módulo - solo mostrar botón "Completar Módulo"
                    const canComplete = canCompleteModule(currentModuleId);
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
                        🏆 Completar Módulo {currentModuleId}
                      </button>
                    );
                  } else {
                    // Lección regular - mostrar botón "Completar Lección" si no está completada
                    return !isCurrentLessonCompleted ? (
                      <button
                        className={`btn ${
                          isLessonCompleted(courseData.lessons[progress.currentLesson]?.id)
                            ? 'btn-success'
                            : 'btn-primary'
                        }`}
                        onClick={() => handleMarkLessonComplete(courseData.lessons[progress.currentLesson]?.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Guardando...' : 
                         isLessonCompleted(courseData.lessons[progress.currentLesson]?.id) 
                           ? '✓ Completada' 
                           : 'Marcar como Completada'
                        }
                      </button>
                    ) : null;
                  }
                })()}

                <button
                  className="btn btn-primary"
                  onClick={handleNextLesson}
                  disabled={progress.currentLesson === courseData.lessons.length - 1}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
          </div>

          <div className="course-sidebar">
            <div className="progress-section">
              <div className="progress-header">
                <h3>Progreso del Curso</h3>
                <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="progress-stats">
                <div className="stat">
                  <span className="stat-number">{progress.completedLessons.length}</span>
                  <span className="stat-label">Completadas</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{courseData.lessons.length}</span>
                  <span className="stat-label">Total</span>
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

            <div className="lessons-list">
              {[1, 2, 3, 4, 5].map(moduleId => {
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
                              className={`lesson-item ${globalIndex === progress.currentLesson ? 'current' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}
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

            </div>
            
            <div className="complete-course-section">
              {isCourseCompleted() ? (
                <div className="course-completed-message">
                  <div className="completion-badge">
                    <span className="completion-icon">🏆</span>
                    <span className="completion-text">¡Curso Completado!</span>
                  </div>
                  <p className="completion-info">
                    Has completado exitosamente este curso. Puedes revisar el contenido cuando quieras.
                  </p>
                  <div className="completion-stats">
                    <span>📊 Progreso: 100%</span>
                    <span>✅ Lecciones: {courseData.lessons.length}/{courseData.lessons.length}</span>
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    className={`btn btn-complete-course ${!areAllLessonsCompleted() ? 'disabled' : ''}`}
                    onClick={handleCompleteCourse}
                    disabled={isSaving || !areAllLessonsCompleted()}
                  >
                    {isSaving ? '🔄 Procesando...' : '🏆 Terminar Curso'}
                  </button>
                  <p className="complete-course-info">
                    {areAllLessonsCompleted() 
                      ? '¡Felicidades! Has completado todas las lecciones. Puedes terminar el curso.'
                      : `Completa todas las lecciones (${progress.completedLessons.length}/${courseData.lessons.length}) para poder terminar el curso`
                    }
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Notificaciones de logros */}
      <AchievementNotification
        isVisible={showModuleNotification}
        onClose={() => setShowModuleNotification(false)}
        type={achievementData.type}
        title={achievementData.title}
        message={achievementData.message}
        stats={achievementData.stats}
      />

      <AchievementNotification
        isVisible={showCourseNotification}
        onClose={() => setShowCourseNotification(false)}
        type={achievementData.type}
        title={achievementData.title}
        message={achievementData.message}
        stats={achievementData.stats}
      />

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .enrollment-required {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          gap: 1rem;
        }

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
        }

        .course-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-breadcrumb {
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .breadcrumb-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .breadcrumb-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .breadcrumb-item.active {
          color: white;
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          margin: 0 0.25rem;
        }

        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .course-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .btn-exit-course {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: 2px solid #dc2626;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .btn-exit-course:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-color: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
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
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          font-weight: 500;
          text-transform: capitalize;
        }

        .lesson-video-container {
          margin: 2rem 0;
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
          cursor: pointer;
          transition: all 0.3s ease;
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
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          height: fit-content;
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

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .module-group {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #e5e7eb;
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .module-header:hover {
          background: #f9fafb;
          border-color: #3b82f6;
        }

        .module-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .expand-icon {
          font-size: 0.8rem;
          color: #6b7280;
          transition: transform 0.2s ease;
          transform: rotate(-90deg);
        }

        .module-header.expanded .expand-icon {
          transform: rotate(0deg);
        }

        .module-lessons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e5e7eb;
        }

        .lesson-item:hover {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .lesson-item.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }


        .lesson-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f3f4f6;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .lesson-item.active .lesson-number {
          background: #3b82f6;
          color: white;
        }

        .lesson-item.completed .lesson-number {
          background: #22c55e;
          color: white;
        }

        .lesson-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #1f2937;
        }

        .lesson-content .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .lesson-status {
          margin-left: auto;
          font-size: 1.2rem;
        }

        .course-completed-message {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border-radius: 12px;
          margin-top: 1rem;
        }

        .completion-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .completion-icon {
          font-size: 2rem;
        }

        .completion-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #16a34a;
        }

        .completion-info {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        @media (min-width: 769px) and (max-width: 1199px) {
          .content-layout {
            grid-template-columns: 1fr 280px;
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 0 0.5rem;
          }

          .course-title {
            font-size: 1.8rem;
            line-height: 1.3;
          }

          .header-main {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .course-header {
            padding: 1.5rem 0;
          }

          .course-header-content {
            padding: 0 0.5rem;
          }

          .course-breadcrumb {
            margin-bottom: 1.5rem;
            font-size: 0.8rem;
          }

          .breadcrumb-container {
            gap: 0.25rem;
            flex-wrap: wrap;
          }

          .breadcrumb-item {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }

          .btn-exit-course {
            width: 100%;
            justify-content: center;
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .current-lesson {
            padding: 1.5rem;
            margin-bottom: 1rem;
          }

          .lesson-header h2 {
            font-size: 1.5rem;
            line-height: 1.3;
          }

          .lesson-meta {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .lesson-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }

          .btn {
            width: 100%;
            justify-content: center;
            padding: 0.875rem 1rem;
            font-size: 0.9rem;
          }

          .lessons-navigation {
            padding: 1rem;
            position: static;
            margin-top: 1rem;
          }

          .navigation-header h3 {
            font-size: 1.25rem;
          }

          .progress-text {
            font-size: 0.75rem;
          }

          .module-group {
            padding: 0.75rem;
          }

          .module-header {

          /* Corregir el tamaño del lesson-number en móviles */
          .lesson-number {
            width: 24px !important;
            height: 24px !important;
            font-size: 0.75rem !important;
          }

          .lesson-item.active .lesson-number {
            width: 24px !important;
            height: 24px !important;
          }

          .lesson-item.completed .lesson-number {
            width: 24px !important;
            height: 24px !important;
          }

          /* Asegurar que el contenido se mantenga centrado en móviles */
          .module-lessons {
            padding: 0.5rem !important;
            margin: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .lesson-item {
            width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 !important;
          }

          .lessons-list {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }

          .module-group {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }

          /* Corregir tablas en móviles */
          .lesson-content table {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 0.75rem !important;
            border-collapse: collapse !important;
          }

          .lesson-content table th,
          .lesson-content table td {
            padding: 0.5rem !important;
            font-size: 0.7rem !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          .lesson-content table th {
            font-size: 0.7rem !important;
            font-weight: 600 !important;
          }

          /* Contenedor de tabla con scroll horizontal */
          .lesson-content div[style*="overflow-x: auto"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }

          /* Asegurar que el contenido de las lecciones no se desborde */
          .lesson-content {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          .lesson-content h2,
          .lesson-content h3,
          .lesson-content h4,
          .lesson-content p,
          .lesson-content div {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* Corregir elementos de código */
          .lesson-content pre {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
            background: #f8fafc !important;
            border-radius: 8px !important;
            padding: 0.75rem !important;
            margin: 1rem 0 !important;
            border: 1px solid #e2e8f0 !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            font-size: 0.7rem !important;
          }

          /* Scrollbar para bloques de código */
          .lesson-content pre::-webkit-scrollbar {
            height: 6px !important;
          }

          .lesson-content pre::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 3px !important;
          }

          .lesson-content pre::-webkit-scrollbar-thumb {
            background: #cbd5e1 !important;
            border-radius: 3px !important;
          }

          .lesson-content pre::-webkit-scrollbar-thumb:hover {
            background: #94a3b8 !important;
          }

          /* Indicador para bloques de código */
          .lesson-content pre::after {
            content: "← Desliza para ver código completo →" !important;
            display: block !important;
            text-align: center !important;
            font-size: 0.65rem !important;
            color: #64748b !important;
            margin-top: 0.5rem !important;
            font-style: italic !important;
          }

          .lesson-content code {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            font-size: 0.7rem !important;
          }

          /* Corregir listas */
          .lesson-content ul,
          .lesson-content ol {
            max-width: 100% !important;
            padding-left: 1rem !important;
          }

          .lesson-content li {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* Corregir elementos inline */
          .lesson-content span,
          .lesson-content strong,
          .lesson-content em {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* Corregir elementos con estilos inline */
          .lesson-content div[style*="width"] {
            max-width: 100% !important;
            width: auto !important;
          }

          .lesson-content div[style*="min-width"] {
            min-width: auto !important;
          }

          /* Asegurar que todos los elementos se mantengan dentro de los límites */
          .lesson-content * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Contenedor principal de la lección */
          .lesson-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            padding: 0 0.5rem !important;
            box-sizing: border-box !important;
          }
            padding: 0.75rem;
          }

          .module-title {
            font-size: 0.9rem;
          }

          .lesson-item {
            padding: 0.75rem;
            gap: 0.5rem;
          }

          .lesson-content h4 {
            font-size: 0.85rem;
            line-height: 1.4;
          }

          .lesson-content .lesson-meta {
            flex-direction: row;
            gap: 0.5rem;
            font-size: 0.7rem;
          }

          .lesson-number {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
          }

          .course-completed-message {
            padding: 1.5rem;
          }

          .completion-text {
            font-size: 1.25rem;
          }

          .completion-info {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .course-header {
            padding: 1rem 0;
          }

          .course-title {
            font-size: 1.5rem;
          }

          .course-header-content {
            padding: 0 0.25rem;
          }

          .breadcrumb-container {
            gap: 0.125rem;
          }

          .breadcrumb-item {
            padding: 0.125rem 0.25rem;
            font-size: 0.7rem;
          }

          .breadcrumb-separator {
            margin: 0 0.125rem;
            font-size: 0.7rem;
          }

          .current-lesson {
            padding: 1rem;
          }

          .lesson-header h2 {
            font-size: 1.25rem;
          }

          .lesson-content {
            font-size: 0.9rem;
          }

          .lesson-content h2 {
            font-size: 1.5rem;
          }

          .lesson-content h3 {
            font-size: 1.25rem;
          }

          .lessons-navigation {
            padding: 0.75rem;
          }

          .navigation-header h3 {
            font-size: 1.125rem;
          }

          .module-group {
            padding: 0.5rem;
          }

          .module-header {
            padding: 0.5rem;
          }

          .module-title {
            font-size: 0.85rem;
          }

          .lesson-item {
            padding: 0.5rem;
          }

          .lesson-content h4 {
            font-size: 0.8rem;
          }

          .lesson-content .lesson-meta {
            font-size: 0.65rem;
          }

          .lesson-number {
            width: 18px;
            height: 18px;
            font-size: 0.65rem;
          }

          .course-completed-message {
            padding: 1rem;
          }

          .completion-text {
            font-size: 1.125rem;
          }

          .completion-info {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 375px) {
          .course-title {
            font-size: 1.25rem;
          }

          .current-lesson {
            padding: 0.75rem;
          }

          .lesson-header h2 {
            font-size: 1.125rem;
          }

          .lesson-content {
            font-size: 0.85rem;
          }

          .lesson-content h2 {
            font-size: 1.25rem;
          }

          .lesson-content h3 {
            font-size: 1.125rem;
          }

          .lessons-navigation {
            padding: 0.5rem;
          }

          .navigation-header h3 {
            font-size: 1rem;
          }

          .module-group {
            padding: 0.375rem;
          }

          .module-header {
            padding: 0.375rem;
          }

          .module-title {
            font-size: 0.8rem;
          }

          .lesson-item {
            padding: 0.375rem;
          }

          .lesson-content h4 {
            font-size: 0.75rem;
          }

          .lesson-content .lesson-meta {
            font-size: 0.6rem;
          }

          .lesson-number {
            width: 16px;
            height: 16px;
            font-size: 0.6rem;
          }

          .course-completed-message {
            padding: 0.75rem;
          }

          .completion-text {
            font-size: 1rem;
          }

          .completion-info {
            font-size: 0.8rem;
          }
        }

        /* Estilos para el contenedor del video */
        .lesson-video {
          width: 100% !important;
          max-width: 100% !important;
          margin: 2rem 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
          background: #000 !important;
        }

        /* Responsive para diferentes tamaños de pantalla */
        @media (min-width: 1200px) {
          .lesson-video {
            max-width: 900px !important;
            margin: 2rem auto !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1199px) {
          .lesson-video {
            max-width: 100% !important;
            margin: 1.5rem 0 !important;
            max-height: 60vh !important;
          }
        }

        @media (max-width: 767px) {
          .lesson-video {
            margin: 1rem 0 !important;
            border-radius: 8px !important;
            max-height: 50vh !important;
          }
        }

        @media (max-width: 480px) {
          .lesson-video {
            margin: 0.5rem 0 !important;
            max-height: 40vh !important;
          }
        }

        @media (max-width: 375px) {
          .lesson-video {
            max-height: 35vh !important;
          }
        }
      `}</style>
    </>
  );
} 