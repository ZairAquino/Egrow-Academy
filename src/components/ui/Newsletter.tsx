'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Webinar } from '@/types/webinar';

export default function Newsletter() {
  const [nextWebinar, setNextWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el próximo webinar más cercano
  const getNextWebinar = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/webinars');
      
      if (!response.ok) {
        throw new Error('Error al cargar webinars');
      }
      
      const data = await response.json();
      const webinars = data.webinars || [];
      
      // Filtrar webinars activos y futuros
      const now = new Date();
      const futureWebinars = webinars
        .filter((webinar: Webinar) => webinar.isActive && new Date(webinar.dateTime) > now)
        .sort((a: Webinar, b: Webinar) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      
      // Obtener el próximo webinar
      if (futureWebinars.length > 0) {
        setNextWebinar(futureWebinars[0]);
      }
    } catch (error) {
      console.error('Error cargando próximo webinar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNextWebinar();
  }, []);

  // Formatear fecha para mostrar
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Mexico_City'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="webinar-promotion-section">
              <h3 className="webinar-title">Cargando próximo webinar...</h3>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          {/* Sección de webinars */}
          <div className="webinar-promotion-section">
            {nextWebinar ? (
              <>
                <h3 className="webinar-title">¡Próximo Webinar!</h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.5rem',
                  textAlign: 'center'
                }}>
                  {(nextWebinar.imageUrl || nextWebinar.title.toLowerCase().includes('aprende a crear videos profesionales con ia')) && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Image
                        src={nextWebinar.title.toLowerCase().includes('aprende a crear videos profesionales con ia') ? "/images/webinarcv.png" : nextWebinar.imageUrl}
                        alt={nextWebinar.title}
                        width={300}
                        height={200}
                        style={{ objectFit: 'cover', borderRadius: '12px' }}
                      />
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: '0'
                    }}>{nextWebinar.title}</h4>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#667eea',
                      margin: '0'
                    }}>{formatDate(nextWebinar.dateTime)}</p>
                    <p style={{
                      fontSize: '1rem',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      maxWidth: '500px',
                      margin: '0'
                    }}>
                      {nextWebinar.shortDescription || nextWebinar.description.substring(0, 100) + '...'}
                    </p>
                    {nextWebinar.hostName && (
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        fontStyle: 'italic',
                        margin: '0'
                      }}>Con {nextWebinar.hostName}</p>
                    )}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '2rem'
                }}>
                  <Link 
                    href={`/webinar/${nextWebinar.slug}`} 
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      fontWeight: '600',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Registrarme Gratis
                  </Link>
                  <Link 
                    href="/webinars" 
                    className="btn btn-secondary"
                    style={{
                      background: 'transparent',
                      color: '#667eea',
                      border: '2px solid #667eea',
                      padding: '0.75rem 2rem',
                      fontWeight: '600',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#667eea';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#667eea';
                    }}
                  >
                    Ver Todos los Webinars
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="webinar-title">¡No te pierdas nuestros Webinars!</h3>
                <p className="webinar-description">
                  Únete a nuestros webinars gratuitos y aprende de expertos en Inteligencia Artificial
                </p>
                <Link href="/webinars" className="btn btn-secondary webinar-btn">
                  Ver Próximos Webinars
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 