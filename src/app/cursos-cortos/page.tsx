'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import CourseCard from '@/components/CourseCard';

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
      duration: '4 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
      students: 1247,
      source: 'YouTube - freeCodeCamp'
    },
    {
      id: 2,
      title: 'AI Ethics and Responsible AI',
      description: 'Aprende sobre ética en IA y desarrollo responsable de sistemas de IA.',
      duration: '3 horas',
      level: 'Todos los niveles',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Prof. Michael Rodriguez',
      rating: 4.9,
      students: 892,
      source: 'YouTube - MIT OpenCourseWare'
    },
    {
      id: 3,
      title: 'Introduction to Machine Learning',
      description: 'Conceptos básicos de machine learning para principiantes.',
      duration: '6 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Dr. Emily Watson',
      rating: 4.7,
      students: 2156,
      source: 'YouTube - StatQuest'
    },
    {
      id: 4,
      title: 'Python for Data Science',
      description: 'Fundamentos de Python para análisis de datos y ciencia de datos.',
      duration: '5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Alex Johnson',
      rating: 4.6,
      students: 3421,
      source: 'YouTube - Corey Schafer'
    },
    {
      id: 5,
      title: 'Neural Networks Basics',
      description: 'Introducción a redes neuronales y deep learning.',
      duration: '4 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop&crop=center',
      tag: 'Curso Corto',
      instructor: 'Dr. Carlos Mendez',
      rating: 4.8,
      students: 1567,
      source: 'YouTube - 3Blue1Brown'
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
                Cursos Cortos de
                <span className="block">Inteligencia Artificial</span>
              </h1>
              <p className="hero-description">
                Aprende conceptos clave de IA en sesiones intensivas y prácticas. 
                Perfectos para profesionales ocupados que quieren actualizarse rápidamente.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">15</span>
                  <span className="stat-label">Cursos Disponibles</span>
                </div>
                <div className="stat">
                  <span className="stat-number">2-6</span>
                  <span className="stat-label">Horas por Curso</span>
                </div>
                <div className="stat">
                  <span className="stat-number">35K+</span>
                  <span className="stat-label">Estudiantes</span>
                </div>
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
            <div className="section-header">
              <h2 className="section-title">Cursos Cortos Disponibles</h2>
              <p className="section-description">
                Aprende habilidades específicas de IA en sesiones intensivas y prácticas
              </p>
            </div>

            {/* Course Features */}
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Aprendizaje Rápido</h3>
                <p>Cursos intensivos de 3-6 horas para aprender conceptos clave rápidamente</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Enfoque Práctico</h3>
                <p>Proyectos reales y ejercicios prácticos para aplicar lo aprendido</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👨‍🏫</div>
                <h3>Expertos del Sector</h3>
                <p>Instructores con experiencia en empresas líderes de IA</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Acceso Ilimitado</h3>
                <p>Accede al contenido cuando quieras, desde cualquier dispositivo</p>
              </div>
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
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Listo para empezar?</h2>
              <p>Únete a miles de profesionales que ya están aprendiendo IA con nuestros cursos cortos</p>
              <a href="/courses" className="btn btn-primary">Ver Todos los Cursos</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 