'use client';

import { useState } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';

export default function RegisterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
            maxWidth: '520px',
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
                  color: '#667eea',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  display: 'inline-block'
                }}>
                  🎓 eGrow Academy
                </Link>
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  margin: 0
                }}>
                  ¡Únete a la comunidad!
                </h1>
                <p style={{
                  color: '#718096',
                  fontSize: '1rem',
                  margin: 0
                }}>
                  Comienza tu viaje en inteligencia artificial
                </p>
              </div>

              {/* Form */}
              <RegisterForm />
              
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
                  ¿Ya tienes una cuenta?{' '}
                  <Link href="/login" style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    Inicia sesión
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