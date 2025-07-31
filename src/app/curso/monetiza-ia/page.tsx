'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import VideoPlayer from '@/components/courses/VideoPlayer';

import { useAuth } from '@/contexts/AuthContext';

// Contador eliminado - ya no se necesita

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function MonetizaIAPage() {
  console.log('🔍 [DEBUG] Componente MonetizaIAPage cargado');
  
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Estados del contador eliminados
  const { user, status } = useAuth();
  const router = useRouter();
  
  console.log('🔍 [DEBUG] Estados iniciales:', { 
    currentLesson, 
    completedLessons: completedLessons.length,
    progressPercentage,
    isLoading,
    user: !!user,
    userDetails: user ? { id: user.id, email: user.email } : null,
    authStatus: status
  });

  

  // useEffect del contador eliminado

  // Función completamente nueva para redirección directa
  const goToCourseContent = () => {
    console.log('🎯 Botón clickeado - Estado de autenticación:', { 
      user: !!user, 
      status, 
      userEmail: user?.email 
    });
    
    // Verificar si el usuario está autenticado
    if (status === 'loading') {
      console.log('⏳ Estado de autenticación cargando, esperando...');
      return;
    }
    
    if (!user || status === 'unauthenticated') {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/monetiza-ia/contenido`;
      console.log(`🔐 Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    // Si el usuario está logueado, ir directamente al contenido
    const contentUrl = '/curso/monetiza-ia/contenido';
    console.log(`✅ Usuario logueado (${user.email}) - Redirigiendo a contenido: ${contentUrl}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = contentUrl;
    }
  };

  const courseData = {
    id: 'monetiza-ia',
    title: 'Monetiza con la IA',
    description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
    duration: '3 horas',
    level: 'Intermedio',
    difficulty: 'Intermedio',
    category: 'Monetización',
    price: 'Gratis',
    language: 'Español',
    image: '/images/optimized/v-5.webp',
    lessonsCount: 8,
    instructor: {
      name: 'Zair Adolfo Aquino Rodriguez',
      title: 'Especialista en Monetización Digital - eGrow Academy',
      image: '/images/Zair.jpeg',
      bio: 'Experto en estrategias de monetización digital con más de 10 años de experiencia en el sector de la inteligencia artificial y el marketing digital.'
    },
    prerequisites: [
      'Conocimientos básicos de internet y tecnología',
      'Interés en generar ingresos online',
      'Disposición para aprender nuevas herramientas'
    ],
    whatYouWillLearn: [
      'Estrategias de monetización con IA',
      'Creación de productos digitales con herramientas de IA',
      'Automatización de procesos de venta',
      'Marketing digital optimizado con IA',
      'Creación de fuentes de ingresos pasivos',
      'Análisis y optimización de resultados',
      'Escalabilidad de negocios digitales',
      'Tendencias futuras en monetización con IA'
    ],
    tools: [
      'ChatGPT y herramientas de IA',
      'Plataformas de e-commerce',
      'Herramientas de marketing digital',
      'Analytics y métricas',
      'Automatización de procesos',
      'Gestión de contenido digital'
    ],
    lessons: [
      {
        id: 1,
        title: 'M0 - AI Money‑Toolkit',
        description: 'Intro | Herramientas - Checklist de apps y presets listos para facturar',
        duration: 12,
        type: 'Video',
        videoUrl: 'https://www.youtube.com/watch?v=example1'
      },
      {
        id: 2,
        title: 'M1 - Venta sin Fricción',
        description: 'Intro Ventas - Script de oferta listo para DM / llamada',
        duration: 18,
        type: 'Video',
        videoUrl: 'https://www.youtube.com/watch?v=example2'
      },
      {
        id: 3,
        title: 'M1.1 - Ayuda que Cierra',
        description: 'Vender & Ayudar - Mensaje Problema → Ayuda → Oferta (copiar‑pegar)',
        duration: 22,
        type: 'Video',
        videoUrl: 'https://www.youtube.com/watch?v=example3'
      },
      {
        id: 4,
        title: 'M2 - Soporte que Retiene',
        description: 'Servicio al Cliente - Plantilla post‑venta "fan for life"',
        duration: 25,
        type: 'Lab',
        videoUrl: 'https://www.youtube.com/watch?v=example4'
      },
      {
        id: 5,
        title: 'M2.1 - Diferénciate & Cobra Más',
        description: 'Diferénciate - One‑liner de posicionamiento ganador',
        duration: 20,
        type: 'Video',
        videoUrl: 'https://www.youtube.com/watch?v=example5'
      },
      {
        id: 6,
        title: 'M3 - IA Amplify Engine',
        description: 'Marketing con IA - Flujo Prompt → Copy → Publica',
        duration: 28,
        type: 'Video',
        videoUrl: 'https://www.youtube.com/watch?v=example6'
      },
      {
        id: 7,
        title: 'M3.1 - Mirror & Monetize',
        description: 'Aplicarlo a uno mismo - Caso demo propio (antes / después)',
        duration: 35,
        type: 'Lab',
        videoUrl: 'https://www.youtube.com/watch?v=example7'
      },
      {
        id: 8,
        title: 'M4 - Escala, Repite, Monetiza',
        description: 'Final - Plan de iteración + métrica clave',
        duration: 45,
        type: 'Project',
        videoUrl: 'https://www.youtube.com/watch?v=example8'
      }
    ]
  };

  // Calcular duración total
  const totalDuration = courseData.lessons.reduce((total, lesson) => {
    return total + lesson.duration;
  }, 0);

  // Efectos para manejar el progreso del usuario
  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect [user] ejecutado');
    console.log('🔍 [DEBUG] Estado del usuario:', { user: !!user, userId: user?.id });
    
    if (user) {
      console.log('🔍 [DEBUG] Usuario detectado, cargando progreso');
      loadUserProgress();
    } else {
      console.log('🔍 [DEBUG] No hay usuario, estableciendo isLoading = false');
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        loadUserProgress();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadUserProgress();
      }
    };

    const handlePopState = () => {
      if (user) {
        loadUserProgress();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  const loadUserProgress = async () => {
    console.log('🔍 [DEBUG] loadUserProgress iniciado');
    console.log('🔍 [DEBUG] Usuario:', { user: !!user, userId: user?.id });
    
    if (!user) {
      console.log('🔍 [DEBUG] No hay usuario, saliendo de loadUserProgress');
      return;
    }

    try {
      console.log('🔍 [DEBUG] Enviando request de progreso a /api/courses/progress');
      const response = await fetch(`/api/courses/progress?courseId=${courseData.id}`, {
        credentials: 'include',
      });

      console.log('🔍 [DEBUG] Respuesta de progreso:', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText 
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 [DEBUG] Datos de progreso recibidos:', data);
        setCurrentLesson(data.currentLesson || 0);
        setCompletedLessons(data.completedLessons || []);
        setProgressPercentage(data.progressPercentage || 0);
      } else if (response.status === 404) {
        console.log('🔍 [DEBUG] Usuario no inscrito (404), estableciendo valores por defecto');
        // Usuario no inscrito, mantener valores por defecto
        setCurrentLesson(0);
        setCompletedLessons([]);
        setProgressPercentage(0);
      } else {
        console.log('🔍 [DEBUG] Error en respuesta de progreso:', response.status);
      }
    } catch (error) {
      console.error('❌ Error al cargar el progreso:', error);
    } finally {
      setIsLoading(false);
      console.log('🔍 [DEBUG] loadUserProgress completado, isLoading = false');
    }
  };

  const getRemainingTime = () => {
    if (completedLessons.length === 0) {
      return `${totalDuration}min`;
    }
    
    const remainingLessons = courseData.lessons.length - completedLessons.length;
    const averageTimePerLesson = totalDuration / courseData.lessons.length;
    const totalRemainingTime = remainingLessons * averageTimePerLesson;
    
    const hours = Math.floor(totalRemainingTime / 60);
    const minutes = Math.round(totalRemainingTime % 60);
    return `${hours}h ${minutes}min`;
  };

  console.log('🔍 [DEBUG] Renderizando componente, isLoading:', isLoading, 'authStatus:', status);
  
  // Mostrar loading mientras se verifica la autenticación o se carga el progreso
  if (status === 'loading' || isLoading) {
    console.log('🔍 [DEBUG] Mostrando loading unificado:', { status, isLoading });
    return (
      <div className="loading-container" suppressHydrationWarning>
        <LoadingSpinner />
        <p>Cargando...</p>
      </div>
    );
  }

  // Verificar que el estado de autenticación esté completamente cargado
  const isUserAuthenticated = user && status === 'authenticated';

  console.log('🔍 [DEBUG] Renderizando JSX principal');
  
  return (
    <>
      {/* Header separado con altura exacta del navbar */}
      <header className="navbar-spacer h-14 md:h-16"></header>
      
      <Navbar />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="course-hero">
              <div className="course-info">
                <div className="course-badges">
                  <span className="badge badge-free">Gratis</span>
                  <span className="badge badge-level">{courseData.level}</span>
                  <span className="badge badge-duration">Duración: {courseData.duration}</span>
                </div>
                
                <h1 className="course-title-large">{courseData.title}</h1>
                <p className="course-description course-description-dark">{courseData.description}</p>
                
                {/* Video solo para móvil - entre descripción y botón */}
                <div className="mobile-video-preview">
                  <VideoPlayer
                    videoUrl="https://www.youtube.com/watch?v=hBuXs6NYesw"
                    title="Preview del Curso - Monetiza con IA"
                    className="mobile-preview-video"
                  />
                </div>
                
                {/* Botón nuevo completamente desde cero */}
                <div className="new-course-actions">
                  {isUserAuthenticated && completedLessons.length > 0 ? (
                    <div className="progress-section-new">
                      <div className="progress-info-new">
                        <p className="progress-text-new">
                          📚 <strong>Progreso actual:</strong> Lección {currentLesson + 1} de {courseData.lessons.length}
                        </p>
                        <p className="progress-detail-new">
                          {completedLessons.length} lecciones completadas • {Math.round(progressPercentage)}% del curso
                        </p>
                      </div>
                      <div 
                        className="course-action-button course-action-continue"
                        onClick={goToCourseContent}
                      >
                        🚀 Continuar con el curso
                      </div>
                    </div>
                  ) : (
                    <div className="start-section-new">
                      <div 
                        className="course-action-button course-action-start"
                        onClick={goToCourseContent}
                      >
                        {isUserAuthenticated ? '🎯 Comenzar Curso Gratis' : '🔐 Iniciar Sesión para Comenzar'}
                      </div>
                      
                      {/* Contador eliminado */}
                    </div>
                  )}
                </div>
                
                <div className="course-meta">
                  <div className="course-badges-secondary">
                    <span className="badge badge-language">🌍 {courseData.language}</span>
                    <span className="badge badge-includes">📦 Proyecto práctico incluido</span>
                    <span className="badge badge-access">🔓 Acceso de por vida</span>
                  </div>
                </div>
              </div>
              
              <div className="course-preview">
                <VideoPlayer
                  videoUrl="https://www.youtube.com/watch?v=hBuXs6NYesw"
                  title="Preview del Curso - Monetiza con IA"
                  className="desktop-preview-video"
                />
                
                {isUserAuthenticated && (
                  <div className="progress-card">
                    <h3>Tu Progreso</h3>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="progress-details">
                      <p className="progress-text">
                        {completedLessons.length}/{courseData.lessons.length} lecciones completadas
                      </p>
                      <p className="progress-remaining">
                        {courseData.lessons.length - completedLessons.length} módulos restantes • {getRemainingTime()}
                      </p>
                    </div>
                    {completedLessons.length > 0 && (
                      <div 
                        className="course-action-button course-action-resume"
                        onClick={goToCourseContent}
                      >
                        🔄 Continuar donde lo dejaste
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              {/* Main Content - Desktop */}
              <div className="main-content-area desktop-content">
                {/* Curriculum */}
                <div className="curriculum-section">
                  <h2>Contenido del Curso</h2>
                  <div className="curriculum-stats">
                    <div className="stat-item">
                      <span className="stat-number">{courseData.lessons.length}</span>
                      <span className="stat-label">Lecciones</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{totalDuration}</span>
                      <span className="stat-label">Minutos</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{courseData.level}</span>
                      <span className="stat-label">Nivel</span>
                    </div>
                  </div>
                  
                  <div className="lessons-list">
                    <div className="lessons-grid">
                      {courseData.lessons.map((lesson, index) => (
                        <div key={lesson.id} className={`lesson-card ${completedLessons.includes(index) ? 'completed' : ''}`}>
                          <div className="lesson-header">
                            <div className="lesson-number">{index + 1}</div>
                            <div className="lesson-status">
                              {completedLessons.includes(index) ? '✓' : '○'}
                            </div>
                          </div>
                          <div className="lesson-content">
                            <h4 className="lesson-title">{lesson.title}</h4>
                            <p className="lesson-description">{lesson.description}</p>
                            <div className="lesson-meta">
                              <span className="lesson-type">{lesson.type}</span>
                              <span className="lesson-duration">{lesson.duration}min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="learning-objectives">
                  <h2>Lo que Aprenderás</h2>
                  
                  <div className="course-introduction">
                    <p>
                      La <strong>monetización con inteligencia artificial</strong> representa una de las oportunidades 
                      más prometedoras en el panorama digital actual. Con el auge de herramientas como ChatGPT, 
                      Claude y otras plataformas de IA, se han abierto nuevas posibilidades para crear fuentes 
                      de ingresos innovadoras y escalables.
                    </p>
                    
                    <p>
                      Este curso te guiará a través de estrategias prácticas y probadas para monetizar 
                      efectivamente las herramientas de IA. Desde la creación de productos digitales hasta 
                      la automatización de procesos de venta, aprenderás cómo construir un negocio digital 
                      que funcione las 24 horas del día, los 7 días de la semana.
                    </p>
                    
                    <p>
                      A diferencia de otros cursos que se enfocan únicamente en la teoría, aquí encontrarás 
                      implementaciones reales y casos de estudio de personas que ya están generando ingresos 
                      significativos utilizando estas estrategias.
                    </p>
                  </div>
                  
                  <div className="objectives-grid">
                    {courseData.whatYouWillLearn.map((objective, index) => (
                      <div key={index} className="objective-item">
                        <span className="objective-check">✓</span>
                        <span>{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools and Technologies */}
                <div className="tools-section">
                  <h2>Herramientas y Tecnologías</h2>
                  <div className="tools-grid">
                    {courseData.tools.map((tool, index) => (
                      <div key={index} className="tool-item">
                        <span className="tool-icon">🔧</span>
                        <span>{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar - Desktop Only */}
              <div className="content-sidebar">
                {/* Instructor */}
                <div className="instructor-card">
                  <h3>Tu Instructor</h3>
                  <div className="instructor-info">
                    <div className="instructor-avatar-container">
                      <img src={courseData.instructor.image} alt={courseData.instructor.name} className="instructor-avatar" />
                    </div>
                    <div className="instructor-details">
                      <h4>{courseData.instructor.name}</h4>
                      <p className="instructor-title">{courseData.instructor.title}</p>
                      <p className="instructor-bio">{courseData.instructor.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="prerequisites-card">
                  <h3>Prerrequisitos</h3>
                  <ul className="prerequisites-list">
                    {courseData.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Curriculum Section */}
        <section className="mobile-curriculum-section">
          <div className="container">
            <div className="curriculum-section">
              <h2>Contenido del Curso</h2>
              <div className="curriculum-stats">
                <div className="stat-item">
                  <span className="stat-number">{courseData.lessons.length}</span>
                  <span className="stat-label">Lecciones</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{totalDuration}</span>
                  <span className="stat-label">Minutos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{courseData.level}</span>
                  <span className="stat-label">Nivel</span>
                </div>
              </div>
              
              <div className="lessons-list">
                <div className="lessons-grid">
                  {courseData.lessons.map((lesson, index) => (
                    <div key={lesson.id} className={`lesson-card ${completedLessons.includes(index) ? 'completed' : ''}`}>
                      <div className="lesson-header">
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-status">
                          {completedLessons.includes(index) ? '✓' : '○'}
                        </div>
                      </div>
                      <div className="lesson-content">
                        <h4 className="lesson-title">{lesson.title}</h4>
                        <p className="lesson-description">{lesson.description}</p>
                        <div className="lesson-meta">
                          <span className="lesson-type">{lesson.type}</span>
                          <span className="lesson-duration">{lesson.duration}min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Instructor Section */}
        <section className="mobile-instructor-section">
          <div className="container">
            <div className="instructor-card">
              <h3>Tu Instructor</h3>
              <div className="instructor-info">
                <div className="instructor-avatar-container">
                  <img src={courseData.instructor.image} alt={courseData.instructor.name} className="instructor-avatar" />
                </div>
                <div className="instructor-details">
                  <h4>{courseData.instructor.name}</h4>
                  <p className="instructor-title">{courseData.instructor.title}</p>
                  <p className="instructor-bio">{courseData.instructor.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Prerequisites Section */}
        <section className="mobile-prerequisites-section">
          <div className="container">
            <div className="prerequisites-card">
              <h3>Prerrequisitos</h3>
              <ul className="prerequisites-list">
                {courseData.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Mobile Learning Objectives Section */}
        <section className="mobile-learning-section">
          <div className="container">
            <div className="learning-objectives">
              <h2>Lo que Aprenderás</h2>
              
              <div className="course-introduction">
                <p>
                  La <strong>monetización con inteligencia artificial</strong> representa una de las oportunidades 
                  más prometedoras en el panorama digital actual. Con el auge de herramientas como ChatGPT, 
                  Claude y otras plataformas de IA, se han abierto nuevas posibilidades para crear fuentes 
                  de ingresos innovadoras y escalables.
                </p>
                
                <p>
                  Este curso te guiará a través de estrategias prácticas y probadas para monetizar 
                  efectivamente las herramientas de IA. Desde la creación de productos digitales hasta 
                  la automatización de procesos de venta, aprenderás cómo construir un negocio digital 
                  que funcione las 24 horas del día, los 7 días de la semana.
                </p>
                
                <p>
                  A diferencia de otros cursos que se enfocan únicamente en la teoría, aquí encontrarás 
                  implementaciones reales y casos de estudio de personas que ya están generando ingresos 
                  significativos utilizando estas estrategias.
                </p>
              </div>
              
              <div className="objectives-grid">
                {courseData.whatYouWillLearn.map((objective, index) => (
                  <div key={index} className="objective-item">
                    <span className="objective-check">✓</span>
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Tools Section */}
        <section className="mobile-tools-section">
          <div className="container">
            <div className="tools-section">
              <h2>Herramientas y Tecnologías</h2>
              <div className="tools-grid">
                {courseData.tools.map((tool, index) => (
                  <div key={index} className="tool-item">
                    <span className="tool-icon">🔧</span>
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

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

        .navbar-spacer {
          width: 100%;
          background: transparent;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          margin-top: 0;
        }

        .course-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-badges {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-free {
          background: #22c55e;
          color: white;
        }

        .badge-level {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge-duration {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .course-title-large {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.6rem 0;
          line-height: 1.2;
        }

        .course-description {
          font-size: 1rem;
          line-height: 1.5;
          margin: 0 0 1rem 0;
          opacity: 0.9;
        }

        .course-actions {
          margin-bottom: 2rem;
        }

        .new-course-actions {
          margin-bottom: 1.5rem;
        }

                  /* Ocultar video móvil en desktop */
          .mobile-video-preview {
            display: none;
          }
          
          /* Estilos para videos de preview */
          .mobile-preview-video {
            margin: 1.5rem 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          
          .desktop-preview-video {
            margin: 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          }

        .progress-section-new {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .progress-info-new {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-text-new {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .progress-detail-new {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .start-section-new {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .course-actions-with-progress {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .progress-summary {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-status {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }

        .progress-detail {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
        }

        .btn-large {
          padding: 1.25rem 2.5rem;
          font-size: 1.1rem;
        }

        .btn-continue-course {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .btn-continue-course:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .course-meta {
          margin-top: 0.75rem;
        }

        .course-badges-secondary {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge-language, .badge-includes, .badge-access {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .course-preview {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preview-video {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .preview-video img {
          width: 100%;
          height: auto;
          display: block;
        }

        .play-button {
          position: absolute;
          top: 80%;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #1f2937;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(3px);
        }

        .play-button:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: translateX(-50%) scale(1.1);
        }

        .course-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        /* Estilos del contador eliminados */

        .progress-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-top: 2rem;
          text-align: center;
        }

        .progress-card h3 {
          margin: 0 0 1.5rem 0;
          color: #1f2937;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          transition: width 0.3s ease;
        }

        .progress-details {
          margin-bottom: 1rem;
        }

        .progress-text, .progress-remaining {
          margin: 0.25rem 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .btn-outline {
          background: transparent;
          color: #22c55e;
          border: 2px solid #22c55e;
        }

        .btn-outline:hover {
          background: #22c55e;
          color: white;
        }

        .btn-small {
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
        }

        .course-action-button {
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          justify-content: center;
        }

        .course-action-start {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .course-action-start:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
        }

        .course-action-continue {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .course-action-continue:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .course-action-resume {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          margin-top: 1rem;
        }

        .course-action-resume:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }

        .course-content {
          padding: 4rem 0;
          background: #f9fafb;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .curriculum-section, .learning-objectives, .tools-section {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .curriculum-section h2, .learning-objectives h2, .tools-section h2 {
          margin: 0 0 1.5rem 0;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .curriculum-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #22c55e;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lessons-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .lesson-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: row;
          gap: 1rem;
          align-items: flex-start;
          width: 100%;
          min-height: 140px;
          box-sizing: border-box;
        }

        .lesson-card:hover {
          border-color: #22c55e;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
          transform: translateY(-2px);
        }

        .lesson-card.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .lesson-card.completed:hover {
          background: #dcfce7;
        }

        .lesson-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .lesson-number {
          width: 32px;
          height: 32px;
          background: #22c55e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .lesson-status {
          font-size: 1.2rem;
          font-weight: 700;
          color: #22c55e;
        }

        .lesson-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .lesson-title {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.3;
        }

        .lesson-description {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .lesson-meta {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .lesson-type, .lesson-duration {
          font-size: 0.65rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-weight: 500;
        }

                  .lesson-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          /* Estilos responsive para grid móvil */
          @media (max-width: 768px) {
            .lessons-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 0.75rem;
              justify-items: stretch;
              align-items: stretch;
              width: 100%;
              max-width: 100%;
            }

            .lesson-card {
              padding: 0.75rem;
              gap: 0.5rem;
              width: 100%;
              height: 300px;
              box-sizing: border-box;
              flex-direction: column;
              overflow: hidden;
              display: flex;
            }

            .lesson-number {
              width: 28px;
              height: 28px;
              font-size: 0.8rem;
            }

            .lesson-status {
              font-size: 1rem;
            }

            .lesson-title {
              font-size: 0.8rem;
              line-height: 1.2;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .lesson-description {
              font-size: 0.7rem;
              line-height: 1.3;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
            }

            .lesson-meta {
              gap: 0.4rem;
              margin-top: 0.4rem;
            }

            .lesson-type, .lesson-duration {
              font-size: 0.6rem;
              padding: 0.15rem 0.3rem;
            }
          }

        .lesson-item:hover {
          border-color: #22c55e;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .lesson-number {
          width: 40px;
          height: 40px;
          background: #22c55e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .lesson-content {
          flex: 1;
        }

        .lesson-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .lesson-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 0.5rem;
        }

        .lesson-type, .lesson-duration {
          font-size: 0.8rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .lesson-description {
          margin: 0;
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .lesson-status {
          font-size: 1.5rem;
          color: #22c55e;
          font-weight: 700;
        }

        .course-introduction {
          margin-bottom: 2rem;
        }

        .course-introduction p {
          margin: 0 0 1rem 0;
          line-height: 1.6;
          color: #4b5563;
        }

        .objectives-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .objective-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid #22c55e;
        }

        .objective-check {
          color: #22c55e;
          font-weight: 700;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .tool-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .tool-icon {
          font-size: 1.5rem;
        }

        .content-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .mobile-instructor-section {
          display: none;
          padding: 2rem 0;
          background: #f9fafb;
        }

        .mobile-prerequisites-section {
          display: none;
          padding: 2rem 0;
          background: #f3f4f6;
        }

        .mobile-curriculum-section {
          display: none;
          padding: 2rem 0;
          background: #ffffff;
        }

        .mobile-learning-section {
          display: none;
          padding: 2rem 0;
          background: #f9fafb;
        }

        .mobile-tools-section {
          display: none;
          padding: 2rem 0;
          background: #ffffff;
        }

        .instructor-card, .prerequisites-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .instructor-card h3, .prerequisites-card h3 {
          margin: 0 0 1.5rem 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .instructor-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
          text-align: center;
        }

        .instructor-avatar-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .instructor-avatar {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 4px solid #f3f4f6;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .instructor-details h4 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .instructor-title {
          margin: 0 0 0.75rem 0;
          color: #22c55e;
          font-weight: 600;
          font-size: 1rem;
        }

        .instructor-bio {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #6b7280;
          max-width: 280px;
        }

        .prerequisites-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .prerequisites-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          color: #4b5563;
        }

        .prerequisites-list li:last-child {
          border-bottom: none;
        }

        .prerequisites-list li::before {
          content: "✓";
          color: #22c55e;
          font-weight: 700;
          margin-right: 0.5rem;
        }

        @media (max-width: 768px) {
          .course-hero {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          /* Ocultar video en su posición original en móvil */
          .course-preview {
            display: none;
          }

          /* Mostrar video móvil entre descripción y botón */
          .mobile-video-preview {
            display: block;
            margin: 1.5rem 0;
          }

          .mobile-preview-video {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .content-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
            justify-items: center;
          }

          /* Ocultar contenido desktop en móvil */
          .desktop-content {
            display: none;
          }

          .content-sidebar {
            display: none;
          }

          /* Mostrar secciones móviles */
          .mobile-curriculum-section {
            display: block;
          }

          .mobile-learning-section {
            display: block;
          }

          .mobile-tools-section {
            display: block;
          }

          .mobile-instructor-section {
            display: block;
          }

          .mobile-prerequisites-section {
            display: block;
          }

          .curriculum-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .objectives-grid, .tools-grid {
            grid-template-columns: 1fr;
          }

          .course-title-large {
            font-size: 1.4rem;
            line-height: 1.2;
            margin-bottom: 0.5rem;
          }

          .course-description {
            font-size: 0.85rem;
            line-height: 1.3;
            margin-bottom: 0.75rem;
          }

          .btn-large {
            padding: 0.9rem 1.8rem;
            font-size: 0.95rem;
          }

          /* Ajustar badges en móvil */
          .course-badges {
            gap: 0.25rem;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
          }

          .badge {
            padding: 0.15rem 0.5rem;
            font-size: 0.7rem;
            border-radius: 6px;
          }

          .course-badges-secondary {
            gap: 0.3rem;
            flex-wrap: wrap;
          }

          .badge-language, .badge-includes, .badge-access {
            font-size: 0.65rem;
            padding: 0.1rem 0.4rem;
          }

          /* Ajustar botones de acción en móvil */
          .course-action-button {
            font-size: 0.85rem;
            padding: 0.7rem 1.2rem;
            border-radius: 8px;
          }

          /* Ajustar secciones de progreso en móvil */
          .progress-info-new {
            padding: 0.8rem;
            border-radius: 6px;
          }

          .progress-text-new {
            font-size: 0.85rem;
            margin-bottom: 0.4rem;
          }

          .progress-detail-new {
            font-size: 0.75rem;
          }

          /* Ajustar hero section padding en móvil */
          .hero-section {
            padding: 0.75rem 0;
          }

          /* Ajustar navbar spacer en móvil */
          .navbar-spacer {
            height: 3.5rem; /* 56px - altura exacta del navbar móvil */
          }

          .course-hero {
            gap: 0.75rem;
            padding: 0.5rem 0;
          }

          .container {
            padding: 0 1rem;
          }

          /* Ajustar espaciado de elementos */
          .course-meta {
            margin-top: 0.75rem;
          }
        }
      `}</style>
    </>
  );
} 