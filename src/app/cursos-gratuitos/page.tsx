'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/courses/CourseCard';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CursosGratuitosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const freeCourses = [
    // Nuestro Curso Propio
    {
      id: 'introduccion-llms',
      title: 'Introducción a Large Language Models (LLMs)',
      description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
      duration: '2 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
      tag: 'eGrow Academy',
      instructor: 'Dr. Maria Rodriguez',
      source: 'eGrow Academy',
      link: '/curso/introduccion-llms'
    },
    {
      id: 'fundamentos-ml',
      title: 'Fundamentos de Machine Learning',
      description: 'Aprende los conceptos básicos de Machine Learning, desde algoritmos supervisados hasta no supervisados, y cómo implementarlos en Python.',
      duration: '2.5 horas',
      level: 'Principiante',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop&crop=center',
      tag: 'eGrow Academy',
      instructor: 'Dr. Carlos Mendoza',
      source: 'eGrow Academy',
      link: '/curso/fundamentos-ml'
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision con Python',
      description: 'Aprende a procesar y analizar imágenes usando OpenCV, detectar objetos, reconocer rostros y crear aplicaciones de visión por computadora.',
      duration: '3 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center',
      tag: 'eGrow Academy',
      instructor: 'Dra. Ana Torres',
      source: 'eGrow Academy',
      link: '/curso/computer-vision'
    }
  ];

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-top-right" />
      
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
                    <div className="stat-number">23</div>
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
              {freeCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  id={course.id.toString()}
                  image={course.image}
                  title={course.title}
                  description={course.description}
                  tag={course.tag}
                  duration={course.duration}
                  level={course.level}
                  category={course.tag}
                  isFree={true}
                  requiresAuth={false}
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