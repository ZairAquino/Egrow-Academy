'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al procesar la solicitud');
        return;
      }

      setSuccess(data.message || 'Email enviado exitosamente');
      
      // Limpiar el formulario
      setEmail('');
      
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} hideToggle={true} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            position: 'relative'
          }}>
            {/* Background decorative elements */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              borderRadius: '24px',
              zIndex: 0
            }}></div>
            
            {/* Main container */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem 2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Link href="/" style={{
                  textDecoration: 'none',
                  marginBottom: '1rem',
                  display: 'inline-block'
                }}>
                  <Image 
                    src="/images/eGrowAcademylogo.png" 
                    alt="eGrow Academy" 
                    width={250}
                    height={75}
                    style={{ 
                      marginBottom: '1rem',
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '200px',
                      maxHeight: '60px'
                    }}
                    className="login-logo"
                  />
                </Link>
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  margin: 0
                }}>
                  🔐 ¿Olvidaste tu contraseña?
                </h1>
                <p style={{
                  color: '#718096',
                  fontSize: '1rem',
                  margin: 0
                }}>
                  Te enviaremos un enlace para restablecerla
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="email" style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    📧 Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      backgroundColor: '#f9fafb'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    ❌ {error}
                  </div>
                )}

                {success && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#16a34a',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    ✅ {success}
                  </div>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: '600',
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      📧 Enviar enlace de restablecimiento
                    </>
                  )}
                </button>
              </form>

              {/* Enlaces adicionales */}
              <div style={{
                marginTop: '2rem',
                textAlign: 'center',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.9rem',
                color: '#6b7280'
              }}>
                <p>
                  ¿Recordaste tu contraseña?{' '}
                  <Link href="/login" style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    Iniciar sesión
                  </Link>
                </p>
                <p style={{ marginTop: '0.5rem' }}>
                  ¿No tienes cuenta?{' '}
                  <Link href="/register" style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    Regístrate gratis
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 