'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

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
  const { user } = useAuth();
  const router = useRouter();
  const { hasActiveSubscription, isLoading: subscriptionLoading } = useSubscriptionAccess();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEnrollClick = async () => {
    if (!user) {
      router.push('/login?redirect=/curso/desarrollo-web-fullstack');
      return;
    }

    // Verificar si tiene suscripción premium
    if (!hasActiveSubscription) {
      router.push('/subscription');
      return;
    }

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: 'desarrollo-web-fullstack' }),
        credentials: 'include', // Incluir cookies
      });

      if (response.ok) {
        router.push('/curso/desarrollo-web-fullstack/contenido');
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
      'Optimización de rendimiento y SEO',
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
        console.error('❌ [DEBUG] Error en la respuesta de la API:', response.status);
        console.error('❌ [DEBUG] Response text:', await response.text());
        
        // Si es 404, intentar crear inscripción automática
        if (response.status === 404) {
          console.log('🔄 [DEBUG] Intentando crear inscripción automática...');
          // La API ya maneja la creación automática, pero podemos intentar de nuevo
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
    console.log('  - Tiene suscripción:', hasActiveSubscription);
  }, [currentLesson, completedLessons, progressPercentage, hasActiveSubscription]);

  if (isLoading || subscriptionLoading) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <UserProfile className="user-profile-top-right" />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="loading-container">
            <LoadingSpinner />
            <p>Cargando curso...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-top-right" />
      
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
                  
                  <div className="course-actions">
                    {user ? (
                      hasActiveSubscription ? (
                        <button 
                          className="btn btn-primary btn-large"
                          onClick={handleEnrollClick}
                        >
                          {completedLessons.length > 0 ? 'Continuar Curso' : 'Comenzar Curso Premium'}
                        </button>
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
                </div>
                
                <div className="course-image">
                  <img src={courseData.image} alt={courseData.title} />
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
                {/* Course Overview */}
                <div className="course-overview">
                  <h2>Descripción del Curso</h2>
                  <p>{courseData.description}</p>
                  
                  <div className="course-stats">
                    <div className="stat">
                      <span className="stat-number">{courseData.lessons.length}</span>
                      <span className="stat-label">Lecciones</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{courseData.duration}</span>
                      <span className="stat-label">Duración</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{courseData.level}</span>
                      <span className="stat-label">Nivel</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{progressPercentage}%</span>
                      <span className="stat-label">Completado</span>
                    </div>
                  </div>
                </div>

                {/* What You Will Learn */}
                <div className="course-section">
                  <h2>Lo que aprenderás</h2>
                  <ul className="learning-list">
                    {courseData.whatYouWillLearn.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Tools */}
                <div className="course-section">
                  <h2>Herramientas que usarás</h2>
                  <div className="tools-grid">
                    {courseData.tools.map((tool, index) => (
                      <div key={index} className="tool-item">
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Curriculum */}
                <div className="course-section">
                  <h2>Contenido del Curso</h2>
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="lesson-item">
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-content">
                          <h3>{lesson.title}</h3>
                          <div className="lesson-meta">
                            <span className="lesson-type">{lesson.type}</span>
                            <span className="lesson-duration">{lesson.duration}</span>
                          </div>
                        </div>
                        <div className="lesson-status">
                          {completedLessons.includes(lesson.id) ? '✅' : '🔒'}
                        </div>
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