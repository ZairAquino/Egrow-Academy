'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function CommunityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleFAQToggle = (e: Event) => {
      const question = (e.target as Element).closest('.faq-question');
      if (question) {
        const faqItem = question.closest('.faq-item');
        if (faqItem) {
          faqItem.classList.toggle('active');
        }
      }
    };

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', handleFAQToggle);
    });

    return () => {
      faqQuestions.forEach(question => {
        question.removeEventListener('click', handleFAQToggle);
      });
    };
  }, []);

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
                <a href="#features" className="btn btn-white">¿Qué Ofrecemos?</a>
                <a href="#forum" className="btn btn-outline">Ver Foro</a>
                <a href="#events" className="btn btn-outline">Ver Eventos</a>
                <a href="#faq" className="btn btn-outline">FAQ</a>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Community Features & Stats */}
        <section id="features" className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">¿Qué Ofrece Nuestra Comunidad?</h2>
              <p className="section-description">
                Descubre todas las oportunidades y recursos disponibles para miembros
              </p>
            </div>

            <div className="features-stats-layout">
              {/* Left side - Features */}
              <div className="features-container">
                <div className="features-grid-compact">
                  {communityFeatures.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <div className="feature-icon">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="stats-container">
                <h3 className="stats-title">Nuestra Comunidad en Números</h3>
                <div className="stats-grid-vertical">
                  {communityStats.map((stat, index) => (
                    <div key={index} className="stat-card">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Forum */}
        <section id="forum" className="section forum-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Foro de la Comunidad eGrow</h2>
              <p className="section-description">
                Únete a las discusiones, comparte experiencias y conecta con otros estudiantes
              </p>
            </div>

            <div className="forum-layout">
              {/* Forum Header with Stats */}
              <div className="forum-header">
                <div className="forum-stats">
                  <div className="stat-item">
                    <span className="stat-number">245</span>
                    <span className="stat-text">Discusiones</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">89</span>
                    <span className="stat-text">Miembros Activos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">1.2K</span>
                    <span className="stat-text">Respuestas</span>
                  </div>
                </div>
                <button className="btn btn-primary forum-cta">💬 Crear Nueva Discusión</button>
              </div>

              {/* Recent Discussions */}
              <div className="forum-content">
                <div className="forum-section-title">
                  <h3>💬 Discusiones Recientes sobre Cursos</h3>
                  <span className="view-all">Ver todas →</span>
                </div>
                
                <div className="forum-posts">
                  <div className="forum-post-card">
                    <div className="post-header">
                      <div className="user-info">
                        <img src="https://via.placeholder.com/50x50/667eea/ffffff?text=MJ" alt="María José" className="user-avatar" />
                        <div className="user-details">
                          <h4 className="post-title">¿Alguien más tuvo problemas con el módulo de Transformers?</h4>
                          <p className="post-meta">María José · hace 2 horas · <span className="course-tag">Deep Learning con PyTorch</span></p>
                        </div>
                      </div>
                      <div className="post-engagement">
                        <div className="engagement-item">
                          <span className="icon">👍</span>
                          <span>12</span>
                        </div>
                        <div className="engagement-item">
                          <span className="icon">💬</span>
                          <span>8</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="forum-post-card">
                    <div className="post-header">
                      <div className="user-info">
                        <img src="https://via.placeholder.com/50x50/764ba2/ffffff?text=AR" alt="Alex Rodriguez" className="user-avatar" />
                        <div className="user-details">
                          <h4 className="post-title">Recursos adicionales para ChatGPT Prompt Engineering</h4>
                          <p className="post-meta">Alex Rodriguez · hace 5 horas · <span className="course-tag">ChatGPT para Desarrolladores</span></p>
                        </div>
                      </div>
                      <div className="post-engagement">
                        <div className="engagement-item">
                          <span className="icon">👍</span>
                          <span>28</span>
                        </div>
                        <div className="engagement-item">
                          <span className="icon">💬</span>
                          <span>15</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="forum-post-card">
                    <div className="post-header">
                      <div className="user-info">
                        <img src="https://via.placeholder.com/50x50/f093fb/ffffff?text=CS" alt="Carlos Silva" className="user-avatar" />
                        <div className="user-details">
                          <h4 className="post-title">Proyecto final: ¿Qué dataset recomiendan?</h4>
                          <p className="post-meta">Carlos Silva · hace 1 día · <span className="course-tag">Machine Learning Fundamentals</span></p>
                        </div>
                      </div>
                      <div className="post-engagement">
                        <div className="engagement-item">
                          <span className="icon">👍</span>
                          <span>19</span>
                        </div>
                        <div className="engagement-item">
                          <span className="icon">💬</span>
                          <span>22</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="forum-post-card">
                    <div className="post-header">
                      <div className="user-info">
                        <img src="https://via.placeholder.com/50x50/84fab0/ffffff?text=LP" alt="Laura Pérez" className="user-avatar" />
                        <div className="user-details">
                          <h4 className="post-title">Compartiendo mi experiencia con LangChain</h4>
                          <p className="post-meta">Laura Pérez · hace 1 día · <span className="course-tag">LangChain Development</span></p>
                        </div>
                      </div>
                      <div className="post-engagement">
                        <div className="engagement-item">
                          <span className="icon">👍</span>
                          <span>35</span>
                        </div>
                        <div className="engagement-item">
                          <span className="icon">💬</span>
                          <span>18</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section faq-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Preguntas Frecuentes</h2>
              <p className="section-description">
                Encuentra respuestas a las preguntas más comunes de nuestra comunidad
              </p>
            </div>

            <div className="faq-container">
              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Cómo puedo acceder a los foros de discusión?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Una vez que te registres en eGrow Academy, tendrás acceso automático a todos los foros de la comunidad. Simplemente inicia sesión y navega a la sección de Comunidad.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Los eventos son gratuitos para todos los miembros?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Sí, todos los eventos listados son completamente gratuitos para miembros de eGrow Academy. Solo necesitas registrarte con anticipación debido a la capacidad limitada.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Puedo participar en mentorías aunque sea principiante?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>¡Por supuesto! Nuestro programa de mentorías está diseñado para todos los niveles. Tenemos mentores especializados en guiar a principiantes en sus primeros pasos en IA.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Cómo puedo convertirme en mentor de la comunidad?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Si tienes experiencia profesional en IA y quieres contribuir, puedes aplicar para ser mentor completando nuestro formulario de aplicación. Evaluamos cada candidatura individualmente.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Hay oportunidades laborales exclusivas para miembros?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>Sí, tenemos partnerships con empresas líderes en IA que publican ofertas de trabajo exclusivamente para nuestra comunidad. Estas aparecen en la sección de Oportunidades Laborales.</p>
                </div>
              </div>

              <div className="faq-item">
                <div className="faq-question">
                  <h3>¿Puedo organizar mi propio evento para la comunidad?</h3>
                  <span className="faq-toggle">+</span>
                </div>
                <div className="faq-answer">
                  <p>¡Sí! Fomentamos que los miembros organicen sus propios eventos. Contáctanos con tu propuesta y te ayudaremos con la logística y promoción.</p>
                </div>
              </div>

              {/* Ask Question CTA */}
              <div className="ask-question-cta">
                <div className="cta-content">
                  <h3>¿No encuentras la respuesta que buscas?</h3>
                  <p>Haz tu pregunta a la comunidad y obtén respuestas de expertos</p>
                  <button className="btn btn-primary">❓ Hacer una Pregunta</button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Upcoming Events */}
        <section id="events" className="section events-section">
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
        <section className="section join-cta-section">
          <div className="container">
            <div className="join-cta-card">
              <div className="cta-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
              </div>
              <div className="join-cta-content">
                <h2>¿Listo para Unirte?</h2>
                <p>Forma parte de una de las comunidades más activas y valiosas en inteligencia artificial</p>
                <div className="cta-stats-inline">
                  <div className="inline-stat">
                    <span className="stat-num">25K+</span>
                    <span className="stat-text">Miembros</span>
                  </div>
                  <div className="inline-stat">
                    <span className="stat-num">150+</span>
                    <span className="stat-text">Países</span>
                  </div>
                  <div className="inline-stat">
                    <span className="stat-num">95%</span>
                    <span className="stat-text">Satisfacción</span>
                  </div>
                </div>
                <div className="cta-buttons-centered">
                  <a href="#join" className="btn btn-primary btn-large">Unirse Gratis</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 