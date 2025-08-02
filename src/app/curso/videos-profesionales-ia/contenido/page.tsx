'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';

export default function ContenidoVideosProfesionalesIAPage() {
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const { user } = useAuth();
  const { hasPremiumAccess } = useSubscriptionStatus();
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
    title: 'Aprende a crear videos profesionales con IA',
    description: 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.',
    lessons: [
      // MÓDULO 1 - Fundamentos de Video con IA
      {
        id: 'vpc-mod1-les1',
        moduleId: 1,
        title: '1.1 Introducción a la Creación de Videos con IA',
        duration: '15 min',
        type: 'teorico',
        description: 'Descubre el potencial de la inteligencia artificial en la producción audiovisual moderna',
        content: `
          <h2>1.1 Introducción a la Creación de Videos con IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">La inteligencia artificial está revolucionando la industria audiovisual, democratizando la creación de contenido profesional y abriendo nuevas posibilidades creativas que antes requerían equipos especializados y presupuestos considerables.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">¿Qué es la Creación de Videos con IA?</h3>
          <p style="color: #475569; line-height: 1.6;">La creación de videos con IA utiliza algoritmos avanzados para automatizar y optimizar procesos de producción audiovisual:</p>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Generación automática de guiones y narrativas</li>
              <li style="margin: 0.5rem 0;">✓ Síntesis de voces realistas y naturales</li>
              <li style="margin: 0.5rem 0;">✓ Creación de avatares y personajes digitales</li>
              <li style="margin: 0.5rem 0;">✓ Edición inteligente y optimización automática</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod1-les2',
        moduleId: 1,
        title: '1.2 Panorama de Herramientas de IA para Video',
        duration: '20 min',
        type: 'teorico',
        description: 'Explora las principales plataformas y herramientas disponibles en el mercado',
        content: `
          <h2>1.2 Panorama de Herramientas de IA para Video</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">El ecosistema de herramientas de IA para video se ha expandido exponencialmente. Conocer las opciones disponibles te permitirá elegir la mejor solución para cada proyecto.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Herramientas Principales</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">🎬 Synthesia</h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">Líder en avatares IA para presentaciones corporativas y contenido educativo.</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">🗣️ ElevenLabs</h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">Síntesis de voz natural y clonación de voces realistas.</p>
          </div>
        `
      },
      {
        id: 'vpc-mod1-les3',
        moduleId: 1,
        title: '1.3 Casos de Uso y Aplicaciones Comerciales',
        duration: '18 min',
        type: 'teorico',
        description: 'Identifica oportunidades de negocio y aplicaciones prácticas',
        content: `
          <h2>1.3 Casos de Uso y Aplicaciones Comerciales</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Los videos generados con IA tienen aplicaciones prácticamente ilimitadas en el mundo empresarial y del marketing digital.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Marketing y Publicidad</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Anuncios personalizados para diferentes audiencias</li>
              <li style="margin: 0.5rem 0;">✓ Videos explicativos de productos o servicios</li>
              <li style="margin: 0.5rem 0;">✓ Testimoniales y casos de éxito automatizados</li>
            </ul>
          </div>
        `
      },
      
      // MÓDULO 2 - Herramientas de Generación
      {
        id: 'vpc-mod2-les1',
        moduleId: 2,
        title: '2.1 Dominio de Synthesia',
        duration: '25 min',
        type: 'teorico',
        description: 'Aprende a crear presentadores virtuales profesionales',
        content: `
          <h2>2.1 Dominio de Synthesia</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Synthesia es la plataforma líder para crear videos con avatares IA realistas. Permite generar contenido profesional sin necesidad de cámaras, actores o estudios de grabación.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Características Principales</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">👤 Avatares Diversos</h4>
            <ul style="margin: 0.5rem 0 0 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.25rem 0;">• Más de 140 avatares profesionales</li>
              <li style="margin: 0.25rem 0;">• Diferentes etnias, edades y estilos</li>
              <li style="margin: 0.25rem 0;">• Posibilidad de crear avatar personalizado</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod2-les2',
        moduleId: 2,
        title: '2.2 Generación con Runway ML',
        duration: '30 min',
        type: 'teorico',
        description: 'Explora la creación de videos desde texto y conceptos',
        content: `
          <h2>2.2 Generación con Runway ML</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Runway ML revoluciona la creación de contenido audiovisual permitiendo generar videos profesionales directamente desde descripciones de texto.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Capacidades de Runway ML</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">🎥 Text-to-Video</h4>
            <ul style="margin: 0.5rem 0 0 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.25rem 0;">• Escenas cinematográficas complejas</li>
              <li style="margin: 0.25rem 0;">• Animaciones fluidas y naturales</li>
              <li style="margin: 0.25rem 0;">• Control de estilo y movimiento</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod2-les3',
        moduleId: 2,
        title: '2.3 Edición Inteligente con Herramientas IA',
        duration: '22 min',
        type: 'teorico',
        description: 'Optimiza tu flujo de trabajo con edición automatizada',
        content: `
          <h2>2.3 Edición Inteligente con Herramientas IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">La edición con IA transforma videos en bruto en contenido profesional mediante automatización inteligente.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Herramientas de Edición IA</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">🎬 Descript</h4>
            <ul style="margin: 0.5rem 0 0 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.25rem 0;">• Edición basada en transcripción</li>
              <li style="margin: 0.25rem 0;">• Eliminación automática de muletillas</li>
              <li style="margin: 0.25rem 0;">• Clonación de voz Overdub</li>
            </ul>
          </div>
        `
      },
      
      // MÓDULO 3 - Optimización y Distribución
      {
        id: 'vpc-mod3-les1',
        moduleId: 3,
        title: '3.1 Optimización para Diferentes Plataformas',
        duration: '18 min',
        type: 'teorico',
        description: 'Adapta tu contenido para YouTube, TikTok, Instagram y más',
        content: `
          <h2>3.1 Optimización para Diferentes Plataformas</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Cada plataforma tiene sus propias especificaciones técnicas y preferencias de audiencia. La IA puede ayudarte a optimizar automáticamente el contenido para maximizar el engagement.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Especificaciones por Plataforma</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">📱 YouTube</h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">16:9 (1920x1080) - Contenido educativo de 8-15 minutos</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">🎵 TikTok</h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">9:16 (1080x1920) - Videos virales de 15-60 segundos</p>
          </div>
        `
      },
      {
        id: 'vpc-mod3-les2',
        moduleId: 3,
        title: '3.2 SEO y Metadatos para Videos',
        duration: '15 min',
        type: 'teorico',
        description: 'Maximiza el alcance orgánico de tu contenido audiovisual',
        content: `
          <h2>3.2 SEO y Metadatos para Videos</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">El SEO para videos es crucial para asegurar que tu contenido generado con IA alcance la audiencia correcta y genere el máximo impacto orgánico.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Elementos Clave del SEO para Video</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">🎯 Título Optimizado</h4>
            <ul style="margin: 0.5rem 0 0 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.25rem 0;">• Incluir palabra clave principal</li>
              <li style="margin: 0.25rem 0;">• Máximo 60 caracteres para YouTube</li>
              <li style="margin: 0.25rem 0;">• Generar curiosidad sin clickbait</li>
            </ul>
          </div>
        `
      },
      
      // MÓDULO 4 - Monetización y Estrategias Avanzadas
      {
        id: 'vpc-mod4-les1',
        moduleId: 4,
        title: '4.1 Modelos de Monetización con Videos IA',
        duration: '20 min',
        type: 'teorico',
        description: 'Convierte tu habilidad en videos IA en fuentes de ingresos sostenibles',
        content: `
          <h2>4.1 Modelos de Monetización con Videos IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">La creación de videos con IA abre múltiples oportunidades de monetización, desde servicios freelance hasta productos digitales escalables.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Servicios de Creación de Contenido</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">💼 Servicios para Empresas</h4>
            <ul style="margin: 0.5rem 0 0 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.25rem 0;">• Videos promocionales corporativos ($500-$2000)</li>
              <li style="margin: 0.25rem 0;">• Contenido de capacitación interna ($300-$1500)</li>
              <li style="margin: 0.25rem 0;">• Presentaciones de productos ($400-$1200)</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod4-les2',
        moduleId: 4,
        title: '4.2 Automatización del Flujo de Trabajo',
        duration: '25 min',
        type: 'teorico',
        description: 'Escala tu producción mediante automatización inteligente',
        content: `
          <h2>4.2 Automatización del Flujo de Trabajo</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">La automatización inteligente permite escalar la producción de videos manteniendo calidad consistente y reduciendo significativamente el tiempo de creación.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Pipeline de Producción Automatizado</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 0.5rem 0;">🔄 Generación de Contenido</h4>
            <ul style="margin: 0.5rem 0 0 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.25rem 0;">• IA genera guiones basados en temas</li>
              <li style="margin: 0.25rem 0;">• Creación automática de storyboards</li>
              <li style="margin: 0.25rem 0;">• Selección inteligente de avatares</li>
            </ul>
          </div>
        `
      }
    ]
  };

  useEffect(() => {
    const checkEnrollment = async () => {
      setIsCheckingEnrollment(true);
      
      if (!user) {
        setIsEnrolled(false);
        setIsCheckingEnrollment(false);
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/courses/enrollment-status?courseId=videos-profesionales-ia`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsEnrolled(data.isEnrolled);
        } else {
          setIsEnrolled(false);
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
        setIsEnrolled(false);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    checkEnrollment();
  }, [user]);

  const handleReturnToCourse = () => {
    const saveAndReturn = async () => {
      setIsSaving(true);
      try {
        await saveProgress();
        router.push(`/curso/videos-profesionales-ia`);
      } catch (error) {
        console.error('Error saving progress:', error);
        router.push(`/curso/videos-profesionales-ia`);
      } finally {
        setIsSaving(false);
      }
    };

    saveAndReturn();
  };

  const handleNextLesson = () => {
    if (progress.currentLesson < courseData.lessons.length - 1) {
      const nextLessonIndex = progress.currentLesson + 1;
      setCurrentLesson(nextLessonIndex);
      
      // Auto-save progress
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(nextLessonIndex, progress.completedLessons);
      }, 1000);
    }
  };

  const handlePreviousLesson = () => {
    if (progress.currentLesson > 0) {
      const previousLessonIndex = progress.currentLesson - 1;
      setCurrentLesson(previousLessonIndex);
      
      // Auto-save progress
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(previousLessonIndex, progress.completedLessons);
      }, 1000);
    }
  };

  const handleManualLessonChange = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex);
    
    // Auto-save progress
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(lessonIndex, progress.completedLessons);
    }, 1000);
  };

  const handleCompleteLesson = async () => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    
    if (!progress.completedLessons.includes(currentLesson.id)) {
      markLessonComplete(currentLesson.id);
      
      try {
        await saveProgress(
          progress.currentLesson,
          [...progress.completedLessons, currentLesson.id],
          progress.currentLesson + 1,
          currentLesson.title,
          'complete',
          0
        );
      } catch (error) {
        console.error('Error saving lesson completion:', error);
      }
    }
  };

  const handleCompleteModule = async (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const incompleteLessons = moduleLessons.filter(lesson => !progress.completedLessons.includes(lesson.id));
    
    if (incompleteLessons.length > 0) {
      const newCompletedLessons = [
        ...progress.completedLessons,
        ...incompleteLessons.map(lesson => lesson.id)
      ];
      
      // Mark all lessons as complete
      incompleteLessons.forEach(lesson => {
        markLessonComplete(lesson.id);
      });
      
      try {
        await saveProgress(
          progress.currentLesson,
          newCompletedLessons,
          undefined,
          `Módulo ${moduleId} completo`,
          'complete',
          0
        );
      } catch (error) {
        console.error('Error saving module completion:', error);
      }
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    return true;
  };

  const isLastLessonOfModule = (lessonId: string, moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const lastLesson = moduleLessons[moduleLessons.length - 1];
    return lastLesson.id === lessonId;
  };

  const isModuleCompleted = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    return moduleLessons.every(lesson => progress.completedLessons.includes(lesson.id));
  };

  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const completedInModule = moduleLessons.filter(lesson => progress.completedLessons.includes(lesson.id)).length;
    return {
      completed: completedInModule,
      total: moduleLessons.length,
      percentage: moduleLessons.length > 0 ? (completedInModule / moduleLessons.length) * 100 : 0
    };
  };

  const getLessonStatus = (lessonIndex: number, lessonId: string) => {
    if (lessonIndex === progress.currentLesson) {
      return '▶️';
    } else if (isLessonCompleted(lessonId)) {
      return '✅';
    } else if (isLessonAccessible(lessonIndex)) {
      return '📖';
    } else {
      return '🔒';
    }
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

  // Auto-expand the module containing the current lesson
  useEffect(() => {
    if (courseData.lessons[progress.currentLesson]) {
      const currentModuleId = courseData.lessons[progress.currentLesson].moduleId;
      setExpandedModules(prev => {
        if (!prev.has(currentModuleId)) {
          return new Set([...prev, currentModuleId]);
        }
        return prev;
      });
    }
  }, [progress.currentLesson]);

  if (isCheckingEnrollment) {
    return <div className="loading-container" suppressHydrationWarning>Verificando inscripción...</div>;
  }

  if (isLoading) {
    return <div className="loading-container" suppressHydrationWarning>Cargando...</div>;
  }

  if (!user || !isEnrolled || !hasPremiumAccess) {
    return (
      <div className="enrollment-required">
        <Navbar />
        <div style={{ paddingTop: '100px', textAlign: 'center', padding: '2rem' }}>
          <h2>Acceso Restringido</h2>
          <p>
            {!user ? 'Debes iniciar sesión para acceder a este contenido.' :
             !hasPremiumAccess ? 'Este contenido está disponible solo para usuarios premium.' :
             'Este contenido está disponible solo para estudiantes inscritos en el curso.'}
          </p>
          <p>
            {!user ? (
              <a href="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                Iniciar sesión
              </a>
            ) : !hasPremiumAccess ? (
              <a href="/subscription" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                Suscribirse
              </a>
            ) : (
              <a href={`/curso/videos-profesionales-ia`} style={{ color: '#2563eb', textDecoration: 'underline' }}>
                Ir a la página del curso
              </a>
            )}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
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
                  <a href="/cursos" className="breadcrumb-item">
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
                      
                      {progress.currentLesson < courseData.lessons.length - 1 && (
                        <button 
                          className="btn btn-primary"
                          onClick={handleNextLesson}
                        >
                          Siguiente lección →
                        </button>
                      )}
                      
                      {(() => {
                        const currentLesson = courseData.lessons[progress.currentLesson];
                        const currentModuleId = currentLesson.moduleId;
                        const isLastLesson = isLastLessonOfModule(currentLesson.id, currentModuleId);
                        const isCurrentLessonCompleted = progress.completedLessons.includes(currentLesson.id);
                        const isModuleAlreadyCompleted = isModuleCompleted(currentModuleId);
                        
                        if (isModuleAlreadyCompleted) {
                          return null;
                        }
                        
                        if (isLastLesson) {
                          if (isCurrentLessonCompleted) {
                            return (
                              <button 
                                className="btn btn-success"
                                onClick={() => handleCompleteModule(currentModuleId)}
                              >
                                ✅ Completar Módulo {currentModuleId}
                              </button>
                            );
                          } else {
                            return (
                              <button 
                                className="btn btn-success"
                                onClick={handleCompleteLesson}
                              >
                                ✅ Marcar como completada
                              </button>
                            );
                          }
                        } else {
                          if (!isCurrentLessonCompleted) {
                            return (
                              <button 
                                className="btn btn-success"
                                onClick={handleCompleteLesson}
                              >
                                ✅ Marcar como completada
                              </button>
                            );
                          }
                          return null;
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
                                  style={{ cursor: isLessonAccessible(globalIndex) ? 'pointer' : 'not-allowed' }}
                                >
                                  <div className="lesson-info">
                                    <span className="lesson-status">
                                      {getLessonStatus(globalIndex, lesson.id)}
                                    </span>
                                    <div className="lesson-details">
                                      <span className="lesson-title">{lesson.title}</span>
                                      <span className="lesson-duration">{lesson.duration}</span>
                                    </div>
                                  </div>
                                  {globalIndex === progress.currentLesson && <span className="current-indicator">◀</span>}
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
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}