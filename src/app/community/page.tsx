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

export default function CommunityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const communityStats = [
    { number: '25K+', label: 'Miembros Activos' },
    { number: '150+', label: 'Países' },
    { number: '500+', label: 'Eventos Mensuales' },
    { number: '95%', label: 'Satisfacción' }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Workshop: Introducción a Transformers',
      date: '2024-01-20',
      time: '14:00 - 16:00',
      type: 'Online',
      attendees: 45,
      instructor: 'Dr. Sarah Chen',
      image: 'https://via.placeholder.com/400x250/667eea/ffffff?text=Transformers+Workshop'
    },
    {
      id: 2,
      title: 'Meetup: IA en Startups',
      date: '2024-01-25',
      time: '19:00 - 21:00',
      type: 'Presencial',
      attendees: 32,
      instructor: 'Alex Johnson',
      image: 'https://via.placeholder.com/400x250/764ba2/ffffff?text=AI+Startups+Meetup'
    },
    {
      id: 3,
      title: 'Webinar: Ética en IA',
      date: '2024-01-30',
      time: '15:00 - 16:30',
      type: 'Online',
      attendees: 78,
      instructor: 'Prof. Michael Rodriguez',
      image: 'https://via.placeholder.com/400x250/f093fb/ffffff?text=AI+Ethics+Webinar'
    }
  ];

  const communityFeatures = [
    {
      icon: '💬',
      title: 'Foros de Discusión',
      description: 'Conecta con otros profesionales, comparte conocimientos y resuelve dudas'
    },
    {
      icon: '🎯',
      title: 'Mentorías',
      description: 'Accede a sesiones de mentoría con expertos del sector'
    },
    {
      icon: '📚',
      title: 'Recursos Compartidos',
      description: 'Biblioteca de recursos, papers y herramientas recomendadas por la comunidad'
    },
    {
      icon: '🤝',
      title: 'Networking',
      description: 'Eventos presenciales y virtuales para expandir tu red profesional'
    },
    {
      icon: '🏆',
      title: 'Competencias',
      description: 'Participa en hackathons y competencias de IA'
    },
    {
      icon: '📈',
      title: 'Oportunidades Laborales',
      description: 'Acceso exclusivo a ofertas de trabajo en empresas líderes'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'María García',
      role: 'Data Scientist',
      company: 'TechCorp',
      content: 'La comunidad de eGrow Academy me ayudó a conseguir mi primer trabajo en IA. Los mentores son increíbles.',
      avatar: 'https://via.placeholder.com/80x80/667eea/ffffff?text=MG'
    },
    {
      id: 2,
      name: 'Carlos López',
      role: 'ML Engineer',
      company: 'AI Startup',
      content: 'Los eventos y workshops me mantienen actualizado con las últimas tendencias. Excelente networking.',
      avatar: 'https://via.placeholder.com/80x80/764ba2/ffffff?text=CL'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      role: 'AI Researcher',
      company: 'Universidad',
      content: 'La calidad de las discusiones y recursos compartidos es excepcional. Una comunidad muy valiosa.',
      avatar: 'https://via.placeholder.com/80x80/f093fb/ffffff?text=AM'
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
                Únete a nuestra
                <span className="block">Comunidad de IA</span>
              </h1>
              <p className="hero-description">
                Conecta con profesionales, expertos y entusiastas de la inteligencia artificial. 
                Aprende, comparte y crece junto a una comunidad global apasionada por la IA.
              </p>
              <div className="hero-buttons">
                <a href="#join" className="btn btn-white">Unirse a la Comunidad</a>
                <a href="#events" className="btn btn-outline">Ver Eventos</a>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Community Stats */}
        <section className="section stats-section">
          <div className="container">
            <div className="stats-grid">
              {communityStats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Features */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">¿Qué Ofrece Nuestra Comunidad?</h2>
              <p className="section-description">
                Descubre todas las oportunidades y recursos disponibles para miembros
              </p>
            </div>

            <div className="features-grid">
              {communityFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="section events-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Próximos Eventos</h2>
              <p className="section-description">
                Participa en nuestros eventos y workshops exclusivos
              </p>
            </div>

            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <span className={`event-type ${event.type.toLowerCase()}`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="event-content">
                    <div className="event-meta">
                      <span className="event-date">{event.date}</span>
                      <span className="event-time">{event.time}</span>
                    </div>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-instructor">Con {event.instructor}</p>
                    <div className="event-attendees">
                      <span>👥 {event.attendees} asistentes</span>
                    </div>
                    <button className="btn btn-primary">Registrarse</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section testimonials-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Lo que Dicen Nuestros Miembros</h2>
              <p className="section-description">
                Testimonios de profesionales que han crecido con nuestra comunidad
              </p>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-content">
                    <p>&quot;{testimonial.content}&quot;</p>
                  </div>
                  <div className="testimonial-author">
                    <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role} en {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Community CTA */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Listo para Unirte?</h2>
              <p>Forma parte de una de las comunidades más activas y valiosas en inteligencia artificial</p>
              <div className="cta-buttons">
                <a href="#join" className="btn btn-primary">Unirse Gratis</a>
                <a href="#learn-more" className="btn btn-outline">Saber Más</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
} 