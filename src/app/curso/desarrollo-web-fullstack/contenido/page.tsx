'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';

export default function ContenidoCursoPage() {
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
  } = useCourseProgress('desarrollo-web-fullstack', isEnrolled);

  // Debug: Log cuando cambie el progreso
  useEffect(() => {
    console.log('🔍 [DEBUG] Progreso actualizado en componente:');
    console.log('  - Lección actual:', progress.currentLesson);
    console.log('  - Lecciones completadas:', progress.completedLessons);
    console.log('  - Porcentaje:', progress.progressPercentage);
    console.log('  - Estado:', progress.status);
    console.log('  - isEnrolled:', isEnrolled);
    console.log('  - isLoading:', isLoading);
  }, [progress, isEnrolled, isLoading]);

  const courseData = {
    id: 'desarrollo-web-fullstack',
    title: 'Desarrollo Web Full Stack con React y Node.js',
    description: 'Aprende a crear aplicaciones web completas desde cero. Domina React, Node.js, Express, MongoDB y despliegue en la nube.',
    lessons: [
      {
        id: 1,
        title: 'Introducción al Desarrollo Full Stack',
        duration: '15 min',
        type: 'video',
        description: 'Conceptos fundamentales del desarrollo web full stack',
        content: `
          <h2>Bienvenido al Desarrollo Web Full Stack</h2>
          <p>En este curso aprenderás a crear aplicaciones web completas desde el frontend hasta el backend.</p>
          
          <h3>¿Qué es el Desarrollo Full Stack?</h3>
          <p>El desarrollo full stack abarca tanto el frontend (interfaz de usuario) como el backend (servidor y base de datos).</p>
          
          <h3>Tecnologías que aprenderás:</h3>
          <ul>
            <li><strong>Frontend:</strong> React, HTML5, CSS3, JavaScript ES6+</li>
            <li><strong>Backend:</strong> Node.js, Express.js, APIs RESTful</li>
            <li><strong>Base de datos:</strong> MongoDB, Mongoose ODM</li>
            <li><strong>Autenticación:</strong> JWT, seguridad web</li>
            <li><strong>Despliegue:</strong> Vercel, Heroku, Git</li>
          </ul>
          
          <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
          </div>
        `,
        completed: false
      },
      {
        id: 2,
        title: 'Configuración del Entorno de Desarrollo',
        duration: '20 min',
        type: 'video',
        description: 'Instalación y configuración de herramientas de desarrollo',
        content: `
          <h2>Configuración del Entorno de Desarrollo</h2>
          <p>Antes de comenzar a programar, necesitamos configurar nuestro entorno de desarrollo.</p>
          
          <h3>Herramientas a instalar:</h3>
          <ul>
            <li><strong>Node.js:</strong> Runtime de JavaScript para el servidor</li>
            <li><strong>npm:</strong> Gestor de paquetes de Node.js</li>
            <li><strong>Git:</strong> Control de versiones</li>
            <li><strong>VS Code:</strong> Editor de código recomendado</li>
            <li><strong>MongoDB:</strong> Base de datos NoSQL</li>
          </ul>
          
          <h3>Configuración inicial:</h3>
          <pre><code># Verificar instalaciones
node --version
npm --version
git --version

# Configurar Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"</code></pre>
        `,
        completed: false
      },
      {
        id: 3,
        title: 'Fundamentos de HTML5 y CSS3',
        duration: '25 min',
        type: 'video',
        description: 'Estructura semántica y diseño responsive',
        content: `
          <h2>Fundamentos de HTML5 y CSS3</h2>
          <p>HTML5 y CSS3 son la base de cualquier aplicación web moderna.</p>
          
          <h3>HTML5 Semántico:</h3>
          <ul>
            <li><strong>header:</strong> Encabezado de la página</li>
            <li><strong>nav:</strong> Navegación principal</li>
            <li><strong>main:</strong> Contenido principal</li>
            <li><strong>section:</strong> Secciones de contenido</li>
            <li><strong>article:</strong> Contenido independiente</li>
            <li><strong>aside:</strong> Contenido relacionado</li>
            <li><strong>footer:</strong> Pie de página</li>
          </ul>
          
          <h3>CSS3 Moderno:</h3>
          <ul>
            <li><strong>Flexbox:</strong> Layout flexible</li>
            <li><strong>Grid:</strong> Layout en cuadrícula</li>
            <li><strong>Variables CSS:</strong> Reutilización de valores</li>
            <li><strong>Media Queries:</strong> Diseño responsive</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 4,
        title: 'JavaScript Moderno (ES6+)',
        duration: '30 min',
        type: 'video',
        description: 'Características modernas de JavaScript',
        content: `
          <h2>JavaScript Moderno (ES6+)</h2>
          <p>JavaScript ha evolucionado significativamente con ES6 y versiones posteriores.</p>
          
          <h3>Características principales:</h3>
          <ul>
            <li><strong>Arrow Functions:</strong> Funciones más concisas</li>
            <li><strong>Destructuring:</strong> Extracción de valores</li>
            <li><strong>Template Literals:</strong> Strings con interpolación</li>
            <li><strong>Modules:</strong> Import/export de código</li>
            <li><strong>Async/Await:</strong> Programación asíncrona</li>
            <li><strong>Classes:</strong> Programación orientada a objetos</li>
          </ul>
          
          <h3>Ejemplos prácticos:</h3>
          <pre><code>// Arrow Functions
const sum = (a, b) => a + b;

// Destructuring
const { name, age } = user;

// Template Literals
const message = 'Hola ' + name + ', tienes ' + age + ' años';

// Async/Await
const fetchData = async () => {
  // const response = await fetch('/api/data');
  // return response.json();
  return { message: 'Datos de ejemplo' };
};</code></pre>
        `,
        completed: false
      },
      {
        id: 5,
        title: 'Introducción a React',
        duration: '35 min',
        type: 'video',
        description: 'Fundamentos de React y componentes',
        content: `
          <h2>Introducción a React</h2>
          <p>React es una biblioteca de JavaScript para construir interfaces de usuario.</p>
          
          <h3>Conceptos fundamentales:</h3>
          <ul>
            <li><strong>Componentes:</strong> Bloques reutilizables de UI</li>
            <li><strong>Props:</strong> Datos que se pasan entre componentes</li>
            <li><strong>State:</strong> Estado interno del componente</li>
            <li><strong>JSX:</strong> Sintaxis para escribir componentes</li>
            <li><strong>Hooks:</strong> useState, useEffect, etc.</li>
          </ul>
          
          <h3>Ejemplo de componente:</h3>
          <pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h3>Contador: {count}</h3>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}</code></pre>
        `,
        completed: false
      }
    ]
  };

  // Verificar inscripción al cargar
  useEffect(() => {
    checkEnrollment();
  }, []);

  const checkEnrollment = async () => {
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: 'desarrollo-web-fullstack' }),
      });
      
      if (response.ok) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error('Error verificando inscripción:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleManualLessonChange = async (newLessonIndex: number) => {
    console.log('🔍 [DEBUG] Cambiando a lección:', newLessonIndex);
    
    // Guardar progreso de la lección actual antes de cambiar
    const currentLesson = courseData.lessons[currentLessonIndex];
    await saveProgress(
      currentLessonIndex,
      progress.completedLessons,
      currentLesson?.id,
      currentLesson?.title,
      'access',
      1
    );
    
    await setCurrentLesson(newLessonIndex);
  };

  const handleReturnToCourse = async () => {
    setIsSaving(true);
    
    try {
      // Guardar progreso de la lección actual antes de salir
      const currentLesson = courseData.lessons[currentLessonIndex];
      await saveProgress(
        currentLessonIndex,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      
      // Navegar de vuelta al curso
      router.push('/curso/desarrollo-web-fullstack');
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setIsSaving(false);
    }
  };

  const handlePreviousLesson = async () => {
    if (currentLessonIndex > 0) {
      console.log('🔍 [DEBUG] Regresando a lección anterior:', currentLessonIndex - 1);
      
      // Guardar progreso de la lección actual antes de cambiar
      const currentLesson = courseData.lessons[currentLessonIndex];
      await saveProgress(
        currentLessonIndex,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      
      // Cambiar a la lección anterior
      setCurrentLesson(currentLessonIndex - 1);
    }
  };

  const handleMarkLessonComplete = async (lessonId: number) => {
    // Si el curso ya está completado, no permitir marcar lecciones como completadas
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Estás en modo de revisión.');
      return;
    }

    console.log('🔍 [DEBUG] handleMarkLessonComplete llamado con lessonId:', lessonId);
    
    // Obtener el índice actual de la lección
    const currentLessonIndex = courseData.lessons.findIndex(lesson => lesson.id === lessonId);
    const currentLesson = courseData.lessons[currentLessonIndex];
    
    console.log('🔍 [DEBUG] currentLessonIndex:', currentLessonIndex);
    
    // Crear la nueva lista de lecciones completadas
    const newCompletedLessons = progress.completedLessons.includes(lessonId) 
      ? progress.completedLessons 
      : [...progress.completedLessons, lessonId];
    
    // Marcar la lección como completada (actualiza el estado inmediatamente)
    markLessonComplete(lessonId);
    
    // Guardar progreso con información de completado
    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id,
      currentLesson.title,
      'complete',
      5 // 5 minutos por completar una lección
    );
    
    // Avanzar a la siguiente lección si no es la última
    if (currentLessonIndex < courseData.lessons.length - 1) {
      console.log('🔍 [DEBUG] Avanzando a lección:', currentLessonIndex + 1);
      // Usar setTimeout para evitar conflictos de estado
      setTimeout(() => {
        setCurrentLesson(currentLessonIndex + 1);
      }, 100);
    } else {
      console.log('🔍 [DEBUG] Es la última lección, no avanzar');
    }
  };

  const handleCompleteCourse = async () => {
    if (!isEnrolled) return;
    
    // Si el curso ya está completado, mostrar mensaje
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Puedes revisar el contenido cuando quieras.');
      return;
    }
    
    // Verificar si todas las lecciones están completadas
    const allLessonsCompleted = courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
    
    if (!allLessonsCompleted) {
      alert('Debes completar todas las lecciones antes de poder terminar el curso.');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/courses/complete-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseSlug: 'desarrollo-web-fullstack'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Redirigir a la página de inicio del curso
        router.push('/curso/desarrollo-web-fullstack');
      } else {
        const error = await response.json();
        console.error('❌ Error al completar curso:', error);
        alert('Error al completar el curso. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('❌ Error al completar curso:', error);
      alert('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    // Si está inscrito, puede acceder a todas las lecciones
    if (isEnrolled) return true;
    
    // Si no está inscrito, solo puede acceder a la primera lección
    return lessonIndex === 0;
  };

  const isCourseCompleted = () => {
    return progress.status === 'COMPLETED' || progress.progressPercentage === 100;
  };

  const getLessonStatus = (lessonIndex: number, lessonId: number) => {
    if (isLessonCompleted(lessonId)) {
      // Si el curso está completado, mostrar estado de revisión
      if (isCourseCompleted()) {
        return '📖';
      }
      return '✅';
    } else if (lessonIndex === currentLessonIndex) {
      return '▶️';
    } else if (isLessonAccessible(lessonIndex)) {
      return '📖';
    } else {
      return '🔒';
    }
  };

  const areAllLessonsCompleted = () => {
    return courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };



  const debugProgress = () => {
    console.log('🔍 [DEBUG] Estado actual del progreso:');
    console.log('  - Lección actual:', progress.currentLesson);
    console.log('  - Lecciones completadas:', progress.completedLessons);
    console.log('  - Porcentaje:', progress.progressPercentage);
    console.log('  - Estado:', progress.status);
    console.log('  - isEnrolled:', isEnrolled);
  };

  if (!user || isLoading) {
    return <div className="loading-container">Cargando...</div>;
  }

  // Verificar que el progreso se haya cargado correctamente
  if (!progress || progress.currentLesson === undefined) {
    return <div className="loading-container">Cargando progreso del curso...</div>;
  }

  // Verificar que la lección actual esté dentro del rango válido
  const currentLessonIndex = Math.min(progress.currentLesson, courseData.lessons.length - 1);
  const currentLesson = courseData.lessons[currentLessonIndex];
  
  if (!currentLesson) {
    return <div className="loading-container">Error: Lección no encontrada</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/desarrollo-web-fullstack')}>
          Volver al curso
        </button>
      </div>
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
                <div className="breadcrumb-container">
                  <a href="/" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🏠</span>
                    <span className="breadcrumb-text">Inicio</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/courses" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Cursos</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/curso/desarrollo-web-fullstack" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎯</span>
                    <span className="breadcrumb-text">Desarrollo Web Full Stack</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item active">
                    <span className="breadcrumb-icon">📖</span>
                    <span className="breadcrumb-text">Contenido</span>
                  </span>
                </div>
              </div>
              
              <div className="header-main">
                <div className="header-content">
                  <h1 className="course-title">{courseData.title}</h1>
                  
                  <div className="header-actions">
                    <button 
                      className="btn btn-exit-course btn-save-exit"
                      onClick={handleReturnToCourse}
                      disabled={isSaving}
                    >
                      {isSaving ? '💾 Guardando...' : '🏠 Salir'}
                    </button>
                  </div>
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
                <div className="current-lesson">
                  <div className="lesson-header">
                    <h2>Lección {currentLessonIndex + 1}: {currentLesson.title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-type">{currentLesson.type}</span>
                      <span className="lesson-duration">{currentLesson.duration}</span>
                    </div>
                  </div>
                  
                  <div className="lesson-content">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: currentLesson.content 
                      }} 
                    />
                  </div>
                  
                  <div className="lesson-actions">
                    <div className="lesson-buttons">
                      <button 
                        className="btn btn-primary"
                        onClick={handlePreviousLesson}
                        disabled={currentLessonIndex === 0}
                      >
                        ← Lección Anterior
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleMarkLessonComplete(currentLesson.id)}
                      >
                        ✅ Marcar como completada
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="content-sidebar">
                {/* Lessons Navigation */}
                <div className="lessons-navigation">
                  <div className="navigation-header">
                    <h3>Lecciones del Curso</h3>
                    <div className="progress-indicator">
                      <span className="progress-text">
                        {progress.completedLessons.length} de {courseData.lessons.length} completadas
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(progress.completedLessons.length / courseData.lessons.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`lesson-item ${index === currentLessonIndex ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${!isLessonAccessible(index) ? 'locked' : ''}`}
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
                  
                  {/* Botón Terminar Curso */}
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
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
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
          font-weight: 600;
        }

        .course-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
        }

        .btn-exit-course {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-exit-course:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .course-content {
          padding: 2rem 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .current-lesson {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .lesson-header {
          margin-bottom: 2rem;
        }

        .lesson-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .lesson-meta {
          display: flex;
          gap: 1rem;
          color: #666;
        }

        .lesson-content {
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .lesson-content h2 {
          color: #333;
          margin-bottom: 1rem;
        }

        .lesson-content h3 {
          color: #555;
          margin: 1.5rem 0 0.5rem 0;
        }

        .lesson-content ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .lesson-content li {
          margin-bottom: 0.5rem;
        }

        .lesson-content pre {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .lesson-content code {
          background: #f0f0f0;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .video-container {
          margin: 2rem 0;
          text-align: center;
        }

        .video-container iframe {
          max-width: 100%;
          border-radius: 8px;
        }

        .lesson-actions {
          border-top: 1px solid #eee;
          padding-top: 2rem;
        }

        .lesson-buttons {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
        }

        .btn {
          padding: 0.75rem 1.5rem;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .content-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .lessons-navigation {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .navigation-header h3 {
          margin-bottom: 1rem;
          color: #333;
        }

        .progress-indicator {
          margin-bottom: 1.5rem;
        }

        .progress-text {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .lesson-item:hover {
          background: #f8f9fa;
          border-color: #e9ecef;
        }

        .lesson-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .lesson-item.completed {
          background: #f0f9ff;
          border-color: #0ea5e9;
        }

        .lesson-item.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .lesson-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .lesson-item.active .lesson-number {
          background: rgba(255, 255, 255, 0.2);
        }

        .lesson-item.completed .lesson-number {
          background: #0ea5e9;
          color: white;
        }

        .lesson-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
        }

        .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #666;
        }

        .lesson-item.active .lesson-meta {
          color: rgba(255, 255, 255, 0.8);
        }

        .lesson-status {
          margin-left: auto;
          font-size: 1.2rem;
        }

        .complete-course-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }

        .btn-complete-course {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-complete-course:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .btn-complete-course:disabled,
        .btn-complete-course.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          background: linear-gradient(135deg, #9ca3af, #6b7280);
        }

        .btn-complete-course:disabled:hover,
        .btn-complete-course.disabled:hover {
          background: linear-gradient(135deg, #9ca3af, #6b7280);
          transform: none;
          box-shadow: none;
        }

        .complete-course-info {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .course-completed-message {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border-radius: 12px;
          border: 2px solid #22c55e;
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
          line-height: 1.5;
        }

        .completion-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
          
          .course-title {
            font-size: 2rem;
          }
          
          .lesson-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
} 