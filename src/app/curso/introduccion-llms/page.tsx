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

export default function IntroduccionLLMsPage() {
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
      router.push('/login?redirect=/curso/introduccion-llms/contenido');
      return;
    }

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: 'introduccion-llms' }),
        credentials: 'include', // Incluir cookies
      });

      if (response.ok) {
        router.push('/curso/introduccion-llms/contenido');
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
    id: 'introduccion-llms',
    title: 'Introducción a Large Language Models (LLMs)',
    description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
    duration: '2 horas',
    level: 'Principiante',
    difficulty: 'Fácil',
    category: 'LLMs',
    price: 'Gratis',
    language: 'Español',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
    instructor: {
      name: 'Dr. Maria Rodriguez',
      title: 'Investigadora en IA - eGrow Academy',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332c000?w=150&h=150&fit=crop&crop=face',
      bio: 'Doctora en Ciencias de la Computación especializada en PLN y modelos de lenguaje. 8 años de experiencia en investigación de IA.'
    },
    prerequisites: [
      'Conocimientos básicos de Python',
      'Conceptos fundamentales de Machine Learning',
      'Familiaridad con conceptos de programación'
    ],
    whatYouWillLearn: [
      'Qué son los Large Language Models y cómo funcionan',
      'Arquitectura de transformers y mecanismos de atención',
      'Principales modelos LLM: GPT, BERT, T5, Claude',
      'Técnicas de fine-tuning y prompt engineering',
      'Implementación práctica con APIs de OpenAI',
      'Casos de uso reales y mejores prácticas',
      'Limitaciones y consideraciones éticas',
      'Futuro de los LLMs y tendencias emergentes'
    ],
    tools: [
      'OpenAI API',
      'Hugging Face Transformers',
      'Python',
      'Jupyter Notebooks',
      'LangChain',
      'Streamlit'
    ],
    lessons: [
      {
        id: 1,
        title: 'Bienvenida e Introducción',
        duration: '8 min',
        type: 'video',
        description: 'Presentación del curso y conceptos fundamentales',
        completed: false
      },
      {
        id: 2,
        title: '¿Qué son los LLMs?',
        duration: '15 min',
        type: 'video',
        description: 'Definición y características principales de los modelos de lenguaje grandes',
        completed: false
      },
      {
        id: 3,
        title: 'Historia y Evolución',
        duration: '12 min',
        type: 'video',
        description: 'Evolución desde N-gramas hasta los modelos actuales',
        completed: false
      },
      {
        id: 4,
        title: 'Arquitectura Transformer',
        duration: '20 min',
        type: 'video',
        description: 'Fundamentos de la arquitectura que revolucionó el PLN',
        completed: false
      },
      {
        id: 5,
        title: 'Lab: Explorando GPT-3.5',
        duration: '25 min',
        type: 'lab',
        description: 'Ejercicio práctico usando la API de OpenAI',
        completed: false
      },
      {
        id: 6,
        title: 'Prompt Engineering',
        duration: '18 min',
        type: 'video',
        description: 'Técnicas para crear prompts efectivos',
        completed: false
      },
      {
        id: 7,
        title: 'Lab: Prompt Engineering Avanzado',
        duration: '30 min',
        type: 'lab',
        description: 'Ejercicios prácticos de optimización de prompts',
        completed: false
      },
      {
        id: 8,
        title: 'Casos de Uso Reales',
        duration: '15 min',
        type: 'video',
        description: 'Aplicaciones en chatbots, análisis de texto y más',
        completed: false
      },
      {
        id: 9,
        title: 'Limitaciones y Sesgos',
        duration: '12 min',
        type: 'video',
        description: 'Desafíos actuales y consideraciones éticas',
        completed: false
      },
      {
        id: 10,
        title: 'Proyecto Final',
        duration: '35 min',
        type: 'project',
        description: 'Construye tu propio asistente de IA',
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
        console.log('🔄 [DEBUG] Usuario regresó a la página, recargando progreso...');
        loadUserProgress();
      }
    };

    const handleVisibilityChange = () => {
      if (user && !document.hidden) {
        console.log('🔄 [DEBUG] Pestaña visible, recargando progreso...');
        loadUserProgress();
      }
    };

    // Escuchar cuando la ventana recupera el foco
    window.addEventListener('focus', handleFocus);
    
    // Escuchar cuando la pestaña se vuelve visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Escuchar cuando el usuario navega de vuelta
    const handlePopState = () => {
      if (user) {
        console.log('🔄 [DEBUG] Navegación detectada, recargando progreso...');
        setTimeout(() => loadUserProgress(), 100); // Pequeño delay para asegurar que la navegación se complete
      }
    };
    
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



  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-fixed" />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Course Header */}
        <section className="course-header">
          <div className="container">
            <div className="course-header-content">
              <div className="course-breadcrumb">
                <a href="/">Inicio</a> / <a href="/cursos-gratuitos">Cursos Gratuitos</a> / <span>Introducción a LLMs</span>
              </div>
              
              <div className="course-hero">
                <div className="course-info">
                  <div className="course-badges">
                    <span className="badge badge-free">Gratis</span>
                    <span className="badge badge-level">{courseData.level}</span>
                    <span className="badge badge-duration">Duración: {courseData.duration}</span>
                  </div>
                  
                  <h1 className="course-title-large">{courseData.title}</h1>
                  <p className="course-description">{courseData.description}</p>
                  
                  <div className="course-actions">
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
                            // Recargar progreso antes de navegar
                            await loadUserProgress();
                            router.push('/curso/introduccion-llms/contenido');
                          }}
                        >
                          🚀 Continuar con el curso
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary btn-large btn-start-course"
                        onClick={handleEnrollClick}
                        disabled={isLoading}
                      >
                        {isLoading ? '⏳ Inscribiéndote...' : '🎯 Comenzar Curso Gratis'}
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
                        <button 
                          className="btn btn-outline btn-small btn-continue-progress"
                          onClick={async () => {
                            // Recargar progreso antes de navegar
                            await loadUserProgress();
                            router.push('/curso/introduccion-llms/contenido');
                          }}
                        >
                          🔄 Continuar donde lo dejaste
                        </button>
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
                    <span>{totalDuration} minutos</span>
                    <span>Acceso de por vida</span>
                  </div>
                  
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div key={lesson.id} className={`lesson-item ${lesson.completed ? 'completed' : ''}`}>
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-content">
                          <div className="lesson-header">
                            <h3>{lesson.title}</h3>
                            <div className="lesson-meta">
                              <span className="lesson-type">{lesson.type}</span>
                              <span className="lesson-duration">{lesson.duration}</span>
                            </div>
                          </div>
                          <p className="lesson-description">{lesson.description}</p>
                        </div>
                        <div className="lesson-status">
                          {lesson.completed ? '✅' : '🔒'}
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
                      Los <strong>Large Language Models (LLMs)</strong> representan uno de los avances más significativos 
                      en inteligencia artificial de la última década. Estos modelos, basados en la arquitectura 
                      Transformer introducida por Vaswani et al. en 2017, han revolucionado el procesamiento 
                      de lenguaje natural al demostrar capacidades emergentes extraordinarias cuando se entrenan 
                      a gran escala.
                    </p>
                    
                    <p>
                      Desde el lanzamiento de GPT-3 en 2020 y posteriormente ChatGPT en 2022, hemos sido testigos 
                      de una transformación radical en cómo interactuamos con la tecnología. Estos modelos no solo 
                      comprenden y generan texto de manera coherente, sino que también pueden realizar tareas complejas 
                      como razonamiento, traducción, programación y análisis, estableciendo un nuevo paradigma en la 
                      inteligencia artificial aplicada.
                    </p>
                    
                    <p>
                      En este curso, exploraremos los fundamentos técnicos y prácticos que hacen posible esta 
                      revolución tecnológica, desde los conceptos matemáticos subyacentes hasta las implementaciones 
                      reales que están transformando industrias enteras.
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

              {/* Sidebar */}
              <div className="content-sidebar">
                {/* Instructor */}
                <div className="instructor-card">
                  <h3>Tu Instructor</h3>
                  <div className="instructor-info">
                    <img src={courseData.instructor.image} alt={courseData.instructor.name} className="instructor-avatar" />
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
      </main>

      <Footer />

      <style jsx>{`
        .error-message {
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          padding: 0.75rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </>
  );
}