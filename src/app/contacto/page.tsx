'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Footer from '@/components/Footer';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function ContactoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      alert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'contacto@egrow-academy.com',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: '💬',
      title: 'Chat en Vivo',
      content: 'Disponible 24/7',
      description: 'Respuesta inmediata'
    },
    {
      icon: '🌍',
      title: 'Comunidad',
      content: 'Únete al foro',
      description: 'Conecta con otros estudiantes'
    }
  ];

  const faqs = [
    {
      question: '¿Cuánto tiempo toma recibir una respuesta?',
      answer: 'Normalmente respondemos en 24 horas o menos durante días laborales.'
    },
    {
      question: '¿Puedo programar una llamada?',
      answer: 'Sí, menciona en tu mensaje que te gustaría programar una llamada y te contactaremos.'
    },
    {
      question: '¿Ofrecen soporte técnico?',
      answer: 'Sí, ofrecemos soporte técnico para todos nuestros cursos y plataforma.'
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
                Contacta con
                <span className="block">eGrow Academy</span>
              </h1>
              <p className="hero-description">
                ¿Tienes preguntas sobre nuestros cursos? ¿Necesitas ayuda técnica? 
                Estamos aquí para ayudarte en tu viaje de aprendizaje en IA.
              </p>
            </div>
          </div>
        </section>

        {/* Companies Marquee */}
        <Suspense fallback={<LoadingSpinner />}>
          <CompaniesMarquee />
        </Suspense>

        {/* Contact Methods */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Formas de Contactarnos</h2>
              <p className="section-description">
                Elige la opción que mejor se adapte a tus necesidades
              </p>
            </div>

            <div className="contact-methods-grid">
              {contactInfo.map((method, index) => (
                <div key={index} className="contact-method-card">
                  <div className="method-icon">{method.icon}</div>
                  <h3>{method.title}</h3>
                  <p className="method-content">{method.content}</p>
                  <p className="method-description">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section contact-form-section">
          <div className="container">
            <div className="contact-layout">
              {/* Left side - Form */}
              <div className="form-container">
                <div className="form-header">
                  <h2>Envíanos un Mensaje</h2>
                  <p>Completa el formulario y te responderemos lo antes posible</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Nombre Completo *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Correo Electrónico *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Asunto *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="consulta-cursos">Consulta sobre cursos</option>
                      <option value="soporte-tecnico">Soporte técnico</option>
                      <option value="colaboracion">Oportunidades de colaboración</option>
                      <option value="feedback">Feedback y sugerencias</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Mensaje *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Describe tu consulta o pregunta..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={`btn btn-primary btn-large ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              </div>

              {/* Right side - FAQ */}
              <div className="faq-container">
                <h3>Preguntas Frecuentes</h3>
                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <h4>{faq.question}</h4>
                      <p>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>¿Prefieres unirte a nuestra comunidad?</h2>
              <p>Conecta con otros estudiantes y obtén respuestas rápidas en nuestro foro</p>
              <div className="cta-button-center">
                <a href="/community" className="btn btn-outline">Unirse a la Comunidad</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 