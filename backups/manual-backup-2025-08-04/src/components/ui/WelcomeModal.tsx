import { useEffect, useState } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay con backdrop blur */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onClick={onClose}
      />
      
      {/* Modal centrado */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '100%',
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
            opacity: isOpen ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Header con gradiente */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '2rem',
              textAlign: 'center',
              color: 'white',
              position: 'relative'
            }}
          >
            {/* Icono de celebración */}
            <div 
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <span style={{ fontSize: '2rem' }}>🎉</span>
            </div>
            
            <h2 
              style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                margin: '0 0 0.5rem 0',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              ¡Bienvenido a eGrow Academy!
            </h2>
            <p 
              style={{
                fontSize: '1rem',
                opacity: 0.9,
                margin: 0,
                fontWeight: '500'
              }}
            >
              Tu suscripción premium ha sido activada exitosamente
            </p>
          </div>
          
          {/* Contenido */}
          <div style={{ padding: '2rem' }}>
            {/* Beneficios */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  flexShrink: 0
                }}>
                  <span style={{ color: 'white', fontSize: '1.2rem' }}>✓</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 0.25rem 0'
                  }}>
                    Acceso Premium Completo
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    Todos los cursos premium están ahora disponibles para ti
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#f0f9ff',
                borderRadius: '12px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  flexShrink: 0
                }}>
                  <span style={{ color: 'white', fontSize: '1.2rem' }}>📚</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 0.25rem 0'
                  }}>
                    Recursos Exclusivos
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    Acceso a materiales y recursos premium de alta calidad
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                padding: '1rem',
                backgroundColor: '#fdf4ff',
                borderRadius: '12px',
                border: '1px solid #f3e8ff'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  flexShrink: 0
                }}>
                  <span style={{ color: 'white', fontSize: '1.2rem' }}>⭐</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 0.25rem 0'
                  }}>
                    Soporte Prioritario
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    Atención personalizada para miembros premium
                  </p>
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/courses';
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a67d8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(102, 126, 234, 0.3)';
                }}
              >
                🚀 Explorar Cursos Premium
              </button>
              
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 