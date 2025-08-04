'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Navbar from '@/components/layout/Navbar';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [tokenValid, setTokenValid] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  

  // Verificar token al cargar la página
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Token de restablecimiento no válido');
      return;
    }
    setToken(tokenFromUrl);
    setTokenValid(true);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al restablecer la contraseña');
        return;
      }

      setSuccess(data.message || 'Contraseña restablecida exitosamente');
      
      // Limpiar formulario
      setPassword('');
      setConfirmPassword('');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err) {
      setError('Error de conexión. Verifica tu conexión a internet');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <>
        <Navbar />
        <main className="main-content pt-16">
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
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem 2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
              <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Token Inválido</h1>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                El enlace de restablecimiento no es válido o ha expirado.
              </p>
              <Link href="/forgot-password" style={{
                background: '#667eea',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Solicitar nuevo enlace
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="main-content pt-16">
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
                  🔑 Nueva Contraseña
                </h1>
                <p style={{
                  color: '#718096',
                  fontSize: '1rem',
                  margin: 0
                }}>
                  Ingresa tu nueva contraseña
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="password" style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    🔒 Nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

                <div>
                  <label htmlFor="confirmPassword" style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    🔒 Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
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
                      Restableciendo...
                    </>
                  ) : (
                    <>
                      🔑 Restablecer Contraseña
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}