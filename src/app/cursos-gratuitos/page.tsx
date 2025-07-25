'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/courses/CourseCard';
import Footer from '@/components/layout/Footer';
import UserProfile from '@/components/auth/UserProfile';
import StatsContainer from '@/components/ui/StatsContainer';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CursosGratuitosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const freeCourses = [
    // Curso Destacado - Monetización con IA
    {
      id: 'monetiza-ia',
      title: 'Monetiza con la IA',
      description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
      duration: '3 horas',
      level: 'Intermedio',
      price: 'Gratis',
      image: '/images/v-5.png',
      tag: 'eGrow Academy',
      instructor: 'Dr. Juan Pérez',
      source: 'eGrow Academy',
      link: '/curso/monetiza-ia'
    },
    // Otros Cursos
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
      <UserProfile className="user-profile-fixed" />
      
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
              
              {/* Logo blanco debajo del texto */}
              <div className="hero-bottom-logo">
                <div className="logo-animation-wrapper">
                  <Image 
                    src={user && user.membershipLevel === 'PREMIUM' ? "/images/logop.png" : "/images/logog.png"}
                    alt="eGrow Academy" 
                    width={95}
                    height={95}
                    priority
                    className="hero-bottom-logo-image"
                  />
                </div>
              </div>
              
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
                    <p>Sin costos ocultos, sin suscripciones.<br />Acceso inmediato a contenido de calidad</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Aprendizaje Rápido</h3>
                    <p>Cursos de 1-4 horas para aprender<br />conceptos clave rápidamente</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>Enfoque Práctico</h3>
                    <p>Proyectos reales y ejercicios prácticos<br />para aplicar lo aprendido</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h3>Sin Barreras</h3>
                    <p>Comienza tu viaje en IA sin inversión inicial.<br />Perfectos para principiantes</p>
                  </div>
                </div>
              </div>

              {/* Right side - Stats */}
              <StatsContainer showFreeCourses={true} />
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

        {/* CTA Section - Moved from footer to body */}
        <section className="section cta-section" style={{
          background: 'white',
          color: '#2d3748',
          padding: '4rem 0'
        }}>
          <div className="container">
            <div className="cta-content" style={{ textAlign: 'center' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#2d3748'
              }}>
                ¿Te gustaron nuestros cursos gratuitos?
              </h2>
              <p style={{
                fontSize: '1.2rem',
                marginBottom: '2rem',
                color: '#718096',
                maxWidth: '600px',
                margin: '0 auto 2rem auto'
              }}>
                Descubre nuestros cursos premium con certificaciones y proyectos avanzados
              </p>
              <div className="cta-button-center">
                <a href="/courses" className="btn btn-primary" style={{
                  fontSize: '1.1rem',
                  padding: '1rem 2rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: '2px solid #3b82f6',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  Ver Todos los Cursos
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <style jsx>{`
        .hero-bottom-logo {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        .hero-bottom-logo-image {
          height: auto;
          max-height: 71px;
          width: auto;
          max-width: 95px;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .logo-animation-wrapper {
          animation: logoFloat 3s ease-in-out infinite;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-animation-wrapper:hover {
          animation-play-state: paused;
        }

        .logo-animation-wrapper:hover .hero-bottom-logo-image {
          transform: scale(1.1) rotate(5deg);
          filter: brightness(1.2);
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .hero-bottom-logo-image {
            max-width: 76px;
            max-height: 57px;
          }
        }

        @media (max-width: 480px) {
          .hero-bottom-logo-image {
            max-width: 66px;
            max-height: 48px;
          }
        }

        /* Estilos para el botón CTA */
        .cta-section .btn-primary:hover {
          background: #2563eb !important;
          color: white !important;
          border-color: #2563eb !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 768px) {
          .cta-section h2 {
            font-size: 2rem !important;
          }
          
          .cta-section p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
} 