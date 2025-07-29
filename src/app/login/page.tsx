'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Componente que maneja la lógica de searchParams
function LoginPageContent() {
  
  const [hasRedirected, setHasRedirected] = useState(false);
  const { user, status } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  

  // Verificar si el usuario ya está logueado
  useEffect(() => {
    console.log('🔍 [DEBUG] LoginPage - Estado de autenticación:', { 
      user: !!user, 
      status, 
      hasRedirected,
      userDetails: user ? { id: user.id, email: user.email } : null 
    });

    if (status === 'loading') {
      console.log('🔍 [DEBUG] LoginPage - Verificando autenticación...');
      return;
    }

    if (user && status === 'authenticated' && !hasRedirected) {
      console.log('✅ [DEBUG] LoginPage - Usuario ya logueado, redirigiendo...');
      setHasRedirected(true);
      
      // Obtener la URL de redirección si existe
      const redirectUrl = searchParams.get('redirect') || '/';
      console.log('🔀 [DEBUG] LoginPage - Redirigiendo a:', redirectUrl);
      
      // Usar setTimeout para asegurar que la redirección se ejecute después del render
      setTimeout(() => {
        router.push(redirectUrl);
      }, 100);
      return;
    }
  }, [user, status, router, searchParams, hasRedirected]);

  // Mostrar loading mientras se verifica la autenticación
  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <LoadingSpinner />
        <p style={{ color: 'white', fontSize: '1.1rem' }}>Verificando autenticación...</p>
      </div>
    );
  }

  // Si el usuario ya está logueado, no mostrar la página de login
  if (user && status === 'authenticated') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <LoadingSpinner />
        <p style={{ color: 'white', fontSize: '1.1rem' }}>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <>
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
                  ¡Bienvenido de nuevo!
                </h1>
                <p style={{
                  color: '#718096',
                  fontSize: '1rem',
                  margin: 0
                }}>
                  Continúa tu viaje de aprendizaje en IA
                </p>
              </div>

              {/* Form */}
              <LoginForm />
              
              {/* Footer links */}
              <div style={{
                marginTop: '2rem',
                textAlign: 'center',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <p style={{
                  color: '#718096',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}>
                  ¿No tienes una cuenta?{' '}
                  <Link href="/register" style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    Regístrate gratis
                  </Link>
                </p>
                
                <Link href="/" style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  ← Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// Componente principal que envuelve en Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <LoadingSpinner />
        <p style={{ color: 'white', fontSize: '1.1rem' }}>Cargando...</p>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}