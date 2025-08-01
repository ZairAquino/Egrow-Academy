'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DynamicLogo from '@/components/ui/DynamicLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useResource } from '@/hooks/useResources';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';

export default function ResourcePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuth();
  
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const slug = params.slug as string;
  const { resource, loading, error, checkAccess } = useResource(slug);

  

  useEffect(() => {
    const verifyAccess = async () => {
      if (resource) {
        const accessResult = await checkAccess();
        setHasAccess(accessResult.hasAccess);
        setAccessChecked(true);
      }
    };

    if (resource && !accessChecked) {
      verifyAccess();
    }
  }, [resource, accessChecked, checkAccess]);

  const handleDownload = () => {
    if (resource?.fileUrl) {
      if (resource.type === 'LINK') {
        window.open(resource.fileUrl, '_blank');
      } else {
        window.open(resource.fileUrl, '_blank');
      }
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login?redirect=' + encodeURIComponent(`/resources/${slug}`));
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      WEBINAR: '🎥',
      MANUAL: '📚',
      TUTORIAL: '🎓',
      PAPER: '📄',
      HERRAMIENTA: '🛠️',
      DATASET: '📊',
      PODCAST: '🎧',
      LIBRO: '📖'
    };
    return icons[category] || '📄';
  };

  if (loading) {
    return (
      <>
        
        <main className="main-content pt-16">
          <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner />
          </div>
        </main>
      </>
    );
  }

  if (error || !resource) {
    return (
      <>
        
        <main className="main-content pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Recurso no encontrado</h1>
              <p className="text-gray-600 mb-6">{error || 'El recurso que buscas no existe.'}</p>
              <button 
                onClick={() => router.push('/resources')}
                className="btn btn-primary"
              >
                Volver a Recursos
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      
      
      <main className="main-content pt-16">
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 0',
          color: 'white'
        }}>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              {/* Category Badge */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span style={{ marginRight: '0.5rem' }}>{getCategoryIcon(resource.category)}</span>
                  {resource.category}
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  {resource.type}
                </div>
              </div>
              
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

                .logo-animation-wrapper {
                  animation: logoFloat 3s ease-in-out infinite;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }

                .logo-animation-wrapper:hover {
                  animation-play-state: paused;
                }

                @media (max-width: 768px) {
                  .hero-bottom-logo-image {
                    max-width: 76px !important;
                    max-height: 57px !important;
                  }
                }

                @media (max-width: 480px) {
                  .hero-bottom-logo-image {
                    max-width: 66px !important;
                    max-height: 48px !important;
                  }
                }
              `}</style>
              
              {/* Main Title */}
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                marginBottom: '2rem',
                lineHeight: '1.1',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}>
                {resource.title}
              </h1>
              
              {/* Description */}
              <p style={{
                fontSize: '1.25rem',
                marginBottom: '2rem',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6',
                opacity: '0.95'
              }}>
                {resource.description}
              </p>
              
              {/* Logo debajo de la descripción - igual que en la página de inicio */}
              <div className="hero-bottom-logo">
                <div className="logo-animation-wrapper">
                  <DynamicLogo width={95} height={95} priority className="hero-bottom-logo-image" />
                </div>
              </div>
              
              
              {/* CTA Button */}
              <div>
                {!isAuthenticated && resource.requiresAuth ? (
                  <button 
                    onClick={handleLoginRedirect}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '0.75rem',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    🔓 Iniciar Sesión para Acceder
                  </button>
                ) : hasAccess || !resource.requiresAuth ? (
                  <button 
                    onClick={handleDownload}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '0.75rem',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    {resource.type === 'LINK' ? '🔗 Abrir Enlace' : '📥 Descargar Recurso'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">

                {/* Description Content */}
                <div style={{
                  background: 'white',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }}>
                        <span style={{ color: 'white', fontSize: '1.5rem' }}>📖</span>
                      </div>
                      <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        Descripción del Recurso
                      </h2>
                    </div>
                    <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '1.125rem' }}>
                      {resource.description}
                    </p>
                    
                    {resource.shortDescription && (
                      <div style={{
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginTop: '1.5rem',
                        border: '1px solid #d1d5db'
                      }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Resumen</h3>
                        <p style={{ color: '#6b7280' }}>{resource.shortDescription}</p>
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div style={{ position: 'sticky', top: '1.5rem' }}>
                  {/* Action Card */}
                  <div style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: '4rem',
                        height: '4rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }}>
                        <span style={{ color: 'white', fontSize: '1.5rem' }}>🚀</span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Acceso al Recurso</h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Obtén acceso inmediato al contenido</p>
                    </div>
                    
                    {/* Botones específicos por recurso */}
                    {slug === 'guia-prompts-chatgpt' && (
                      <button 
                        onClick={() => window.open('https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3WfkxKajlFauwDyGejd5FRObK2AmQgXJHscf1C3', '_blank')}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        📖 Ver Guía
                      </button>
                    )}
                    
                    {slug === 'webinar-asistente-virtual' && (
                      <>
                        {/* Botón Abrir GPT */}
                        <button 
                          onClick={() => window.open('https://chatgpt.com/g/g-687e84aba36c8191a44042cc330db2f1-contexto-empresarial', '_blank')}
                          style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          🤖 Abrir GPT
                        </button>
                        
                        {/* Primer Botón Ver Manual */}
                        <button 
                          onClick={() => window.open('https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3WfKlWlJIDzfaJcA3E27kdtD5jXC6Lu018IpyVe', '_blank')}
                          style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          📚 Ver Manual GPT
                        </button>
                        
                        {/* Segundo Botón Ver Manual */}
                        <button 
                          onClick={() => window.open('https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf6fHDJnsjvKzHarFPOpGctT89wmD4R2huQJ3X', '_blank')}
                          style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          📚 Ver Manual GEM
                        </button>
                      </>
                    )}
                    
                    {slug === 'carrusel-de-imagenes' && (
                      <button 
                        onClick={() => window.open('https://chatgpt.com/g/g-68892296e5508191b7a874e5fc36bbbe-carrusel-de-imagenes', '_blank')}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        🎨 Abrir GPT Carrusel
                      </button>
                    )}
                    
                    {slug === 'gpt-evaluar-mejorar-disenos' && (
                      <button 
                        onClick={() => window.open('https://chatgpt.com/g/g-688d1b0d55708191a4f5f2a273cd23a9-visuo-asesor-de-diseno', '_blank')}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          marginBottom: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        🔍 Abrir GPT Evaluación
                      </button>
                    )}
                  </div>

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