'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function FundamentosMLPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEnrollClick = async () => {
    if (!user) {
      router.push('/login?redirect=/curso/fundamentos-ml');
      return;
    }

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: 'fundamentos-ml' }),
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/curso/fundamentos-ml/contenido');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al inscribirse en el curso');
      }
    } catch (error) {
      console.error('❌ Error al inscribirse en el curso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al inscribirse en el curso: ${errorMessage}`);
    }
  };

  const courseData = {
    id: 'fundamentos-ml',
    title: 'Fundamentos de Machine Learning',
    description: 'Aprende los conceptos básicos de Machine Learning, desde algoritmos supervisados hasta no supervisados, y cómo implementarlos en Python.',
    duration: '2.5 horas',
    level: 'Principiante',
    difficulty: 'Fácil',
    category: 'Machine Learning',
    price: 'Gratis',
    language: 'Español',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop&crop=center',
    instructor: {
      name: 'Dr. Carlos Mendoza',
      title: 'Científico de Datos - eGrow Academy',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Doctor en Ciencias de la Computación especializado en Machine Learning y Data Science. 10 años de experiencia en investigación y desarrollo de modelos de IA.'
    },
    prerequisites: [
      'Conocimientos básicos de Python',
      'Conceptos fundamentales de matemáticas',
      'Familiaridad con conceptos de programación'
    ],
    whatYouWillLearn: [
      'Qué es Machine Learning y sus tipos principales',
      'Algoritmos de aprendizaje supervisado y no supervisado',
      'Preparación y limpieza de datos',
      'Evaluación de modelos y métricas de rendimiento',
      'Implementación práctica con scikit-learn',
      'Casos de uso reales y mejores prácticas',
      'Overfitting, underfitting y validación cruzada',
      'Futuro del Machine Learning y tendencias emergentes'
    ],
    tools: [
      'Python',
      'scikit-learn',
      'pandas',
      'numpy',
      'matplotlib',
      'Jupyter Notebooks'
    ],
    lessons: [
      {
        id: 1,
        title: 'Introducción al Machine Learning',
        duration: '10 min',
        type: 'video',
        description: 'Conceptos fundamentales y tipos de aprendizaje',
        completed: false
      },
      {
        id: 2,
        title: 'Tipos de Machine Learning',
        duration: '15 min',
        type: 'video',
        description: 'Aprendizaje supervisado, no supervisado y por refuerzo',
        completed: false
      },
      {
        id: 3,
        title: 'Preparación de Datos',
        duration: '20 min',
        type: 'video',
        description: 'Limpieza, transformación y normalización de datos',
        completed: false
      },
      {
        id: 4,
        title: 'Algoritmos Supervisados',
        duration: '25 min',
        type: 'video',
        description: 'Regresión lineal, clasificación y árboles de decisión',
        completed: false
      },
      {
        id: 5,
        title: 'Lab: Regresión Lineal',
        duration: '30 min',
        type: 'lab',
        description: 'Implementación práctica de regresión lineal',
        completed: false
      },
      {
        id: 6,
        title: 'Algoritmos No Supervisados',
        duration: '18 min',
        type: 'video',
        description: 'Clustering y reducción de dimensionalidad',
        completed: false
      },
      {
        id: 7,
        title: 'Lab: Clustering con K-Means',
        duration: '25 min',
        type: 'lab',
        description: 'Implementación de clustering con scikit-learn',
        completed: false
      },
      {
        id: 8,
        title: 'Evaluación de Modelos',
        duration: '20 min',
        type: 'video',
        description: 'Métricas de rendimiento y validación cruzada',
        completed: false
      },
      {
        id: 9,
        title: 'Overfitting y Underfitting',
        duration: '15 min',
        type: 'video',
        description: 'Problemas comunes y técnicas de regularización',
        completed: false
      },
      {
        id: 10,
        title: 'Proyecto Final',
        duration: '40 min',
        type: 'project',
        description: 'Sistema de recomendación completo',
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
        console.error('❌ [DEBUG] Error en la respuesta de la API:', response.status);
        console.error('❌ [DEBUG] Response text:', await response.text());
        
        if (response.status === 404) {
          console.log('🔄 [DEBUG] Intentando crear inscripción automática...');
          setTimeout(() => {
            loadUserProgress();
          }, 1000);
          return;
        }
      }
    } catch (error) {
      console.error('❌ [DEBUG] Error cargando progreso:', error);
      console.error('❌ [DEBUG] Error details:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Cargando progreso del curso...</p>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-top-right" />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <div className="course-badges">
                  <span className="badge badge-free">Gratis</span>
                  <span className="badge badge-level">{courseData.level}</span>
                  <span className="badge badge-duration">Duración: {courseData.duration}</span>
                </div>
                
                <h1 className="hero-title">{courseData.title}</h1>
                <p className="hero-description">{courseData.description}</p>
                
                <div className="hero-actions">
                  {completedLessons.length > 0 ? (
                    <div className="course-actions-with-progress">
                      <div className="progress-summary">
                        <p className="progress-status">
                          📚 <strong>Progreso actual:</strong> Lección {currentLesson + 1} de {courseData.lessons.length}
                        </p>
                        <p className="progress-detail">
                          {completedLessons.length} lecciones completadas • {Math.round(progressPercentage)}% del curso
                        </p>
                      </div>
                      <button 
                        className="btn btn-primary btn-large btn-continue-course"
                        onClick={async () => {
                          await loadUserProgress();
                          router.push('/curso/fundamentos-ml/contenido');
                        }}
                      >
                        🚀 Continuar Curso
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary btn-large"
                      onClick={handleEnrollClick}
                    >
                      🎯 Inscribirse Gratis
                    </button>
                  )}
                </div>
              </div>
              
              <div className="hero-image">
                <img src={courseData.image} alt={courseData.title} />
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