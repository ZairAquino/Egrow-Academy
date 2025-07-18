'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function ContenidoCursoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const courseData = {
    id: 'introduccion-llms',
    title: 'Introducción a Large Language Models (LLMs)',
    description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
    lessons: [
      {
        id: 1,
        title: 'Bienvenida e Introducción',
        duration: '8 min',
        type: 'video',
        description: 'Presentación del curso y conceptos fundamentales',
        content: `
          <h2>Bienvenido al curso de Introducción a LLMs</h2>
          <p>En este curso aprenderás los fundamentos de los modelos de lenguaje grandes, una de las tecnologías más revolucionarias de la inteligencia artificial.</p>
          
          <h3>¿Qué aprenderás?</h3>
          <ul>
            <li>Fundamentos de los LLMs</li>
            <li>Arquitectura Transformer</li>
            <li>Prompt Engineering</li>
            <li>Implementación práctica</li>
          </ul>
          
          <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
          </div>
        `,
        completed: false
      },
      {
        id: 2,
        title: '¿Qué son los LLMs?',
        duration: '15 min',
        type: 'video',
        description: 'Definición y características principales de los modelos de lenguaje grandes',
        content: `
          <h2>¿Qué son los Large Language Models?</h2>
          <p>Los Large Language Models (LLMs) son modelos de inteligencia artificial entrenados en grandes cantidades de texto para comprender y generar lenguaje humano.</p>
          
          <h3>Características principales:</h3>
          <ul>
            <li><strong>Escala masiva:</strong> Entrenados con miles de millones de parámetros</li>
            <li><strong>Capacidades emergentes:</strong> Habilidades que surgen con el escalado</li>
            <li><strong>Transferencia de conocimiento:</strong> Aplican lo aprendido a nuevas tareas</li>
            <li><strong>Generación de texto:</strong> Crean contenido coherente y contextual</li>
          </ul>
          
          <h3>Ejemplos de LLMs:</h3>
          <ul>
            <li>GPT-3, GPT-4 (OpenAI)</li>
            <li>Claude (Anthropic)</li>
            <li>BERT (Google)</li>
            <li>LLaMA (Meta)</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 3,
        title: 'Historia y Evolución',
        duration: '12 min',
        type: 'video',
        description: 'Evolución desde N-gramas hasta los modelos actuales',
        content: `
          <h2>Historia y Evolución de los LLMs</h2>
          <p>La evolución de los modelos de lenguaje ha sido un viaje fascinante que ha transformado la inteligencia artificial.</p>
          
          <h3>Línea de tiempo:</h3>
          <ul>
            <li><strong>1950s:</strong> N-gramas y modelos estadísticos básicos</li>
            <li><strong>1980s:</strong> Redes neuronales recurrentes (RNN)</li>
            <li><strong>1990s:</strong> LSTM y GRU para secuencias largas</li>
            <li><strong>2017:</strong> Arquitectura Transformer (Vaswani et al.)</li>
            <li><strong>2018:</strong> BERT y modelos bidireccionales</li>
            <li><strong>2020:</strong> GPT-3 y escalado masivo</li>
            <li><strong>2022:</strong> ChatGPT y adopción masiva</li>
            <li><strong>2023+:</strong> GPT-4, Claude y modelos multimodales</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 4,
        title: 'Arquitectura Transformer',
        duration: '20 min',
        type: 'video',
        description: 'Fundamentos de la arquitectura que revolucionó el PLN',
        content: `
          <h2>Arquitectura Transformer</h2>
          <p>La arquitectura Transformer, introducida en el paper "Attention is All You Need", revolucionó el procesamiento de lenguaje natural.</p>
          
          <h3>Componentes principales:</h3>
          <ul>
            <li><strong>Multi-Head Attention:</strong> Mecanismo de atención que permite al modelo enfocarse en diferentes partes de la entrada</li>
            <li><strong>Feed-Forward Networks:</strong> Redes neuronales que procesan la información</li>
            <li><strong>Layer Normalization:</strong> Normalización que estabiliza el entrenamiento</li>
            <li><strong>Residual Connections:</strong> Conexiones que facilitan el flujo de gradientes</li>
          </ul>
          
          <h3>Ventajas del Transformer:</h3>
          <ul>
            <li>Paralelización eficiente</li>
            <li>Captura de dependencias a largo plazo</li>
            <li>Escalabilidad masiva</li>
            <li>Flexibilidad arquitectónica</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 5,
        title: 'Lab: Explorando GPT-3.5',
        duration: '25 min',
        type: 'lab',
        description: 'Ejercicio práctico usando la API de OpenAI',
        content: `
          <h2>Laboratorio: Explorando GPT-3.5</h2>
          <p>En este laboratorio práctico, aprenderás a usar la API de OpenAI para interactuar con GPT-3.5.</p>
          
          <h3>Configuración inicial:</h3>
          <pre><code>pip install openai
export OPENAI_API_KEY="tu-api-key-aqui"</code></pre>
          
          <h3>Ejemplo básico:</h3>
          <pre><code>import openai

openai.api_key = "tu-api-key-aqui"

response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "Explica qué son los LLMs en 3 oraciones"}
  ]
)

