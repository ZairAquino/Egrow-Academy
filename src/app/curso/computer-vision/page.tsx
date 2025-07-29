'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
// Eliminamos CourseActionButton para usar la lógica directa que funciona

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function ComputerVisionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user, status } = useAuth();
  const router = useRouter();

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
    console.log('🎯 Botón clickeado - Usuario logueado:', !!user);
    
    if (!user) {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/computer-vision/contenido`;
      console.log(`🔐 Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    // Si el usuario está logueado, verificar inscripción e inscribir si es necesario
    try {
      console.log('🔍 [DEBUG] Verificando inscripción en el curso...');
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
    const contentUrl = '/curso/computer-vision/contenido';
    console.log(`✅ Usuario logueado - Redirigiendo a contenido: ${contentUrl}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = contentUrl;
    }
  };

  const courseData = {
    id: 'computer-vision',
    title: 'Computer Vision con Python',
    description: 'Aprende a procesar y analizar imágenes usando OpenCV, detectar objetos, reconocer rostros y crear aplicaciones de visión por computadora.',
    duration: '3 horas',
    level: 'Intermedio',
    difficulty: 'Intermedio',
    category: 'Computer Vision',
    price: 'Gratis',
    language: 'Español',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&crop=center',
    instructor: {
      name: 'Dra. Ana Torres',
      title: 'Especialista en Computer Vision - eGrow Academy',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Doctora en Ingeniería Informática especializada en Computer Vision y Deep Learning. 12 años de experiencia en investigación y desarrollo de sistemas de visión artificial.'
    },
    prerequisites: [
      'Conocimientos intermedios de Python',
      'Conceptos básicos de Machine Learning',
      'Familiaridad con matemáticas básicas'
    ],
    whatYouWillLearn: [
      'Fundamentos de Computer Vision y procesamiento de imágenes',
      'Uso avanzado de OpenCV para manipulación de imágenes',
      'Detección de objetos y reconocimiento facial',
      'Segmentación de imágenes y análisis de características',
      'Implementación de filtros y transformaciones',
      'Aplicaciones prácticas en tiempo real',
      'Integración con redes neuronales convolucionales',
      'Proyectos reales de Computer Vision'
    ],
    tools: [
      'Python',
      'OpenCV',
      'NumPy',
      'Matplotlib',
      'scikit-image',
      'MediaPipe'
    ],
    lessons: [
      {
        id: 1,
        title: 'Introducción a Computer Vision',
        duration: '12 min',
        type: 'video',
        description: 'Conceptos fundamentales y aplicaciones',
        completed: false
      },
      {
        id: 2,
        title: 'Procesamiento Básico de Imágenes',
        duration: '20 min',
        type: 'video',
        description: 'Carga, manipulación y transformaciones básicas',
        completed: false
      },
      {
        id: 3,
        title: 'Filtros y Convoluciones',
        duration: '25 min',
        type: 'video',
        description: 'Aplicación de filtros y operaciones de convolución',
        completed: false
      },
      {
        id: 4,
        title: 'Detección de Bordes',
        duration: '18 min',
        type: 'video',
        description: 'Algoritmos de detección de bordes y contornos',
        completed: false
      },
      {
        id: 5,
        title: 'Lab: Procesamiento de Imágenes',
        duration: '35 min',
        type: 'lab',
        description: 'Implementación práctica con OpenCV',
        completed: false
      },
      {
        id: 6,
        title: 'Detección de Objetos',
        duration: '22 min',
        type: 'video',
        description: 'Técnicas de detección y seguimiento de objetos',
        completed: false
      },
      {
        id: 7,
        title: 'Reconocimiento Facial',
        duration: '28 min',
        type: 'lab',
        description: 'Implementación de detección y reconocimiento facial',
        completed: false
      },
      {
        id: 8,
        title: 'Segmentación de Imágenes',
        duration: '20 min',
        type: 'video',
        description: 'Técnicas de segmentación y análisis de regiones',
        completed: false
      },
      {
        id: 9,
        title: 'Aplicaciones en Tiempo Real',
        duration: '18 min',
        type: 'video',
        description: 'Optimización y aplicaciones prácticas',
        completed: false
      },
      {
        id: 10,
        title: 'Proyecto Final',
        duration: '45 min',
        type: 'project',
        description: 'Sistema de vigilancia inteligente',
        completed: false
      }
    ]
  };

  const totalDuration = courseData.lessons.reduce((total, lesson) => {
    const duration = parseInt(lesson.duration);
    return total + duration;
  }, 0);

  // Cargar progreso del usuario si está logueado
  useEffect(() => {
    if (user) {
      loadUserProgress();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Recargar progreso cuando el usuario regrese del contenido del curso
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        loadUserProgress();
      }
    };

    const handleVisibilityChange = () => {
      if (user && !document.hidden) {
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
        credentials: 'include',
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
    const averageMinutesPerLesson = 18; // Estimación promedio para Computer Vision
    const remainingMinutes = remainingLessons * averageMinutesPerLesson;
    
    if (remainingMinutes < 60) {
      return `${Math.round(remainingMinutes)} min`;
    } else {
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = Math.round(remainingMinutes % 60);
      return `${hours}h ${minutes}min`;
    }
  };

  console.log('🔍 [DEBUG] Renderizando componente, isLoading:', isLoading, 'authStatus:', status);
  
  // Mostrar loading mientras se verifica la autenticación o se carga el progreso
  if (status === 'loading' || isLoading) {
    console.log('🔍 [DEBUG] Mostrando loading unificado:', { status, isLoading });
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
                <p className="course-description">{courseData.description}</p>
                
                {/* Botones copiados exactamente de monetiza-ia */}
                <div className="new-course-actions">
                  {completedLessons.length > 0 ? (
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
                
                {user && !isLoading && (
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

        {/* Course Details */}
        <section className="course-details">
          <div className="container">
            <div className="details-grid">
              <div className="details-main">
                <div className="instructor-card">
                  <div className="instructor-info">
                    <img src={courseData.instructor.image} alt={courseData.instructor.name} />
                    <div>
                      <h3>{courseData.instructor.name}</h3>
                      <p>{courseData.instructor.title}</p>
                      <p>{courseData.instructor.bio}</p>
                    </div>
                  </div>
                </div>

                <div className="what-you-will-learn">
                  <h3>¿Qué aprenderás?</h3>
                  <ul>
                    {courseData.whatYouWillLearn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="course-curriculum">
                  <h3>Contenido del Curso</h3>
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="lesson-item">
                        <div className="lesson-info">
                          <span className="lesson-number">{index + 1}</span>
                          <div>
                            <h4>{lesson.title}</h4>
                            <p>{lesson.description}</p>
                          </div>
                        </div>
                        <div className="lesson-meta">
                          <span className="lesson-type">{lesson.type}</span>
                          <span className="lesson-duration">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="details-sidebar">
                <div className="course-card">
                  <div className="card-header">
                    <h3>Información del Curso</h3>
                  </div>
                  <div className="card-content">
                    <div className="info-item">
                      <span className="info-label">Duración:</span>
                      <span className="info-value">{courseData.duration}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Nivel:</span>
                      <span className="info-value">{courseData.level}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Idioma:</span>
                      <span className="info-value">{courseData.language}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Precio:</span>
                      <span className="info-value">{courseData.price}</span>
                    </div>
                  </div>
                </div>

                <div className="prerequisites-card">
                  <h3>Prerrequisitos</h3>
                  <ul>
                    {courseData.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>

                <div className="tools-card">
                  <h3>Herramientas</h3>
                  <div className="tools-grid">
                    {courseData.tools.map((tool, index) => (
                      <span key={index} className="tool-badge">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>
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

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 0;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-badges {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
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

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          line-height: 1.2;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin: 0 0 2rem 0;
          opacity: 0.9;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
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

        .hero-image img {
          width: 100%;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

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
          height: 10px;
          background-color: #e5e7eb;
          border-radius: 5px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 5px;
          transition: width 0.3s ease-in-out;
        }

        .progress-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .progress-text {
          font-weight: 600;
          color: #1f2937;
        }

        .progress-remaining {
          font-weight: 600;
          color: #1f2937;
        }

        .btn-outline {
          background: none;
          border: 1px solid #3b82f6;
          color: #3b82f6;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-outline:hover {
          background-color: #3b82f6;
          color: white;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
        }

        .btn-small {
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
        }

        .btn-continue-progress {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .btn-continue-progress:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
        }

        .course-details {
          padding: 4rem 0;
          background: #f8fafc;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .instructor-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .instructor-info {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .instructor-info img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .instructor-info h3 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .instructor-info p {
          margin: 0 0 0.5rem 0;
          color: #6b7280;
          line-height: 1.5;
        }

        .what-you-will-learn {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .what-you-will-learn h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .what-you-will-learn ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .what-you-will-learn li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          position: relative;
          padding-left: 1.5rem;
        }

        .what-you-will-learn li:before {
          content: '✅';
          position: absolute;
          left: 0;
          top: 0.5rem;
        }

        .course-curriculum {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .course-curriculum h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lesson-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .lesson-item:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }

        .lesson-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .lesson-number {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .lesson-info h4 {
          margin: 0 0 0.25rem 0;
          color: #1f2937;
        }

        .lesson-info p {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .lesson-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .lesson-type {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .lesson-duration {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .details-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .course-card,
        .prerequisites-card,
        .tools-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .card-header h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #6b7280;
          font-weight: 500;
        }

        .info-value {
          color: #1f2937;
          font-weight: 600;
        }

        .prerequisites-card h3,
        .tools-card h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .prerequisites-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .prerequisites-card li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          position: relative;
          padding-left: 1.5rem;
        }

        .prerequisites-card li:before {
          content: '📚';
          position: absolute;
          left: 0;
          top: 0.5rem;
        }

        .tools-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tool-badge {
          background: #f3f4f6;
          color: #374151;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .details-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .course-actions-with-progress {
            align-items: stretch;
          }

          .lesson-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .lesson-meta {
            align-self: flex-end;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .course-badges {
            justify-content: center;
          }

          .instructor-info {
            flex-direction: column;
            text-align: center;
          }

          .instructor-info img {
            align-self: center;
          }
        }
      `}</style>
    </>
  );
} 