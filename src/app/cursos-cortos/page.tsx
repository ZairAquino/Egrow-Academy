'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import CourseCard from '@/components/CourseCard';
import Footer from '@/components/Footer';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CursosCortosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const shortCourses = [
    {
      id: 1,
      title: 'ChatGPT Prompt Engineering for Developers',
      description: 'Aprende las mejores prácticas de prompt engineering para aplicaciones con LLMs.',
      duration: '1.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'DeepLearning.AI & OpenAI',
      rating: 4.9,
      students: 150000,
      source: 'DeepLearning.AI',
      link: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/'
    },
    {
      id: 2,
      title: 'Building Systems with ChatGPT API',
      description: 'Construye aplicaciones complejas usando el API de ChatGPT con mejores prácticas.',
      duration: '1 hora',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'DeepLearning.AI & OpenAI',
      rating: 4.8,
      students: 89000,
      source: 'DeepLearning.AI',
      link: 'https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/'
    },
    {
      id: 3,
      title: 'LangChain for LLM Application Development',
      description: 'Usa el framework LangChain para construir aplicaciones potentes con LLMs.',
      duration: '1 hora',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'DeepLearning.AI & LangChain',
      rating: 4.8,
      students: 75000,
      source: 'DeepLearning.AI',
      link: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/'
    },
    {
      id: 4,
      title: 'LLMOps: Large Language Model Operations',
      description: 'Aprende a desplegar y gestionar LLMs en producción con mejores prácticas.',
      duration: '1 hora',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'DeepLearning.AI & Google Cloud',
      rating: 4.7,
      students: 42000,
      source: 'DeepLearning.AI',
      link: 'https://www.deeplearning.ai/short-courses/llmops/'
    },
    {
      id: 5,
      title: 'Building Generative AI Applications with Gradio',
      description: 'Crea interfaces web interactivas para tus modelos de IA con Gradio.',
      duration: '1 hora',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'DeepLearning.AI & Hugging Face',
      rating: 4.6,
      students: 38000,
      source: 'DeepLearning.AI',
      link: 'https://www.deeplearning.ai/short-courses/building-generative-ai-applications-with-gradio/'
    },
    {
      id: 6,
      title: 'Data Visualization with Python',
      description: 'Crea visualizaciones impactantes con matplotlib, seaborn y plotly.',
      duration: '3 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Maria Garcia',
      rating: 4.5,
      students: 1893,
      source: 'YouTube - DataCamp'
    },
    {
      id: 7,
      title: 'TensorFlow 2.0 Tutorial',
      description: 'Aprende TensorFlow 2.0 desde cero con ejemplos prácticos.',
      duration: '4.5 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Daniel Bourke',
      rating: 4.7,
      students: 2341,
      source: 'YouTube - freeCodeCamp'
    },
    {
      id: 8,
      title: 'Scikit-learn Machine Learning',
      description: 'Master scikit-learn para machine learning con Python.',
      duration: '3.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Keith Galli',
      rating: 4.6,
      students: 1678,
      source: 'YouTube - Keith Galli'
    },
    {
      id: 9,
      title: 'Pandas Tutorial for Beginners',
      description: 'Manipulación y análisis de datos con pandas.',
      duration: '2.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Alex The Analyst',
      rating: 4.8,
      students: 2987,
      source: 'YouTube - Alex The Analyst'
    },
    {
      id: 10,
      title: 'NumPy Tutorial for Beginners',
      description: 'Computación numérica eficiente con NumPy.',
      duration: '2 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Programming with Mosh',
      rating: 4.7,
      students: 1456,
      source: 'YouTube - Programming with Mosh'
    },
    {
      id: 11,
      title: 'OpenCV Python Tutorial',
      description: 'Procesamiento de imágenes y visión por computadora.',
      duration: '3 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Pysource',
      rating: 4.5,
      students: 1234,
      source: 'YouTube - Pysource'
    },
    {
      id: 12,
      title: 'Natural Language Processing Basics',
      description: 'Introducción al procesamiento de lenguaje natural.',
      duration: '4 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Krish Naik',
      rating: 4.6,
      students: 1876,
      source: 'YouTube - Krish Naik'
    },
    {
      id: 13,
      title: 'SQL for Data Science',
      description: 'Consultas SQL para análisis de datos y ciencia de datos.',
      duration: '3.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Alex The Analyst',
      rating: 4.8,
      students: 3421,
      source: 'YouTube - Alex The Analyst'
    },
    {
      id: 14,
      title: 'Git and GitHub for Beginners',
      description: 'Control de versiones con Git y colaboración en GitHub.',
      duration: '2.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'freeCodeCamp',
      rating: 4.9,
      students: 4567,
      source: 'YouTube - freeCodeCamp'
    },
    {
      id: 15,
      title: 'Docker for Data Science',
      description: 'Contenedores Docker para proyectos de ciencia de datos.',
      duration: '2 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Tech With Tim',
      rating: 4.4,
      students: 987,
      source: 'YouTube - Tech With Tim'
    }
  ];

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Cursos Gratuitos
                <span className="block">de Inteligencia Artificial</span>
              </h1>
              <p className="hero-description">
                Aprende conceptos clave de IA sin costo alguno. Sesiones intensivas y prácticas 
                perfectas para profesionales que quieren iniciarse en inteligencia artificial.
              </p>
              <div className="free-badge">
                <span className="badge-icon">🆓</span>
                <span className="badge-text">100% Gratuito</span>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Courses Section */}
        <section className="section">
          <div className="container">
            {/* Features Section */}
            <div className="features-section-header">
              <h2 className="section-title">¿Por qué elegir nuestros Cursos Gratuitos?</h2>
              <p className="section-description">
                Descubre las ventajas de aprender IA con nosotros sin ningún costo
              </p>
            </div>

            <div className="features-stats-layout">
              {/* Left side - Features */}
              <div className="features-container">
                <div className="features-grid-vertical">
                  <div className="feature-card">
                    <div className="feature-icon">🆓</div>
                    <h3>Completamente Gratis</h3>
                    <p>Sin costos ocultos, sin suscripciones. Acceso inmediato a contenido de calidad</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Aprendizaje Rápido</h3>
                    <p>Cursos de 1-4 horas para aprender conceptos clave rápidamente</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>Enfoque Práctico</h3>
                    <p>Proyectos reales y ejercicios prácticos para aplicar lo aprendido</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h3>Sin Barreras</h3>
                    <p>Comienza tu viaje en IA sin inversión inicial. Perfectos para principiantes</p>
                  </div>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="stats-container">
                <h3 className="stats-title">Nuestros Números</h3>
                <div className="stats-grid-vertical">
                  <div className="stat-card">
                    <div className="stat-number">15</div>
                    <div className="stat-label">Cursos Disponibles</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">1-4</div>
                    <div className="stat-label">Horas por Curso</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">35K+</div>
                    <div className="stat-label">Estudiantes</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Gratuito</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="section courses-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Cursos Gratuitos Disponibles</h2>
              <p className="section-description">
                Aprende habilidades específicas de IA completamente gratis. Acceso inmediato sin necesidad de suscripción.
              </p>
            </div>

            {/* Courses Grid */}
            <div className="courses-grid">
              {shortCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  image={course.image}
                  title={course.title}
                  description={course.description}
                  tag={course.tag}
                  duration={course.duration}
                  level={course.level}
                  link={course.link}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Listo para llevar tu aprendizaje al siguiente nivel?</h2>
              <p>¿Te gustaron nuestros cursos gratuitos? Descubre nuestros cursos premium con certificaciones y proyectos avanzados</p>
              <div className="cta-button-center">
                <a href="/courses" className="btn btn-primary">Ver Todos los Cursos</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 