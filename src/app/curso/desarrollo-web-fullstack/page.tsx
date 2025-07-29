'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
// Eliminamos CourseActionButton para usar la lógica directa que funciona

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function DesarrolloWebFullStackPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, status } = useAuth();
  const router = useRouter();
  const { hasPremiumAccess, isLoading: subscriptionLoading } = useSubscriptionStatus();

  console.log('🔍 [DEBUG] Estados iniciales:', { 
    sidebarOpen, 
    currentLesson, 
    completedLessons: completedLessons.length,
    progressPercentage,
    isLoading,
    user: !!user,
    userDetails: user ? { id: user.id, email: user.email } : null,
    authStatus: status
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Función de redirección directa copiada de monetiza-ia
  const goToCourseContent = async () => {
    console.log('🎯 Botón clickeado - Usuario logueado:', !!user, 'Premium Access:', hasPremiumAccess);
    
    if (!user) {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/desarrollo-web-fullstack/contenido`;
      console.log(`🔐 Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    if (!hasPremiumAccess) {
      // Si el usuario no tiene acceso premium, redirigir a suscripción
      console.log(`🔒 Usuario no tiene acceso premium - Redirigiendo a suscripción`);
      router.push('/subscription');
      return;
    }
    
    // Si el usuario está logueado y tiene acceso premium, verificar inscripción e inscribir si es necesario
    try {
      console.log('🔍 [DEBUG] Verificando inscripción en el curso premium...');
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (!data.isEnrolled) {
          console.log('🔍 [DEBUG] Usuario no inscrito, inscribiendo automáticamente...');
          // Inscribir automáticamente
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
          } else {
            console.error('❌ [DEBUG] Error en inscripción automática');
          }
        } else {
          console.log('✅ [DEBUG] Usuario ya inscrito en el curso');
        }
      }
    } catch (error) {
      console.error('❌ [DEBUG] Error verificando inscripción:', error);
    }
    
    // Ir al contenido del curso
    const contentUrl = '/curso/desarrollo-web-fullstack/contenido';
    console.log(`✅ Usuario logueado con premium - Redirigiendo a contenido: ${contentUrl}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = contentUrl;
    }
  };

  const courseData = {
    id: 'desarrollo-web-fullstack',
    title: 'Desarrollo Web Full Stack con React y Node.js',
    description: 'Aprende a crear aplicaciones web completas desde cero. Domina React, Node.js, Express, MongoDB y despliegue en la nube.',
    duration: '8 horas',
    level: 'Intermedio',
    difficulty: 'Intermedio',
    category: 'Desarrollo Web',
    price: 'Premium',
    language: 'Español',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=center',
    instructor: {
      name: 'Carlos Mendoza',
      title: 'Full Stack Developer - eGrow Academy',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Desarrollador Full Stack con 6 años de experiencia en React, Node.js y tecnologías web modernas. Especialista en aplicaciones escalables.'
    },
    prerequisites: [
      'Conocimientos básicos de JavaScript',
      'Familiaridad con HTML y CSS',
      'Conceptos básicos de programación',
      'Conocimientos básicos de bases de datos'
    ],
    whatYouWillLearn: [
      'Desarrollo frontend con React y hooks modernos',
      'Backend con Node.js y Express.js',
      'Bases de datos NoSQL con MongoDB',
      'APIs RESTful y autenticación JWT',
      'Despliegue en la nube con Vercel y Heroku',
      'Integración de servicios de terceros',
      'Optimización de rendimiento',
      'Prácticas de seguridad web'
    ],
    tools: [
      'React 18',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose ODM',
      'JWT Authentication',
      'Vercel',
      'Git & GitHub'
    ],
    lessons: [
      {
        id: 1,
        title: 'Introducción al Desarrollo Full Stack',
        duration: '15 min',
        type: 'video'
      },
      {
        id: 2,
        title: 'Configuración del Entorno de Desarrollo',
        duration: '20 min',
        type: 'video'
      },
      {
        id: 3,
        title: 'Fundamentos de HTML5 y CSS3',
        duration: '25 min',
        type: 'video'
      },
      {
        id: 4,
        title: 'JavaScript Moderno (ES6+)',
        duration: '30 min',
        type: 'video'
      },
      {
        id: 5,
        title: 'Introducción a React',
        duration: '35 min',
        type: 'video'
      },
      {
        id: 6,
        title: 'Hooks y Estado en React',
        duration: '40 min',
        type: 'video'
      },
      {
        id: 7,
        title: 'Routing y Navegación',
        duration: '25 min',
        type: 'video'
      },
      {
        id: 8,
        title: 'Backend con Node.js y Express',
        duration: '45 min',
        type: 'video'
      },
      {
        id: 9,
        title: 'Bases de Datos con MongoDB',
        duration: '35 min',
        type: 'video'
      },
      {
        id: 10,
        title: 'Despliegue y Producción',
        duration: '30 min',
        type: 'video'
      }
    ]
  };

  // Calcular duración total
  const totalDuration = courseData.lessons.reduce((total, lesson) => {
    const duration = parseInt(lesson.duration.split(' ')[0]);
    return total + duration;
  }, 0);

  // Cargar progreso del usuario
  const loadUserProgress = async () => {
    if (!user) {
      console.log('🔄 [DEBUG] No hay usuario, saltando carga de progreso');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('🔄 [DEBUG] Cargando progreso del usuario...');
      console.log('🔄 [DEBUG] Course ID:', courseData.id);
      console.log('🔄 [DEBUG] User ID:', user.id);
      
      const response = await fetch(`/api/courses/progress?courseId=${courseData.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies
      });
      
      console.log('🔄 [DEBUG] Response status:', response.status);
      console.log('🔄 [DEBUG] Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔄 [DEBUG] Progreso cargado:', data);
        
        setCurrentLesson(data.currentLesson || 0);
        setCompletedLessons(data.completedLessons || []);
        setProgressPercentage(Math.round((data.completedLessons?.length || 0) / courseData.lessons.length * 100));
        
        console.log('🔄 [DEBUG] Estado actualizado:', {
          currentLesson: data.currentLesson,
          completedLessons: data.completedLessons?.length,
          progressPercentage: Math.round((data.completedLessons?.length || 0) / courseData.lessons.length * 100)
        });
      } else {
        // Si es 404, intentar crear inscripción automática (no es un error real)
        if (response.status === 404) {
          console.log('🔄 [DEBUG] Usuario no inscrito, creando inscripción automática...');
          
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
              console.log('✅ [DEBUG] Inscripción automática exitosa, recargando progreso...');
              // Recargar el progreso después de la inscripción
              setTimeout(() => {
                loadUserProgress();
              }, 500);
              return;
            } else {
              console.log('⚠️ [DEBUG] Error en inscripción automática:', enrollResponse.status);
              const enrollErrorText = await enrollResponse.text();
              console.log('⚠️ [DEBUG] Error details:', enrollErrorText);
            }
          } catch (enrollError) {
            console.log('⚠️ [DEBUG] Error en inscripción automática:', enrollError);
          }
        } else {
          // Solo mostrar como error si no es 404
          console.error('❌ [DEBUG] Error en la respuesta de la API:', response.status);
          const errorText = await response.text();
          console.error('❌ [DEBUG] Response text:', errorText);
        }
      }
    } catch (error) {
      console.error('❌ [DEBUG] Error cargando progreso:', error);
      console.error('❌ [DEBUG] Error details:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingTime = () => {
    const remainingLessons = courseData.lessons.length - completedLessons.length;
    const avgDuration = totalDuration / courseData.lessons.length;
    const remainingMinutes = remainingLessons * avgDuration;
    
    if (remainingMinutes < 60) {
      return `${Math.round(remainingMinutes)} min`;
    } else {
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = Math.round(remainingMinutes % 60);
      return `${hours}h ${minutes}min`;
    }
  };

  // Cargar progreso al montar el componente
  useEffect(() => {
    if (user && !subscriptionLoading) {
      loadUserProgress();
    } else if (!user) {
      setIsLoading(false);
    }
  }, [user, subscriptionLoading]);

  // Debug: Log cuando cambie el progreso
  useEffect(() => {
    console.log('🔍 [DEBUG] Progreso actualizado en página principal:');
    console.log('  - Lección actual:', currentLesson);
    console.log('  - Lecciones completadas:', completedLessons.length);
    console.log('  - Porcentaje:', progressPercentage);
    console.log('  - Tiene acceso premium:', hasPremiumAccess);
  }, [currentLesson, completedLessons, progressPercentage, hasPremiumAccess]);

  console.log('🔍 [DEBUG] Renderizando componente, isLoading:', isLoading, 'authStatus:', status);
  
  // Mostrar loading mientras se verifica la autenticación o se carga el progreso
  if (status === 'loading' || isLoading || subscriptionLoading) {
    console.log('🔍 [DEBUG] Mostrando loading unificado:', { status, isLoading, subscriptionLoading });
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Cargando...</p>
      </div>
    );
  }

  console.log('🔍 [DEBUG] Renderizando JSX principal');

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Course Header */}
        <section className="course-header">
          <div className="container">
            <div className="course-header-content">
              <div className="course-breadcrumb">
                <a href="/">Inicio</a> / <a href="/courses">Cursos</a> / <span>Desarrollo Web Full Stack</span>
              </div>
              
              <div className="course-hero">
                <div className="course-info">
                  <div className="course-badges">
                    <span className="badge badge-premium">Premium</span>
                    <span className="badge badge-level">{courseData.level}</span>
                    <span className="badge badge-duration">Duración: {courseData.duration}</span>
                  </div>
                  
                  <h1 className="course-title-large">{courseData.title}</h1>
                  <p className="course-description">{courseData.description}</p>
                  
                  {/* Botones copiados exactamente de monetiza-ia */}
                  <div className="new-course-actions">
                    {user ? (
                      hasPremiumAccess ? (
                        completedLessons.length > 0 ? (
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
                              🎯 Comenzar Curso Gratis
                            </div>
                          </div>
                        )
                      ) : (
                        <button 
                          className="btn btn-secondary btn-large"
                          onClick={() => router.push('/subscription')}
                        >
                          Suscribirse para Acceder
                        </button>
                      )
                    ) : (
                      <button 
                        className="btn btn-primary btn-large"
                        onClick={() => router.push('/login?redirect=/curso/desarrollo-web-fullstack')}
                      >
                        Iniciar Sesión para Acceder
                      </button>
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
                  <div className="preview-video">
                    <img src={courseData.image} alt={courseData.title} />
                    <div className="play-button">
                      <span>▶</span>
                    </div>
                  </div>
                  
                  {user && hasPremiumAccess && !isLoading && (
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
          </div>
        </section>

        {/* Course Content */}
        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              {/* Main Content */}
              <div className="main-content-area">
                {/* Course Curriculum */}
                <div className="curriculum-section">
                  <h2>Contenido del Curso</h2>
                  <div className="curriculum-stats">
                    <span>{courseData.lessons.length} lecciones</span>
                    <span>{courseData.duration}</span>
                    <span>Acceso de por vida</span>
                  </div>
                  
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div key={lesson.id} className={`lesson-item ${completedLessons.includes(index) ? 'completed' : ''}`}>
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-content">
                          <div className="lesson-header">
                            <h3>{lesson.title}</h3>
                            <div className="lesson-meta">
                              <span className="lesson-type">{lesson.type}</span>
                              <span className="lesson-duration">{lesson.duration}</span>
                            </div>
                          </div>
                          <p className="lesson-description">{lesson.title}</p>
                        </div>
                        <div className="lesson-status">
                          {completedLessons.includes(index) ? '✅' : '🔒'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="learning-objectives">
                  <h2>Lo que Aprenderás</h2>
                  
                  <div className="course-introduction">
                    <p>
                      El <strong>Desarrollo Web Full Stack</strong> es una disciplina que combina el desarrollo frontend 
                      y backend para crear aplicaciones web completas y funcionales. En este curso integral, aprenderás 
                      a construir aplicaciones web modernas desde cero, utilizando las tecnologías más demandadas 
                      en la industria actual.
                    </p>
                    
                    <p>
                      Desde la configuración del entorno de desarrollo hasta el despliegue en producción, 
                      cubriremos todos los aspectos necesarios para convertirte en un desarrollador full stack 
                      competente. Utilizaremos React para el frontend, Node.js y Express para el backend, 
                      y bases de datos modernas para crear aplicaciones escalables y robustas.
                    </p>
                  </div>

                  <div className="learning-objectives-list">
                    {courseData.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="learning-objective">
                        <span className="objective-icon">✓</span>
                        <span className="objective-text">{item}</span>
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
                        <span className="tool-icon">🛠️</span>
                        <span className="tool-name">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="content-sidebar">
                {/* Course Info Card */}
                <div className="course-info-card">
                  <h3>Información del Curso</h3>
                  <div className="info-item">
                    <span className="info-label">Instructor:</span>
                    <span className="info-value">{courseData.instructor.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Categoría:</span>
                    <span className="info-value">{courseData.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Idioma:</span>
                    <span className="info-value">{courseData.language}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tiempo restante:</span>
                    <span className="info-value">{getRemainingTime()}</span>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="prerequisites-card">
                  <h3>Requisitos previos</h3>
                  <ul>
                    {courseData.prerequisites.map((prerequisite, index) => (
                      <li key={index}>{prerequisite}</li>
                    ))}
                  </ul>
                </div>

                {/* Instructor */}
                <div className="instructor-card">
                  <div className="instructor-info">
                    <img src={courseData.instructor.image} alt={courseData.instructor.name} />
                    <div>
                      <h4>{courseData.instructor.name}</h4>
                      <p>{courseData.instructor.title}</p>
                    </div>
                  </div>
                  <p>{courseData.instructor.bio}</p>
                </div>
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
          text-align: center;
        }

        .new-course-actions {
          margin-bottom: 2rem;
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

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 0;
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

        .course-breadcrumb a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
        }

        .course-breadcrumb a:hover {
          color: white;
        }

        .course-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .course-badges {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .badge-premium {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #333;
        }

        .badge-level {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .badge-duration {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .course-title-large {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .course-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .course-actions-with-progress {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .progress-summary {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-status {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .progress-detail {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .course-meta {
          margin-top: 2rem;
        }

        .course-badges-secondary {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge-language, .badge-includes, .badge-access {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          font-size: 0.8rem;
        }

        .course-preview {
          position: relative;
        }

        .preview-video {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .preview-video img {
          width: 100%;
          height: auto;
          display: block;
        }

        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .play-button:hover {
          background: white;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .play-button span {
          font-size: 1.5rem;
          color: #333;
        }

        .progress-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .progress-card h3 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.2rem;
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
          background: linear-gradient(90deg, #10b981, #059669);
          transition: width 0.3s ease;
        }

        .progress-details {
          margin-bottom: 1rem;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .progress-remaining {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 0;
        }

        .btn-continue-progress {
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 2px solid #10b981;
          color: #10b981;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-continue-progress:hover {
          background: #10b981;
          color: white;
        }

        .curriculum-section {
          margin-bottom: 3rem;
        }

        .curriculum-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .lesson-item:hover {
          border-color: #10b981;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #10b981;
        }

        .lesson-number {
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #6b7280;
          margin-right: 1rem;
        }

        .lesson-item.completed .lesson-number {
          background: #10b981;
          color: white;
        }

        .lesson-content {
          flex: 1;
        }

        .lesson-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .lesson-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .lesson-type, .lesson-duration {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .lesson-description {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }

        .lesson-status {
          font-size: 1.2rem;
          margin-left: 1rem;
        }

        .learning-objectives {
          margin-bottom: 3rem;
        }

        .course-introduction {
          margin-bottom: 2rem;
        }

        .course-introduction p {
          font-size: 1rem;
          line-height: 1.7;
          color: #374151;
          margin-bottom: 1rem;
        }

        .learning-objectives-list {
          display: grid;
          gap: 1rem;
        }

        .learning-objective {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .objective-icon {
          color: #10b981;
          font-weight: bold;
          font-size: 1.1rem;
          margin-top: 0.1rem;
        }

        .objective-text {
          font-size: 1rem;
          color: #374151;
          line-height: 1.6;
        }

        .tools-section {
          margin-bottom: 3rem;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .tool-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .tool-icon {
          font-size: 1.2rem;
        }

        .tool-name {
          font-size: 0.9rem;
          color: #374151;
          font-weight: 500;
        }
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .course-actions {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #333;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .btn-large {
          font-size: 1.1rem;
          padding: 1.25rem 2.5rem;
        }

        .course-image img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 12px;
        }

        .course-content {
          padding: 3rem 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-overview {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .course-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }

        .course-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .course-section h2 {
          margin-bottom: 1.5rem;
          color: #333;
        }

        .learning-list {
          list-style: none;
          padding: 0;
        }

        .learning-list li {
          padding: 0.75rem 0;
          border-bottom: 1px solid #eee;
          position: relative;
          padding-left: 2rem;
        }

        .learning-list li:before {
          content: '✅';
          position: absolute;
          left: 0;
          top: 0.75rem;
        }

        .learning-list li:last-child {
          border-bottom: none;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .tool-item {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          color: #333;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .lesson-item:hover {
          border-color: #667eea;
          background: #f8f9fa;
        }

        .lesson-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .lesson-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
        }

        .lesson-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #666;
        }

        .lesson-status {
          margin-left: auto;
          font-size: 1.2rem;
        }

        .content-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .course-info-card,
        .prerequisites-card,
        .instructor-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .course-info-card h3,
        .prerequisites-card h3,
        .instructor-card h4 {
          margin-bottom: 1rem;
          color: #333;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #666;
        }

        .info-value {
          color: #333;
        }

        .prerequisites-card ul {
          list-style: none;
          padding: 0;
        }

        .prerequisites-card li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
          position: relative;
          padding-left: 1.5rem;
        }

        .prerequisites-card li:before {
          content: '📋';
          position: absolute;
          left: 0;
          top: 0.5rem;
        }

        .prerequisites-card li:last-child {
          border-bottom: none;
        }

        .instructor-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .instructor-info img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .instructor-info h4 {
          margin: 0 0 0.25rem 0;
          color: #333;
        }

        .instructor-info p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
          
          .course-hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .course-title-large {
            font-size: 2rem;
          }
          
          .course-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
} 