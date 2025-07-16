'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CompanyPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'CEO & Fundadora',
      bio: 'Experta en machine learning con 15+ años en Google y OpenAI. PhD en Computer Science de Stanford.',
      image: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Sarah+Chen',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 2,
      name: 'Alex Johnson',
      role: 'CTO',
      bio: 'Ingeniero de software especializado en sistemas de IA a escala. Anteriormente en Meta y Amazon.',
      image: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Alex+Johnson',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 3,
      name: 'Dr. Emily Watson',
      role: 'Directora de Educación',
      bio: 'Investigadora en IA educativa con experiencia en diseño de currículos y pedagogía digital.',
      image: 'https://via.placeholder.com/300x300/f093fb/ffffff?text=Emily+Watson',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 4,
      name: 'Carlos Mendez',
      role: 'Director de Producto',
      bio: 'Product manager con experiencia en plataformas educativas y productos de IA.',
      image: 'https://via.placeholder.com/300x300/4facfe/ffffff?text=Carlos+Mendez',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const companyStats = [
    { number: '50K+', label: 'Estudiantes' },
    { number: '150+', label: 'Países' },
    { number: '200+', label: 'Cursos' },
    { number: '95%', label: 'Satisfacción' }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Excelencia',
      description: 'Nos esforzamos por la más alta calidad en todo lo que hacemos'
    },
    {
      icon: '🤝',
      title: 'Colaboración',
      description: 'Creemos en el poder del aprendizaje colaborativo y la comunidad'
    },
    {
      icon: '🚀',
      title: 'Innovación',
      description: 'Exploramos constantemente nuevas formas de enseñar y aprender'
    },
    {
      icon: '🌍',
      title: 'Impacto Global',
      description: 'Trabajamos para democratizar el acceso a la educación en IA'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Fundación',
      description: 'eGrow Academy nace con la misión de democratizar la educación en IA'
    },
    {
      year: '2021',
      title: 'Primeros Cursos',
      description: 'Lanzamiento de nuestros primeros cursos de machine learning'
    },
    {
      year: '2022',
      title: 'Expansión Global',
      description: 'Alcanzamos estudiantes en más de 100 países'
    },
    {
      year: '2023',
      title: 'Plataforma Avanzada',
      description: 'Lanzamiento de nuestra plataforma de aprendizaje personalizado'
    },
    {
      year: '2024',
      title: 'Futuro',
      description: 'Continuamos innovando y expandiendo nuestro impacto global'
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
                Sobre
                <span className="block">eGrow Academy</span>
              </h1>
              <p className="hero-description">
                Somos una plataforma educativa líder en inteligencia artificial, 
                comprometida con democratizar el acceso a la educación de calidad en IA.
              </p>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Mission Section */}
        <section className="section mission-section">
          <div className="container">
            <div className="mission-content">
              <div className="mission-text">
                <h2>Nuestra Misión</h2>
                <p>
                  Democratizar el acceso a la educación de calidad en inteligencia artificial, 
                  empoderando a personas de todo el mundo para que desarrollen las habilidades 
                  necesarias para el futuro del trabajo.
                </p>
                <p>
                  Creemos que la IA tiene el potencial de transformar positivamente la sociedad, 
                  y queremos asegurar que todos tengan la oportunidad de participar en esta revolución.
                </p>
              </div>
              <div className="mission-stats">
                {companyStats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Nuestros Valores</h2>
              <p className="section-description">
                Los principios que guían todo lo que hacemos
              </p>
            </div>

            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section team-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Nuestro Equipo</h2>
              <p className="section-description">
                Conoce a las mentes detrás de eGrow Academy
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-card">
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <div className="team-content">
                    <h3 className="team-name">{member.name}</h3>
                    <p className="team-role">{member.role}</p>
                    <p className="team-bio">{member.bio}</p>
                    <div className="team-social">
                      <a href={member.linkedin} className="social-link">LinkedIn</a>
                      <a href={member.twitter} className="social-link">Twitter</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section timeline-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Nuestra Historia</h2>
              <p className="section-description">
                El viaje que nos ha llevado hasta aquí
              </p>
            </div>

            <div className="timeline">
              {timeline.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-year">{event.year}</div>
                  <div className="timeline-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact-section">
          <div className="container">
            <div className="contact-content">
              <h2>¿Quieres Trabajar con Nosotros?</h2>
              <p>
                Estamos siempre buscando talento apasionado por la educación y la tecnología. 
                Únete a nuestro equipo y ayúdanos a cambiar el mundo.
              </p>
              <div className="contact-buttons">
                <a href="#careers" className="btn btn-primary">Ver Oportunidades</a>
                <a href="#contact" className="btn btn-outline">Contactar</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Listo para Empezar tu Viaje en IA?</h2>
              <p>Únete a miles de estudiantes que ya están aprendiendo con nosotros</p>
              <a href="/courses" className="btn btn-primary">Explorar Cursos</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 