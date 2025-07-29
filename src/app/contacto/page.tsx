'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import SimpleLayout from '@/components/layout/SimpleLayout';
import DynamicLogo from '@/components/ui/DynamicLogo';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { user } = useAuth();

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
    setSubmitMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      content: 'egrowsuite@gmail.com',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: '🌍',
      title: 'Comunidad',
      content: 'Únete al foro',
      description: 'Conecta con otros miembros de la comunidad'
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
    <SimpleLayout>
      <main className="main-content" style={{ paddingTop: '80px' }}>
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
              
              {/* Logo blanco debajo del texto */}
              <div className="hero-bottom-logo">
                <div className="logo-animation-wrapper">
                  <DynamicLogo width={95} height={95} priority className="hero-bottom-logo-image" />
                </div>
              </div>
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
                {user ? (
                  <>
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

                      {submitMessage && (
                        <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                          {submitMessage}
                        </div>
                      )}
                    </form>
                  </>
                ) : (
                  <div className="auth-required-contact">
                    <div className="auth-contact-content">
                      <div className="auth-icon">🔒</div>
                      <div className="auth-header">
                        <h2>¡Únete a nuestra comunidad!</h2>
                        <p>Para ponerte en contacto con nosotros, únete a la comunidad de eGrow Academy</p>
                      </div>
                      
                      <div className="auth-benefits">
                        <div className="benefit-item">
                          <span className="benefit-icon">💬</span>
                          <span>Acceso al formulario de contacto directo</span>
                        </div>
                        <div className="benefit-item">
                          <span className="benefit-icon">🎓</span>
                          <span>Cursos gratuitos de IA</span>
                        </div>
                        <div className="benefit-item">
                          <span className="benefit-icon">🚀</span>
                          <span>Recursos exclusivos y comunidad</span>
                        </div>
                      </div>
                      
                      <div className="auth-contact-buttons">
                        <a href="/register" className="btn btn-primary">
                          Registrarse Gratis
                        </a>
                        <a href="/login" className="btn btn-primary">
                          Iniciar Sesión
                        </a>
                      </div>
                      
                      <div className="alternative-contact">
                        <p>¿Tienes una consulta urgente?</p>
                        <p>Escríbenos directamente a: <strong>egrowsuite@gmail.com</strong></p>
                      </div>
                    </div>
                  </div>
                )}
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
              <p>Conecta con otros miembros y obtén respuestas rápidas en nuestro foro</p>
              <div className="cta-button-center">
                <a href="/community" className="btn btn-outline">Unirse a la Comunidad</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SimpleLayout>
    
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

        .submit-message {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
        }

        .submit-message.success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .submit-message.error {
          background-color: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        /* Estilos para la sección de autenticación requerida */
        .auth-required-contact {
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.02), rgba(118, 75, 162, 0.02));
          border-radius: 16px;
          border: 2px solid rgba(102, 126, 234, 0.1);
        }

        .auth-contact-content {
          text-align: center;
          max-width: 500px;
          padding: 40px 30px;
        }

        .auth-icon {
          font-size: 64px;
          margin-bottom: 24px;
          opacity: 0.8;
        }

        .auth-header h2 {
          color: #374151;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .auth-header p {
          color: #6b7280;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .auth-benefits {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
          text-align: left;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
        }

        .benefit-icon {
          font-size: 20px;
          width: 28px;
          flex-shrink: 0;
        }

        .benefit-item span:last-child {
          color: #374151;
          font-weight: 500;
        }

        .auth-contact-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .alternative-contact {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .alternative-contact p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .alternative-contact p:first-child {
          margin-bottom: 8px;
          font-weight: 600;
        }

        .alternative-contact strong {
          color: #374151;
        }

        @media (max-width: 768px) {
          .auth-contact-content {
            padding: 24px 20px;
          }

          .auth-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }

          .auth-header h2 {
            font-size: 24px;
          }

          .auth-header p {
            font-size: 15px;
          }

          .auth-contact-buttons {
            flex-direction: column;
            gap: 12px;
          }

          .auth-contact-buttons .btn {
            width: 100%;
          }

          .benefit-item {
            padding: 8px 0;
          }
        }

        @media (max-width: 480px) {
          .auth-required-contact {
            min-height: 500px;
          }

          .auth-header h2 {
            font-size: 22px;
          }

          .benefit-icon {
            font-size: 18px;
            width: 24px;
          }
        }
      `}</style>
    </>
  );
} 