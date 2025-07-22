'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';

export default function ContenidoMonetizaIAPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    progress,
    isLoading,
    progressPercentage,
    saveProgress,
    markLessonComplete,
    setCurrentLesson
  } = useCourseProgress('monetiza-ia', isEnrolled);

  const courseData = {
    id: 'monetiza-ia',
    title: 'Monetiza con la IA',
    description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
    lessons: [
      {
        id: 1,
        title: 'Introducción a la Monetización con IA',
        duration: '15 min',
        type: 'video',
        description: 'Descubre las oportunidades de monetización que ofrece la inteligencia artificial',
        content: `
          <h2>Introducción a la Monetización con IA</h2>
          <p>La inteligencia artificial ha revolucionado la forma en que podemos generar ingresos en el mundo digital. En esta lección, exploraremos las oportunidades únicas que ofrece la IA para crear fuentes de ingresos innovadoras.</p>
          
          <h3>¿Por qué monetizar con IA?</h3>
          <p>La IA ofrece ventajas únicas para la monetización:</p>
          <ul>
            <li><strong>Automatización:</strong> Procesos que funcionan 24/7 sin intervención humana</li>
            <li><strong>Escalabilidad:</strong> Capacidad de atender a miles de usuarios simultáneamente</li>
            <li><strong>Personalización:</strong> Experiencias únicas para cada usuario</li>
            <li><strong>Eficiencia:</strong> Reducción de costos operativos</li>
          </ul>
          
          <h3>Oportunidades de mercado:</h3>
          <ul>
            <li><strong>Productos digitales:</strong> Ebooks, cursos, plantillas generadas con IA</li>
            <li><strong>Servicios automatizados:</strong> Chatbots, análisis de datos, generación de contenido</li>
            <li><strong>Herramientas SaaS:</strong> Plataformas que utilizan IA para resolver problemas específicos</li>
            <li><strong>Consultoría:</strong> Implementación de soluciones de IA para empresas</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 2,
        title: 'Estrategias de Monetización con ChatGPT',
        duration: '25 min',
        type: 'video',
        description: 'Aprende a utilizar ChatGPT para crear productos digitales y servicios',
        content: `
          <h2>Estrategias de Monetización con ChatGPT</h2>
          <p>ChatGPT se ha convertido en una de las herramientas más poderosas para la monetización con IA. Aprenderemos cómo aprovechar su potencial para crear múltiples fuentes de ingresos.</p>
          
          <h3>Casos de uso rentables:</h3>
          <ul>
            <li><strong>Generación de contenido:</strong> Artículos, posts de redes sociales, descripciones de productos</li>
            <li><strong>Creación de productos:</strong> Ebooks, guías, plantillas, scripts</li>
            <li><strong>Servicios de consultoría:</strong> Análisis de mercado, estrategias de marketing</li>
            <li><strong>Automatización de procesos:</strong> Respuestas automáticas, clasificación de datos</li>
          </ul>
          
          <h3>Estrategias de implementación:</h3>
          <ol>
            <li><strong>Identificar nichos rentables:</strong> Mercados con alta demanda y baja competencia</li>
            <li><strong>Desarrollar productos únicos:</strong> Combinar IA con experiencia humana</li>
            <li><strong>Crear sistemas de distribución:</strong> Plataformas, marketplaces, redes sociales</li>
            <li><strong>Optimizar para conversión:</strong> Landing pages, testimonios, garantías</li>
          </ol>
        `,
        completed: false
      },
      {
        id: 3,
        title: 'Creación de Productos Digitales con IA',
        duration: '30 min',
        type: 'video',
        description: 'Descubre cómo crear ebooks, cursos online y otros productos digitales',
        content: `
          <h2>Creación de Productos Digitales con IA</h2>
          <p>Los productos digitales representan una de las formas más escalables de monetizar con IA. Aprenderemos el proceso completo desde la ideación hasta la venta.</p>
          
          <h3>Tipos de productos digitales:</h3>
          <ul>
            <li><strong>Ebooks y guías:</strong> Contenido educativo y de referencia</li>
            <li><strong>Cursos online:</strong> Programas de formación estructurados</li>
            <li><strong>Plantillas y herramientas:</strong> Recursos reutilizables</li>
            <li><strong>Software y aplicaciones:</strong> Herramientas que resuelven problemas específicos</li>
          </ul>
          
          <h3>Proceso de creación:</h3>
          <ol>
            <li><strong>Investigación de mercado:</strong> Identificar necesidades no satisfechas</li>
            <li><strong>Desarrollo del producto:</strong> Usar IA para acelerar la creación</li>
            <li><strong>Control de calidad:</strong> Revisión humana y mejora continua</li>
            <li><strong>Lanzamiento y marketing:</strong> Estrategias de promoción efectivas</li>
          </ol>
          
          <h3>Herramientas recomendadas:</h3>
          <ul>
            <li>ChatGPT para generación de contenido</li>
            <li>Midjourney para imágenes</li>
            <li>Canva para diseño</li>
            <li>Gumroad para ventas</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 4,
        title: 'Automatización de Procesos de Venta',
        duration: '20 min',
        type: 'video',
        description: 'Implementa sistemas automatizados de venta y marketing',
        content: `
          <h2>Automatización de Procesos de Venta</h2>
          <p>La automatización es clave para escalar cualquier negocio de monetización con IA. Aprenderemos a crear sistemas que vendan mientras dormimos.</p>
          
          <h3>Funnel de ventas automatizado:</h3>
          <ol>
            <li><strong>Captura de leads:</strong> Formularios, landing pages, contenido gratuito</li>
            <li><strong>Nurturing:</strong> Email marketing automatizado, contenido educativo</li>
            <li><strong>Conversión:</strong> Ofertas irresistibles, testimonios, garantías</li>
            <li><strong>Retención:</strong> Soporte post-venta, productos adicionales</li>
          </ol>
          
          <h3>Herramientas de automatización:</h3>
          <ul>
            <li><strong>Email marketing:</strong> Mailchimp, ConvertKit, ActiveCampaign</li>
            <li><strong>CRM:</strong> HubSpot, Salesforce, Pipedrive</li>
            <li><strong>Chatbots:</strong> ManyChat, Chatfuel, Intercom</li>
            <li><strong>Analytics:</strong> Google Analytics, Facebook Pixel, Hotjar</li>
          </ul>
          
          <h3>Estrategias de optimización:</h3>
          <ul>
            <li>A/B testing de landing pages</li>
            <li>Segmentación de audiencia</li>
            <li>Personalización de mensajes</li>
            <li>Optimización de conversión</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 5,
        title: 'Marketing Digital Optimizado con IA',
        duration: '25 min',
        type: 'video',
        description: 'Optimiza tus campañas de marketing digital utilizando herramientas de IA',
        content: `
          <h2>Marketing Digital Optimizado con IA</h2>
          <p>El marketing digital ha sido transformado por la IA. Aprenderemos a usar estas herramientas para maximizar el ROI de nuestras campañas.</p>
          
          <h3>Áreas de aplicación:</h3>
          <ul>
            <li><strong>Análisis de audiencia:</strong> Segmentación avanzada, comportamiento predictivo</li>
            <li><strong>Optimización de contenido:</strong> Títulos, descripciones, imágenes</li>
            <li><strong>Publicidad programática:</strong> Bidding automático, targeting inteligente</li>
            <li><strong>SEO:</strong> Investigación de palabras clave, optimización on-page</li>
          </ul>
          
          <h3>Herramientas de marketing con IA:</h3>
          <ul>
            <li><strong>Google Ads:</strong> Smart bidding, responsive ads</li>
            <li><strong>Facebook Ads:</strong> Lookalike audiences, dynamic ads</li>
            <li><strong>Email marketing:</strong> Personalización, timing optimizado</li>
            <li><strong>SEO:</strong> Surfer, Clearscope, MarketMuse</li>
          </ul>
          
          <h3>Estrategias de implementación:</h3>
          <ol>
            <li>Recopilar y analizar datos de audiencia</li>
            <li>Crear contenido personalizado</li>
            <li>Optimizar campañas en tiempo real</li>
            <li>Medir y ajustar resultados</li>
          </ol>
        `,
        completed: false
      },
      {
        id: 6,
        title: 'Creación de Fuentes de Ingresos Pasivos',
        duration: '30 min',
        type: 'video',
        description: 'Aprende a crear múltiples fuentes de ingresos pasivos utilizando estrategias de IA',
        content: `
          <h2>Creación de Fuentes de Ingresos Pasivos</h2>
          <p>Los ingresos pasivos son el santo grial de la monetización. Con IA, podemos crear múltiples fuentes que generen dinero de forma automática.</p>
          
          <h3>Tipos de ingresos pasivos con IA:</h3>
          <ul>
            <li><strong>Productos digitales:</strong> Ebooks, cursos, software</li>
            <li><strong>Plataformas SaaS:</strong> Herramientas con suscripción mensual</li>
            <li><strong>Contenido monetizado:</strong> Blogs, YouTube, podcasts</li>
            <li><strong>Marketplaces:</strong> Plataformas que conectan compradores y vendedores</li>
          </ul>
          
          <h3>Estrategias de implementación:</h3>
          <ol>
            <li><strong>Diversificación:</strong> Múltiples fuentes de ingresos</li>
            <li><strong>Automatización:</strong> Sistemas que funcionan sin intervención</li>
            <li><strong>Escalabilidad:</strong> Capacidad de crecer sin límites</li>
            <li><strong>Sostenibilidad:</strong> Modelos de negocio a largo plazo</li>
          </ol>
          
          <h3>Casos de estudio exitosos:</h3>
          <ul>
            <li>Blogs monetizados con publicidad y afiliados</li>
            <li>Plataformas de cursos online</li>
            <li>Herramientas SaaS con suscripciones</li>
            <li>Marketplaces de productos digitales</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 7,
        title: 'Análisis y Optimización de Resultados',
        duration: '20 min',
        type: 'video',
        description: 'Utiliza herramientas de analytics y IA para analizar y optimizar tus resultados',
        content: `
          <h2>Análisis y Optimización de Resultados</h2>
          <p>El análisis de datos es fundamental para optimizar cualquier estrategia de monetización. Aprenderemos a usar herramientas de analytics para tomar decisiones basadas en datos.</p>
          
          <h3>Métricas clave a monitorear:</h3>
          <ul>
            <li><strong>Conversión:</strong> Tasa de conversión, valor promedio de orden</li>
            <li><strong>Retención:</strong> Tasa de abandono, lifetime value</li>
            <li><strong>Adquisición:</strong> Costo por adquisición, canales de tráfico</li>
            <li><strong>Engagement:</strong> Tiempo en página, páginas por sesión</li>
          </ul>
          
          <h3>Herramientas de analytics:</h3>
          <ul>
            <li><strong>Google Analytics:</strong> Análisis web completo</li>
            <li><strong>Facebook Pixel:</strong> Tracking de conversiones</li>
            <li><strong>Hotjar:</strong> Análisis de comportamiento</li>
            <li><strong>Mixpanel:</strong> Analytics de productos</li>
          </ul>
          
          <h3>Proceso de optimización:</h3>
          <ol>
            <li>Recopilar datos de múltiples fuentes</li>
            <li>Identificar patrones y oportunidades</li>
            <li>Implementar mejoras basadas en datos</li>
            <li>Medir el impacto de los cambios</li>
          </ol>
        `,
        completed: false
      },
      {
        id: 8,
        title: 'Escalabilidad y Tendencias Futuras',
        duration: '15 min',
        type: 'video',
        description: 'Descubre cómo escalar tu negocio digital y las tendencias futuras en monetización con IA',
        content: `
          <h2>Escalabilidad y Tendencias Futuras</h2>
          <p>La escalabilidad es esencial para el crecimiento sostenible. Exploraremos estrategias para escalar tu negocio de monetización con IA y las tendencias que marcarán el futuro.</p>
          
          <h3>Estrategias de escalabilidad:</h3>
          <ul>
            <li><strong>Automatización total:</strong> Sistemas que funcionan sin intervención</li>
            <li><strong>Expansión de productos:</strong> Nuevos mercados y verticales</li>
            <li><strong>Partnerships estratégicos:</strong> Colaboraciones que aceleran el crecimiento</li>
            <li><strong>Internacionalización:</strong> Expansión a mercados globales</li>
          </ul>
          
          <h3>Tendencias futuras:</h3>
          <ul>
            <li><strong>IA generativa avanzada:</strong> Contenido más sofisticado y personalizado</li>
            <li><strong>Realidad virtual y aumentada:</strong> Nuevas formas de monetización</li>
            <li><strong>Blockchain y NFTs:</strong> Nuevos modelos de propiedad digital</li>
            <li><strong>Automatización extrema:</strong> Negocios completamente autónomos</li>
          </ul>
          
          <h3>Preparación para el futuro:</h3>
          <ol>
            <li>Mantente actualizado con las últimas tecnologías</li>
            <li>Construye una base sólida de datos y sistemas</li>
            <li>Desarrolla habilidades de adaptación</li>
            <li>Invierte en tu educación continua</li>
          </ol>
        `,
        completed: false
      }
    ]
  };

  useEffect(() => {
    if (user) {
      checkEnrollment();
    }
  }, [user]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch('/api/courses/enrollment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: 'monetiza-ia' }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsEnrolled(true);
      } else {
        router.push('/curso/monetiza-ia');
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      router.push('/curso/monetiza-ia');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleManualLessonChange = async (newLessonIndex: number) => {
    if (newLessonIndex >= 0 && newLessonIndex < courseData.lessons.length) {
      await setCurrentLesson(newLessonIndex);
    }
  };

  const handleReturnToCourse = async () => {
    try {
      await saveProgress();
      router.push('/curso/monetiza-ia');
    } catch (error) {
      console.error('Error saving progress:', error);
      router.push('/curso/monetiza-ia');
    }
  };

  const handlePreviousLesson = async () => {
    if (progress.currentLesson > 0) {
      await handleManualLessonChange(progress.currentLesson - 1);
    }
  };

  const handleMarkLessonComplete = async (lessonId: number) => {
    try {
      setIsSaving(true);
      await markLessonComplete(lessonId);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteCourse = async () => {
    try {
      setIsSaving(true);
      
      // Marcar todas las lecciones como completadas si no lo están
      for (const lesson of courseData.lessons) {
        if (!progress.completedLessons.includes(lesson.id)) {
          await markLessonComplete(lesson.id);
        }
      }
      
      // Enviar solicitud para completar el curso
      const response = await fetch('/api/courses/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: 'monetiza-ia' }),
        credentials: 'include',
      });

      if (response.ok) {
        alert('¡Felicidades! Has completado el curso exitosamente.');
        router.push('/curso/monetiza-ia');
      } else {
        throw new Error('Error completing course');
      }
    } catch (error) {
      console.error('Error completing course:', error);
      alert('Error al completar el curso. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    return lessonIndex === 0 || isLessonCompleted(courseData.lessons[lessonIndex - 1].id);
  };

  const isCourseCompleted = () => {
    return progress.completedLessons.length === courseData.lessons.length;
  };

  const getLessonStatus = (lessonIndex: number, lessonId: number) => {
    if (isLessonCompleted(lessonId)) {
      return <span className="status-completed">✓ Completada</span>;
    } else if (lessonIndex === progress.currentLesson) {
      return <span className="status-current">▶ En progreso</span>;
    } else if (isLessonAccessible(lessonIndex)) {
      return <span className="status-available">○ Disponible</span>;
    } else {
      return <span className="status-locked">🔒 Bloqueada</span>;
    }
  };

  const areAllLessonsCompleted = () => {
    return progress.completedLessons.length === courseData.lessons.length;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Cargando progreso del curso...</p>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción Requerida</h2>
        <p>Debes estar inscrito en este curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/monetiza-ia')}>
          Volver al curso
        </button>
      </div>
    );
  }

  const currentLesson = courseData.lessons[progress.currentLesson];

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
                <div className="breadcrumb-container">
                  <a href="/">Inicio</a>
                  <span>/</span>
                  <a href="/curso/monetiza-ia">{courseData.title}</a>
                  <span>/</span>
                  <span>Contenido</span>
                </div>
              </div>
              
              <div className="course-info">
                <h1>{courseData.title}</h1>
                <p>{courseData.description}</p>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {progress.completedLessons.length} de {courseData.lessons.length} lecciones completadas ({Math.round(progressPercentage)}%)
                  </span>
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
                {/* Current Lesson */}
                <div className="lesson-content">
                  <div className="lesson-header">
                    <div className="lesson-navigation">
                      <button 
                        className="btn btn-outline"
                        onClick={handlePreviousLesson}
                        disabled={progress.currentLesson === 0}
                      >
                        ← Anterior
                      </button>
                      <span className="lesson-counter">
                        Lección {progress.currentLesson + 1} de {courseData.lessons.length}
                      </span>
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleManualLessonChange(progress.currentLesson + 1)}
                        disabled={progress.currentLesson === courseData.lessons.length - 1}
                      >
                        Siguiente →
                      </button>
                    </div>
                    
                    <h2>{currentLesson.title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-duration">{currentLesson.duration}</span>
                      <span className="lesson-type">{currentLesson.type}</span>
                    </div>
                  </div>
                  
                  <div 
                    className="lesson-body"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                  ></div>
                  
                  <div className="lesson-actions">
                    <button 
                      className={`btn btn-primary ${isLessonCompleted(currentLesson.id) ? 'completed' : ''}`}
                      onClick={() => handleMarkLessonComplete(currentLesson.id)}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Guardando...' : 
                        isLessonCompleted(currentLesson.id) ? '✓ Lección Completada' : 'Marcar como Completada'
                      }
                    </button>
                    
                    <button 
                      className="btn btn-outline"
                      onClick={handleReturnToCourse}
                    >
                      Volver al Curso
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="content-sidebar">
                <div className="lessons-sidebar">
                  <h3>Lecciones del Curso</h3>
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`lesson-item ${index === progress.currentLesson ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${!isLessonAccessible(index) ? 'locked' : ''}`}
                        onClick={() => {
                          if (isLessonAccessible(index)) {
                            handleManualLessonChange(index);
                          }
                        }}
                      >
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-content">
                          <h4>{lesson.title}</h4>
                          <div className="lesson-meta">
                            <span className="lesson-type">{lesson.type}</span>
                            <span className="lesson-duration">{lesson.duration}</span>
                          </div>
                        </div>
                        <div className="lesson-status">
                          {getLessonStatus(index, lesson.id)}
                        </div>
                      </div>
                    ))}
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
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          font-size: 1.2rem;
          color: #6b7280;
        }

        .enrollment-required {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
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

        .breadcrumb-container a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
        }

        .breadcrumb-container a:hover {
          color: white;
        }

        .course-info h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
        }

        .course-info p {
          font-size: 1.1rem;
          margin: 0 0 2rem 0;
          opacity: 0.9;
        }

        .course-progress {
          margin-top: 2rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: #22c55e;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .course-content {
          padding: 3rem 0;
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

        .lesson-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .lesson-header {
          margin-bottom: 2rem;
        }

        .lesson-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .lesson-counter {
          font-weight: 600;
          color: #6b7280;
        }

        .lesson-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .lesson-duration, .lesson-type {
          background: #f3f4f6;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .lesson-body {
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 2rem;
        }

        .lesson-body h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          color: #1f2937;
        }

        .lesson-body h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: #1f2937;
        }

        .lesson-body p {
          margin: 0 0 1rem 0;
        }

        .lesson-body ul, .lesson-body ol {
          margin: 0 0 1rem 0;
          padding-left: 1.5rem;
        }

        .lesson-body li {
          margin: 0.25rem 0;
        }

        .lesson-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
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

        .btn-primary.completed {
          background: #6b7280;
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

        .btn-complete-course {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          width: 100%;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .btn-complete-course:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .btn-complete-course.disabled {
          background: #6b7280;
          cursor: not-allowed;
        }

        .lessons-sidebar {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .lessons-sidebar h3 {
          margin: 0 0 1.5rem 0;
          color: #1f2937;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .lesson-item:hover {
          border-color: #22c55e;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
        }

        .lesson-item.active {
          border-color: #22c55e;
          background: #f0fdf4;
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .lesson-item.locked {
          opacity: 0.5;
          cursor: not-allowed;
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
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .lesson-item.completed .lesson-number {
          background: #22c55e;
        }

        .lesson-item.locked .lesson-number {
          background: #6b7280;
        }

        .lesson-content h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 0.5rem;
        }

        .lesson-type, .lesson-duration {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }

        .lesson-status {
          font-size: 0.875rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .status-completed {
          color: #22c55e;
        }

        .status-current {
          color: #3b82f6;
        }

        .status-available {
          color: #6b7280;
        }

        .status-locked {
          color: #9ca3af;
        }

        .complete-course-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .course-completed-message {
          text-align: center;
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
          font-size: 1.25rem;
          font-weight: 700;
          color: #22c55e;
        }

        .completion-info {
          margin: 0 0 1rem 0;
          color: #6b7280;
          line-height: 1.5;
        }

        .completion-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .complete-course-info {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .lesson-navigation {
            flex-direction: column;
            gap: 1rem;
          }

          .lesson-actions {
            flex-direction: column;
          }

          .course-info h1 {
            font-size: 2rem;
          }

          .lesson-content h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
} 