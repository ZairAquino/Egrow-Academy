'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Navbar from '@/components/layout/Navbar';
import CompaniesMarquee from '@/components/ui/CompaniesMarquee';

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
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem'
      }}>
        <LoadingSpinner />
        <p style={{ color: '#374151', fontSize: '1.1rem' }}>Verificando autenticación...</p>
      </div>
    );
  }

  // Si el usuario ya está logueado, no mostrar la página de login
  if (user && status === 'authenticated') {
    return (
      <div style={{
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem'
      }}>
        <LoadingSpinner />
        <p style={{ color: '#374151', fontSize: '1.1rem' }}>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar hideSidebar={true} />
      <main className="main-content pt-16" style={{ 
        padding: '0.5rem 0.5rem 0',
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '0 1rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          maxWidth: '1200px',
          margin: '0 auto',
          flex: '1',
          overflow: 'auto'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
        </div>
        
        {/* Marquesina de empresas */}
        <div style={{ flexShrink: 0 }}>
          <CompaniesMarquee />
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
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem'
      }}>
        <LoadingSpinner />
        <p style={{ color: '#374151', fontSize: '1.1rem' }}>Cargando...</p>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}