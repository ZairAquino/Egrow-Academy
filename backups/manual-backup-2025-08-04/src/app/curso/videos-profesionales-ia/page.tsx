'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import VideoPlayer from '@/components/courses/VideoPlayer';

import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function VideosProfesionalesIAPage() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);
  const { user, status } = useAuth();
  const { hasPremiumAccess, isLoading: subscriptionLoading } = useSubscriptionStatus();
  const router = useRouter();

  const toggleLesson = (index: number) => {
    setExpandedLessons(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const goToCourseContent = () => {
    // No permitir clic si los hooks están cargando
    if (status === 'loading' || subscriptionLoading) {
      return;
    }
    
    if (!user || status === 'unauthenticated') {
      const loginUrl = `/login?redirect=/curso/videos-profesionales-ia/contenido`;
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    // Si el usuario está autenticado pero no tiene acceso premium, redirigir a suscripción
    if (!hasPremiumAccess) {
      if (typeof window !== 'undefined') {
        window.location.href = '/subscription';
      }
      return;
    }
    
    const contentUrl = '/curso/videos-profesionales-ia/contenido';
    if (typeof window !== 'undefined') {
      window.location.href = contentUrl;
    }
  };

  const courseData = {
    id: 'videos-profesionales-ia',
    title: 'Aprende a crear videos profesionales con IA',
    description: 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.',
    duration: '18h 30min',
    level: 'Intermedio',
    difficulty: 'Intermedio',
    category: 'Marketing Digital',
    price: 'Premium',
    language: 'Español',
    image: '/images/15.png',
    lessonsCount: 24,
    instructor: {
      name: 'eGrow Academy',
      title: 'Especialista en Contenido Audiovisual - eGrow Academy',
      image: '/images/Zair.jpeg',
      bio: 'Experto en creación de contenido audiovisual con IA y optimización para plataformas digitales con más de 5 años de experiencia en el sector.'
    },
    prerequisites: [
      'Conocimientos básicos de internet y tecnología',
      'Cuenta de Google (para acceder a herramientas de IA)',
      'Disposición para aprender nuevas herramientas',
      'Interés en creación de contenido audiovisual'
    ],
    whatYouWillLearn: [
      'Configuración y uso de herramientas de IA para video',
      'Creación de guiones y storyboards con IA',
      'Generación de contenido audiovisual profesional',
      'Edición y post-producción con inteligencia artificial',
      'Optimización de videos para diferentes plataformas',
      'Automatización de procesos de creación de contenido',
      'Implementación de estrategias de marketing audiovisual',
      'Mejores prácticas y casos de uso avanzados'
    ],
    tools: [
      'Runway ML',
      'Synthesia',
      'Lumen5',
      'InVideo',
      'Pictory',
      'Herramientas de edición con IA'
    ],
    lessons: [
      {
        id: 1,
        title: 'MÓDULO 1: Fundamentos del Video con IA',
        description: 'Comprende los fundamentos de la creación de videos con inteligencia artificial y desarrolla una estrategia de contenido audiovisual',
        duration: 45,
        type: 'Teoría',
        lessonsCount: 4
      },
      {
        id: 2,
        title: 'MÓDULO 2: Herramientas de IA para Video',
        description: 'Explora las mejores herramientas de IA para creación de contenido audiovisual y aprende a configurarlas',
        duration: 60,
        type: 'Teoría',
        lessonsCount: 5
      },
      {
        id: 3,
        title: 'MÓDULO 3: Generación de Contenido con IA',
        description: 'Aprende a generar guiones, storyboards y contenido audiovisual utilizando inteligencia artificial',
        duration: 75,
        type: 'Teoría',
        lessonsCount: 6
      },
      {
        id: 4,
        title: 'MÓDULO 4: Edición y Post-producción',
        description: 'Domina las técnicas de edición y post-producción con herramientas de IA para crear videos profesionales',
        duration: 90,
        type: 'Teoría',
        lessonsCount: 5
      },
      {
        id: 5,
        title: 'MÓDULO 5: Optimización y Distribución',
        description: 'Optimiza tus videos para diferentes plataformas y aprende estrategias de distribución efectivas',
        duration: 60,
        type: 'Teoría',
        lessonsCount: 4
      }
    ]
  };

  const totalDuration = courseData.lessons.reduce((total, lesson) => {
    return total + lesson.duration;
  }, 0);

  useEffect(() => {
    if (user && status === 'authenticated') {
      loadUserProgress();
    } else if (status === 'unauthenticated' || (!user && status !== 'loading')) {
      setIsLoading(false);
    }
  }, [user, status]);

  const loadUserProgress = async () => {
    if (!user || status !== 'authenticated') {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/courses/progress?courseId=${courseData.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentLesson(data.currentLesson || 0);
        setCompletedLessons(data.completedLessons || []);
        setProgressPercentage(data.progressPercentage || 0);
      } else if (response.status === 404) {
        setCurrentLesson(0);
        setCompletedLessons([]);
        setProgressPercentage(0);
      }
    } catch (error) {
      console.error('Error al cargar el progreso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    // Simulación de verificación de módulos completados
    return completedLessons.length >= moduleId * 4;
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="loading-container" suppressHydrationWarning>
        <LoadingSpinner />
        <p>Cargando...</p>
      </div>
    );
  }

  const isUserAuthenticated = user && status === 'authenticated';

  return (
    <>
      <Navbar />
      
      <main className="main-content">
        <section className="hero-section">
          <div className="container">
            <div className="course-hero">
              <div className="course-info">
                <div className="course-badges">
                  <span className="badge badge-premium">Premium</span>
                  <span className="badge badge-level">{courseData.level}</span>
                  <span className="badge badge-duration">Duración: {courseData.duration}</span>
                </div>
                
                <h1 className="course-title-large">{courseData.title}</h1>
                <p className="course-description course-description-dark">{courseData.description}</p>
                
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
                        className={`course-action-button course-action-start ${(status === 'loading' || subscriptionLoading) ? 'disabled' : ''}`}
                        onClick={goToCourseContent}
                      >
                        {(status === 'loading' || subscriptionLoading) ? 
                          '⏳ Verificando acceso...' :
                          (isUserAuthenticated ? 
                            (hasPremiumAccess ? '🎯 Comenzar Curso Premium' : '💳 Suscríbete para acceder') 
                            : '🔐 Iniciar Sesión para Comenzar'
                          )
                        }
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
            </div>
          </div>
        </section>

        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              <div className="main-content-area desktop-content">
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

                <div className="learning-objectives">
                  <h2>Lo que Aprenderás</h2>
                  
                  <div className="course-introduction">
                    <p>
                      La <strong>creación de videos profesionales con inteligencia artificial</strong> está revolucionando 
                      la industria del contenido audiovisual. Con herramientas como Runway ML, Synthesia y otras plataformas 
                      de IA, ahora es posible crear contenido de alta calidad de manera más eficiente y accesible.
                    </p>
                    
                    <p>
                      Este curso te guiará paso a paso en el dominio de las mejores herramientas de IA para video, 
                      desde la generación de guiones hasta la edición y optimización para diferentes plataformas.
                    </p>
                    
                    <p>
                      A través de ejercicios prácticos y casos reales, dominarás las técnicas más avanzadas 
                      de creación de contenido audiovisual con IA y podrás crear videos profesionales que destaquen 
                      en cualquier plataforma.
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

                <div className="tools-section">
                  <h2>Herramientas y Tecnologías</h2>
                  <div className="tools-grid">
                    {courseData.tools.map((tool, index) => (
                      <div key={index} className="tool-item">
                        <span className="tool-icon">🎬</span>
                        <span>{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="content-sidebar">
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
          grid-template-columns: 1fr;
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

        .badge-premium {
          background: #f59e0b;
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

        .new-course-actions {
          margin-bottom: 1.5rem;
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
          background: linear-gradient(135deg, #f59e0b, #d97706);
          transition: width 0.3s ease;
          border-radius: 3px;
        }

        .start-section-new {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
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
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .course-action-start:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }

        .course-action-continue {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .course-action-continue:hover {
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
          color: #f59e0b;
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
          border-color: #f59e0b;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
          transform: translateY(-2px);
        }

        .lesson-card.completed {
          background: #fffbeb;
          border-color: #f59e0b;
        }

        .lesson-card.completed:hover {
          background: #fef3c7;
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
          background: #f59e0b;
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
          color: #f59e0b;
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
          border-left: 4px solid #f59e0b;
        }

        .objective-check {
          color: #f59e0b;
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
          color: #f59e0b;
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
          color: #f59e0b;
          font-weight: 700;
          margin-right: 0.5rem;
        }

        @media (max-width: 768px) {
          .course-hero {
            grid-template-columns: 1fr;
            gap: 1rem;
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

          .course-action-button {
            font-size: 0.85rem;
            padding: 0.7rem 1.2rem;
            border-radius: 8px;
          }

          .curriculum-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .objectives-grid, .tools-grid {
            grid-template-columns: 1fr;
          }

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
      `}</style>
    </>
  );
} 