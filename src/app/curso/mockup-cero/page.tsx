'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import VideoPlayer from '@/components/courses/VideoPlayer';

import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function MockupCeroPage() {
  console.log('🔍 [DEBUG] Componente MockupCeroPage cargado');
  
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);
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

  // Función para alternar la expansión de lecciones
  const toggleLesson = (index: number) => {
    setExpandedLessons(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Función para inscribir e ir al contenido del curso
  const goToCourseContent = async () => {
    console.log('🎯 [MOCKUP-PAGE] Botón clickeado - Estado de autenticación:', { 
      user: !!user, 
      status, 
      userEmail: user?.email,
      userId: user?.id 
    });
    
    // Verificar si el usuario está autenticado
    if (status === 'loading') {
      console.log('⏳ [MOCKUP-PAGE] Estado de autenticación cargando, esperando...');
      return;
    }
    
    if (!user || status === 'unauthenticated') {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/mockup-cero/contenido`;
      console.log(`🔐 [MOCKUP-PAGE] Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    // Si el usuario está logueado, inscribirlo automáticamente y redirigir
    console.log(`✅ [MOCKUP-PAGE] Usuario logueado (${user.email}) - Inscribiendo y redirigiendo...`);
    
    try {
      console.log('🔄 [MOCKUP-PAGE] Iniciando inscripción automática...');
      
      // Inscribir automáticamente al usuario
      const enrollResponse = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: courseData.id }),
        credentials: 'include',
      });
      
      console.log('📡 [MOCKUP-PAGE] Respuesta de inscripción:', { 
        status: enrollResponse.status, 
        ok: enrollResponse.ok 
      });
      
      if (enrollResponse.ok) {
        const enrollData = await enrollResponse.json();
        console.log('✅ [MOCKUP-PAGE] Usuario inscrito automáticamente:', enrollData);
      } else {
        const errorData = await enrollResponse.text();
        console.error('⚠️ [MOCKUP-PAGE] Error al inscribir:', { 
          status: enrollResponse.status, 
          error: errorData 
        });
      }
    } catch (error) {
      console.error('❌ [MOCKUP-PAGE] Error en inscripción automática:', error);
    }
    
    // Redirigir al contenido del curso independientemente del resultado de la inscripción
    const contentUrl = '/curso/mockup-cero/contenido';
    console.log(`🔄 [MOCKUP-PAGE] Redirigiendo a: ${contentUrl}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = contentUrl;
    }
  };

  const courseData = {
    id: 'mockup-cero',
    title: 'Crea Mockups con IA desde cero',
    description: 'Aprende a presentar ideas, productos y servicios de manera visual y profesional sin experiencia previa en diseño. Domina herramientas de IA como ChatGPT, Canva y Sora para crear mockups modernos en formatos web, móvil, producto y redes sociales. Incluye prompts listos para usar y un mini portafolio al finalizar.',
    duration: '5 horas',
    level: 'Principiante',
    difficulty: 'Principiante',
    categoryText: 'Online • Certificado digital incluido',
    category: 'Diseño y Mockups',
    price: 'Gratis',
    language: 'Español',
    image: '/images/19.png',
    lessonsCount: 25,
    instructor: {
      name: 'eGrow Academy',
      title: 'Especialista en Diseño y Mockups con IA - eGrow Academy',
      image: '/images/Rick.png',
      bio: 'Experto en diseño de mockups y prototipado con herramientas de IA, con más de 4 años de experiencia en diseño digital y UX/UI.'
    },
    prerequisites: [
      'Manejo básico de internet.',
      'Tener cuentas activas en Canva, Sora (generador de video IA) y acceso a ChatGPT.',
      'Computadora con navegador actualizado.'

    ],
    whatYouWillLearn: [
      'Fundamentos del diseño de mockups',
      'Uso de herramientas de IA para mockups',
      'Creación de mockups para sitios web',
      'Diseño de mockups para aplicaciones móviles',
      'Mockups de productos y branding',
      'Presentaciones profesionales con Sora',
      'Técnicas de prototipado rápido',
      'Mejores prácticas del diseño UX/UI'
    ],
    tools: [
      'Figma con IA',
      'Adobe XD',
      'Canva Pro',
      'Midjourney',
      'DALL-E 3',
      'Sora (OpenAI)',
      'Framer',
      'Sketch'
    ],
    lessons: [
      {
        id: 1,
        title: 'MÓDULO 1: Introducción al Mockup',
        description: 'Comprende los fundamentos del diseño de mockups, su importancia en el proceso de diseño y las herramientas de IA disponibles',
        duration: 50,
        type: 'Video',
        videoUrl: 'https://www.youtube.com/watch?v=example1',
        lessonsCount: 4
      },
      {
        id: 2,
        title: 'MÓDULO 2: Preparación y Análisis',
        description: 'Aprende a analizar proyectos, definir requisitos y preparar el entorno de trabajo para crear mockups efectivos',
        duration: 65,
        type: 'Lab',
        videoUrl: 'https://www.youtube.com/watch?v=example2',
        lessonsCount: 5
      },
      {
        id: 3,
        title: 'MÓDULO 3: Creación de Mockups Web',
        description: 'Domina la creación de mockups para sitios web responsive utilizando herramientas de inteligencia artificial',
        duration: 70,
        type: 'Lab',
        videoUrl: 'https://www.youtube.com/watch?v=example3',
        lessonsCount: 6
      },
      {
        id: 4,
        title: 'MÓDULO 4: Mockups para Móvil y Apps',
        description: 'Especialízate en el diseño de mockups para aplicaciones móviles y interfaces de usuario optimizadas',
        duration: 75,
        type: 'Lab',
        videoUrl: 'https://www.youtube.com/watch?v=example4',
        lessonsCount: 5
      },
      {
        id: 5,
        title: 'MÓDULO 5: Mockups de Producto, Branding y Presentación con Sora',
        description: 'Crea mockups de productos físicos, desarrolla branding coherente y presenta tus diseños con Sora AI',
        duration: 80,
        type: 'Project',
        videoUrl: 'https://www.youtube.com/watch?v=example5',
        lessonsCount: 5
      }
    ]
  };

  // Calcular duración total
  const totalDuration = courseData.lessons.reduce((total, lesson) => {
    return total + lesson.duration;
  }, 0);

  // Efectos para manejar el progreso del usuario
  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect [user, status] ejecutado');
    console.log('🔍 [DEBUG] Estado del usuario:', { user: !!user, userId: user?.id, status });
    
    if (user && status === 'authenticated') {
      console.log('🔍 [DEBUG] Usuario autenticado detectado, cargando progreso');
      loadUserProgress();
    } else if (status === 'unauthenticated' || (!user && status !== 'loading')) {
      console.log('🔍 [DEBUG] Usuario no autenticado, estableciendo isLoading = false');
      setIsLoading(false);
    } else {
      console.log('🔍 [DEBUG] Estado de autenticación en progreso...');
    }
  }, [user, status]);

  useEffect(() => {
    const handleFocus = () => {
      if (user && status === 'authenticated') {
        loadUserProgress();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user && status === 'authenticated') {
        loadUserProgress();
      }
    };

    const handlePopState = () => {
      if (user && status === 'authenticated') {
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
  }, [user, status]);

  // YouTube API para controlar animación del video
  useEffect(() => {
    // Cargar YouTube API
    const loadYouTubeAPI = () => {
      if (typeof window !== 'undefined' && !(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      }
    };

    // Función global para YouTube API
    (window as any).onYouTubeIframeAPIReady = () => {
      const player = new (window as any).YT.Player('youtube-iframe', {
        events: {
          'onStateChange': (event: any) => {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                videoPlayer.classList.add('playing');
              } else if (event.data === (window as any).YT.PlayerState.PAUSED || 
                         event.data === (window as any).YT.PlayerState.ENDED) {
                videoPlayer.classList.remove('playing');
              }
            }
          }
        }
      });
    };

    loadYouTubeAPI();
  }, []);

  const loadUserProgress = async () => {
    console.log('🔍 [DEBUG] loadUserProgress iniciado');
    console.log('🔍 [DEBUG] Usuario:', { user: !!user, userId: user?.id, status });
    
    if (!user || status !== 'authenticated') {
      console.log('🔍 [DEBUG] Usuario no autenticado, saliendo de loadUserProgress');
      setIsLoading(false);
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
        console.log('🔍 [DEBUG] Actualizando estados locales...');
        
        const newCurrentLesson = data.currentLesson || 0;
        const newCompletedLessons = data.completedLessons || [];
        const newProgressPercentage = data.progressPercentage || 0;
        
        setCurrentLesson(newCurrentLesson);
        setCompletedLessons(newCompletedLessons);
        setProgressPercentage(newProgressPercentage);
        
        console.log('🔍 [DEBUG] Estados actualizados:', {
          currentLesson: newCurrentLesson,
          completedLessonsLength: newCompletedLessons.length,
          progressPercentage: newProgressPercentage
        });
        
        // Verificar si debería mostrar "Continuar"
        const shouldShowContinue = newCompletedLessons.length > 0;
        console.log('🔍 [DEBUG] Debería mostrar "Continuar":', shouldShowContinue);
        
      } else if (response.status === 404) {
        console.log('🔍 [DEBUG] Usuario no inscrito (404), estableciendo valores por defecto');
        setCurrentLesson(0);
        setCompletedLessons([]);
        setProgressPercentage(0);
      } else {
        console.log('🔍 [DEBUG] Error en respuesta de progreso:', response.status);
        const errorText = await response.text();
        console.log('🔍 [DEBUG] Error details:', errorText);
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
      return `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}min`;
    }
    
    const remainingLessons = courseData.lessonsCount - completedLessons.length;
    const averageTimePerLesson = totalDuration / courseData.lessonsCount;
    const totalRemainingTime = remainingLessons * averageTimePerLesson;
    
    const hours = Math.floor(totalRemainingTime / 60);
    const minutes = Math.round(totalRemainingTime % 60);
    return `${hours}h ${minutes}min`;
  };

  // Mapeo de las lecciones por módulo para determinar si un módulo está completado
  const getModuleLessons = (moduleId: number): string[] => {
    const lessonsByModule: Record<number, string[]> = {
      1: ['mockup1', 'mockup2', 'mockup3', 'mockup4'],
      2: ['mockup5', 'mockup6', 'mockup7', 'mockup8', 'mockup9'],
      3: ['mockup10', 'mockup11', 'mockup12', 'mockup13', 'mockup14', 'mockup15'],
      4: ['mockup16', 'mockup17', 'mockup18', 'mockup19', 'mockup20'],
      5: ['mockup21', 'mockup22', 'mockup23', 'mockup24', 'mockup25']
    };
    return lessonsByModule[moduleId] || [];
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    const moduleLessons = getModuleLessons(moduleId);
    return moduleLessons.every(lessonId => completedLessons.includes(lessonId));
  };

  // Calcular módulos completados (hay 5 módulos en total)
  const getCompletedModulesCount = (): number => {
    let completedCount = 0;
    for (let moduleId = 1; moduleId <= 5; moduleId++) {
      if (isModuleCompleted(moduleId)) {
        completedCount++;
      }
    }
    return completedCount;
  };

  // Calcular porcentaje de progreso basado en módulos (5 módulos total)
  const getModuleProgressPercentage = (): number => {
    const completedModules = getCompletedModulesCount();
    return Math.round((completedModules / 5) * 100);
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
  console.log('🔍 [DEBUG] Estados finales antes del render:', {
    user: !!user,
    status,
    isUserAuthenticated,
    completedLessonsLength: completedLessons.length,
    currentLesson,
    progressPercentage,
    isLoading
  });
  console.log('🔍 [DEBUG] Condición del botón (isUserAuthenticated && completedLessons.length > 0):', isUserAuthenticated && completedLessons.length > 0);
  
  return (
    <>
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
                    videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    title="Mockups con IA desde cero - Preview"
                    className="mobile-preview-video"
                  />
                </div>
                
                {/* Botón nuevo completamente desde cero */}
                <div className="new-course-actions">
                  {isUserAuthenticated && completedLessons.length > 0 ? (
                    <div className="progress-section-new">
                      <div className="progress-info-new">
                        <p className="progress-text-new">
                          📚 <strong>Progreso actual:</strong> Lección {currentLesson + 1} de {courseData.lessonsCount}
                        </p>
                        <div className="progress-bar-new">
                          <div className="progress-fill-new" style={{ width: `${Math.round(progressPercentage)}%` }}></div>
                        </div>
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
                    </div>
                  )}
                </div>
                
                <div className="course-meta">
                  <div className="course-badges-secondary">
                    <span className="badge badge-language">🌍 {courseData.language}</span>
                    <span className="badge badge-includes">💻 Modalidad Online</span>
                    <span className="badge badge-access">🏆 Certificado Digital Incluido</span>
                  </div>
                </div>
              </div>
              
              <div className="course-preview">
                <VideoPlayer
                  videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  title="Mockups con IA desde cero - Preview"
                  className="desktop-preview-video"
                />
                
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
                      <span className="stat-number">{courseData.lessonsCount}</span>
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
                        <div key={lesson.id} className={`lesson-card ${isModuleCompleted(lesson.id) ? 'completed' : ''}`}>
                          <div className="lesson-header">
                            <div className="lesson-number">{index + 1}</div>
                            <div className="lesson-status">
                              {isModuleCompleted(lesson.id) ? '✓' : '○'}
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
                  <h2>Objetivo del Curso</h2>
                  
                  <div className="course-introduction">
                    <p>
                      <strong>Al finalizar este curso, el estudiante será capaz de:</strong>
                    </p>
                    
                    <ul className="course-objectives-list">
                      <li>Reconocer los tipos de mockups más utilizados en la industria del diseño gráfico y cómo aplicarlos con diseños generados por IA</li>
                      <li>Manejar correctamente herramientas de IA como Chat GPT, Sora de OpenAI y funciones avanzadas de Canva</li>
                    </ul>
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
                        <span className="tool-icon">🎨</span>
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
                  <span className="stat-number">{courseData.lessonsCount}</span>
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
                <div className="lessons-horizontal">
                  {courseData.lessons.map((lesson, index) => (
                    <div key={lesson.id} className={`lesson-item-horizontal ${isModuleCompleted(lesson.id) ? 'completed' : ''}`}>
                      <div className="lesson-header-horizontal" onClick={() => toggleLesson(index)}>
                        <div className="lesson-number-horizontal">{index + 1}</div>
                        <div className="lesson-title-horizontal">{lesson.title}</div>
                        <div className="lesson-status-horizontal">
                          {isModuleCompleted(lesson.id) ? '✓' : '○'}
                        </div>
                        <div className="lesson-toggle">
                          {expandedLessons.includes(index) ? '−' : '+'}
                        </div>
                      </div>
                      {expandedLessons.includes(index) && (
                        <div className="lesson-description-expanded">
                          <p className="lesson-description-text">{lesson.description}</p>
                          <div className="lesson-meta-horizontal">
                            <span className="lesson-type-horizontal">{lesson.type}</span>
                            <span className="lesson-duration-horizontal">{lesson.duration}min</span>
                          </div>
                        </div>
                      )}
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
              <h2>Objetivo del Curso</h2>
              
              <div className="course-introduction">
                <p>
                  <strong>Al finalizar este curso, el estudiante será capaz de:</strong>
                </p>
                
                <ul className="course-objectives-list">
                  <li>Reconocer los tipos de mockups más utilizados en la industria del diseño gráfico y cómo aplicarlos con diseños generados por IA</li>
                  <li>Manejar correctamente herramientas de IA como Chat GPT, Sora de OpenAI y funciones avanzadas de Canva</li>
                </ul>
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
                    <span className="tool-icon">🎨</span>
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
          position: relative;
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

        .progress-bar-new {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          overflow: hidden;
          margin: 0.5rem 0;
        }

        .progress-fill-new {
          height: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          transition: width 0.3s ease;
          border-radius: 3px;
        }

        .start-section-new {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
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

        .lessons-horizontal {
          display: none;
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

        .course-introduction {
          margin-bottom: 2rem;
        }

        .course-introduction p {
          margin: 0 0 1rem 0;
          line-height: 1.6;
          color: #4b5563;
        }

        .course-objectives-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .course-objectives-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
          color: #4b5563;
          line-height: 1.6;
        }

        .course-objectives-list li:last-child {
          border-bottom: none;
        }

        .course-objectives-list li::before {
          content: "🎯";
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
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

        .mobile-instructor-section,
        .mobile-prerequisites-section,
        .mobile-curriculum-section,
        .mobile-learning-section,
        .mobile-tools-section {
          display: none;
          padding: 2rem 0;
        }

        .mobile-curriculum-section {
          background: #ffffff;
        }

        .mobile-learning-section {
          background: #f9fafb;
        }

        .mobile-tools-section {
          background: #ffffff;
        }

        .mobile-instructor-section {
          background: #f9fafb;
        }

        .mobile-prerequisites-section {
          background: #f3f4f6;
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

          .course-preview {
            display: none;
          }

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

          .desktop-content {
            display: none;
          }

          .content-sidebar {
            display: none;
          }

          .mobile-curriculum-section,
          .mobile-learning-section,
          .mobile-tools-section,
          .mobile-instructor-section,
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

          .course-action-button {
            font-size: 0.85rem;
            padding: 0.7rem 1.2rem;
            border-radius: 8px;
          }

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

          .lessons-horizontal {
            display: flex !important;
            flex-direction: column;
            gap: 0.5rem;
            max-width: 100%;
            margin: 0 auto;
          }

          .lessons-grid {
            display: none;
          }

          .lesson-item-horizontal {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .lesson-item-horizontal:hover {
            border-color: #22c55e;
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
          }

          .lesson-item-horizontal.completed {
            background: #f0fdf4;
            border-color: #22c55e;
          }

          .lesson-header-horizontal {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .lesson-header-horizontal:hover {
            background-color: #f9fafb;
          }

          .lesson-number-horizontal {
            width: 28px;
            height: 28px;
            background: #22c55e;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.8rem;
            flex-shrink: 0;
          }

          .lesson-title-horizontal {
            flex: 1;
            font-weight: 600;
            color: #1f2937;
            font-size: 0.85rem;
          }

          .lesson-status-horizontal {
            font-size: 1rem;
            font-weight: 700;
            color: #22c55e;
            flex-shrink: 0;
          }

          .lesson-toggle {
            width: 20px;
            height: 20px;
            background: #f3f4f6;
            color: #6b7280;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }

          .lesson-toggle:hover {
            background: #e5e7eb;
            color: #374151;
          }

          .lesson-description-expanded {
            padding: 0.75rem;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            animation: slideDown 0.3s ease;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              max-height: 0;
            }
            to {
              opacity: 1;
              max-height: 200px;
            }
          }

          .lesson-description-text {
            margin: 0 0 0.5rem 0;
            color: #6b7280;
            line-height: 1.4;
            font-size: 0.8rem;
          }

          .lesson-meta-horizontal {
            display: flex;
            gap: 0.4rem;
          }

          .lesson-type-horizontal, .lesson-duration-horizontal {
            font-size: 0.7rem;
            color: #6b7280;
            background: #f3f4f6;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-weight: 500;
          }

          .hero-section {
            padding: 0.75rem 0;
          }

          .course-hero {
            gap: 0.75rem;
            padding: 0.5rem 0;
          }

          .container {
            padding: 0 1rem;
          }

          .course-meta {
            margin-top: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}