print(response.choices[0].message.content)</code></pre>
          
          <h3>Ejercicios prácticos:</h3>
          <ol>
            <li>Genera un resumen de un texto</li>
            <li>Crea un chatbot simple</li>
            <li>Traduce texto entre idiomas</li>
            <li>Genera código Python</li>
          </ol>
        `,
        completed: false
      }
    ]
  };

  useEffect(() => {
    // Verificar si el usuario está inscrito
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/introduccion-llms/contenido');
    }
  }, [user]);

  const checkEnrollment = async () => {
    try {
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error('Error verificando inscripción:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const markLessonComplete = async (lessonId: number) => {
    // Aquí implementarías la lógica para marcar la lección como completada
    console.log('Marcando lección como completada:', lessonId);
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/introduccion-llms')}>
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
                <a href="/">Inicio</a> / <a href="/cursos-gratuitos">Cursos Gratuitos</a> / <a href="/curso/introduccion-llms">Introducción a LLMs</a> / <span>Contenido</span>
              </div>
              
              <h1 className="course-title">{courseData.title}</h1>
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
                    <h2>Lección {currentLesson + 1}: {courseData.lessons[currentLesson].title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-type">{courseData.lessons[currentLesson].type}</span>
                      <span className="lesson-duration">{courseData.lessons[currentLesson].duration}</span>
                    </div>
                  </div>
                  
                  <div className="lesson-content">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: courseData.lessons[currentLesson].content 
                      }} 
                    />
                  </div>
                  
                  <div className="lesson-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => markLessonComplete(courseData.lessons[currentLesson].id)}
                    >
                      Marcar como completada
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="content-sidebar">
                {/* Lessons Navigation */}
                <div className="lessons-navigation">
                  <h3>Lecciones del Curso</h3>
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`lesson-item ${index === currentLesson ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                        onClick={() => setCurrentLesson(index)}
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
                          {lesson.completed ? '✅' : index === currentLesson ? '▶️' : '🔒'}
                        </div>
                      </div>
                    ))}
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
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .course-breadcrumb a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
        }

        .course-breadcrumb a:hover {
          color: white;
        }

        .course-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
        }

        .course-content {
          padding: 3rem 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
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
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .lesson-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .lesson-type {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .lesson-content {
          line-height: 1.7;
          color: #374151;
        }

        .lesson-content h2 {
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
        }

        .lesson-content h3 {
          color: #1f2937;
          margin: 1.25rem 0 0.75rem 0;
        }

        .lesson-content ul, .lesson-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .lesson-content li {
          margin: 0.5rem 0;
        }

        .lesson-content pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .lesson-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          margin: 2rem 0;
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }

        .lesson-actions {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f3f4f6;
        }

        .lessons-navigation {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
        }

        .lessons-navigation h3 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .lesson-item:hover {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .lesson-item.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .lesson-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
        }

        .lesson-item.active .lesson-number {
          background: #3b82f6;
          color: white;
        }

        .lesson-item.completed .lesson-number {
          background: #22c55e;
          color: white;
        }

        .lesson-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #1f2937;
        }

        .lesson-content .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .lesson-status {
          margin-left: auto;
          font-size: 1.2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
          
          .course-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
} 