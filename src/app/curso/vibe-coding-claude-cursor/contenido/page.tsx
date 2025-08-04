'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';

export default function ContenidoVibeCodingClaudeCursorPage() {
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
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
        const errorData = await response.json();
        console.error('🔍 [DEBUG] Error en respuesta:', errorData);
        
        if (response.status === 401) {
          router.push(`/login?redirect=/curso/${courseData.id}/contenido`);
          return;
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

  const isCourseCompleted = () => {
    return courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
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
              {courseData.lessons[progress.currentLesson]?.videoUrl && (
                <div className="lesson-video-container">
                  <VideoPlayer
                    videoUrl={courseData.lessons[progress.currentLesson].videoUrl}
                    title={courseData.lessons[progress.currentLesson].title}
                  />
                </div>
              )}
              
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
                  ← Anterior
                </button>

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

          <div className="lessons-navigation">
            <div className="navigation-header">
              <h3>Lecciones del Curso</h3>
              <div className="progress-indicator">
                <span className="progress-text">
                  Progreso: {progress.completedLessons.length} de {courseData.lessons.length} lecciones
                </span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="lessons-list">
              {Array.from(new Set(courseData.lessons.map(lesson => lesson.moduleId))).map(moduleId => {
                const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
                const isExpanded = expandedModules.has(moduleId);
                
                return (
                  <div key={moduleId} className="module-group">
                    <div 
                      className={`module-header ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleModuleExpansion(moduleId)}
                    >
                      <div className="module-title">
                        <span className="module-icon">📁</span>
                        <span>Módulo {moduleId}</span>
                      </div>
                      <div className="expand-icon">
                        {isExpanded ? '▼' : '▶'}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="module-lessons">
                        {moduleLessons.map((lesson, index) => {
                          const globalIndex = courseData.lessons.findIndex(l => l.id === lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              className={`lesson-item ${
                                globalIndex === progress.currentLesson ? 'active' : ''
                              } ${
                                isLessonCompleted(lesson.id) ? 'completed' : ''
                              }`}
                              onClick={() => handleLessonClick(globalIndex)}
                            >
                              <div className="lesson-number">{moduleId}.{index + 1}</div>
                              <div className="lesson-content">
                                <h4>{lesson.title}</h4>
                                <div className="lesson-meta">
                                  <span>{lesson.type}</span>
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>
                              <div className="lesson-status">
                                {getLessonIcon(globalIndex)}
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

            {isCourseCompleted() && (
              <div className="course-completed-message">
                <div className="completion-badge">
                  <span className="completion-icon">🎉</span>
                  <span className="completion-text">¡Curso Completado!</span>
                </div>
                <p className="completion-info">
                  Has completado todas las lecciones del curso.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

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

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .course-title {
            font-size: 1.8rem;
          }

          .header-main {
            flex-direction: column;
            gap: 1rem;
          }

          .lesson-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
} 