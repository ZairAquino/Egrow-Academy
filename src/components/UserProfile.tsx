'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logs de depuración
  useEffect(() => {
    console.log('UserProfile - Status:', status);
    console.log('UserProfile - Session:', session);
    console.log('UserProfile - User:', session?.user);
  }, [session, status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getMembershipColor = (level: string) => {
    switch (level) {
      case 'PREMIUM': return '#ffd700';
      case 'BASIC': return '#c0c0c0';
      default: return '#90EE90';
    }
  };

  const getMembershipLabel = (level: string) => {
    switch (level) {
      case 'PREMIUM': return 'Premium ⭐';
      case 'BASIC': return 'Básico';
      default: return 'Gratuito';
    }
  };

  // Mostrar estado de carga
  if (status === 'loading') {
    return (
      <div className={`user-profile-container ${className}`}>
        <div className="loading-spinner">⏳</div>
        <div style={{ fontSize: '10px', color: '#666' }}>Cargando sesión...</div>
        {/* Indicador de depuración temporal */}
        <div style={{ 
          position: 'absolute', 
          top: '-20px', 
          right: '0', 
          fontSize: '8px', 
          color: '#ff6b6b',
          background: '#fff',
          padding: '2px 4px',
          borderRadius: '4px',
          border: '1px solid #ff6b6b'
        }}>
          DEBUG: {status}
        </div>
      </div>
    );
  }

  // Mostrar estado no autenticado
  if (!session?.user) {
    return (
      <div className={`user-profile-container ${className}`} ref={dropdownRef}>
        {/* Indicador de depuración temporal */}
        <div style={{ 
          position: 'absolute', 
          top: '-20px', 
          right: '0', 
          fontSize: '8px', 
          color: '#ff6b6b',
          background: '#fff',
          padding: '2px 4px',
          borderRadius: '4px',
          border: '1px solid #ff6b6b'
        }}>
          DEBUG: {status} - No session
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="profile-trigger"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="profile-avatar">
            <span className="avatar-text">👤</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </button>

        {isOpen && (
          <div className="profile-dropdown">
            <div className="profile-header" style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
              <div className="profile-avatar large">
                <span className="avatar-text">👤</span>
              </div>
              <div className="profile-details">
                <h3>Bienvenido</h3>
                <p className="profile-email">Accede a tu cuenta</p>
              </div>
            </div>

            <div className="profile-actions">
              <Link href="/login" className="action-btn">
                🔑 Iniciar Sesión
              </Link>
              <Link href="/register" className="action-btn">
                📝 Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  const user = session.user;

  return (
    <div className={`user-profile-container ${className}`} ref={dropdownRef}>
      {/* Indicador de depuración temporal */}
      <div style={{ 
        position: 'absolute', 
        top: '-20px', 
        right: '0', 
        fontSize: '8px', 
        color: '#10b981',
        background: '#fff',
        padding: '2px 4px',
        borderRadius: '4px',
        border: '1px solid #10b981'
      }}>
        DEBUG: {status} - Logged in
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="profile-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={user.name || 'Usuario'} 
              width={32} 
              height={32}
              className="avatar-image"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span className="avatar-text">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="profile-info">
          <span className="profile-name">{user.name || 'Usuario'}</span>
          <span 
            className="profile-membership"
            style={{ color: getMembershipColor('FREE') }}
          >
            {getMembershipLabel('FREE')}
          </span>
        </div>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-avatar large">
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name || 'Usuario'} 
                  width={48} 
                  height={48}
                  className="avatar-image"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span className="avatar-text">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="profile-details">
              <h3>{user.name || 'Usuario'}</h3>
              <p className="profile-email">{user.email || 'No disponible'}</p>
              <span 
                className="membership-badge"
                style={{ backgroundColor: getMembershipColor('FREE') }}
              >
                {getMembershipLabel('FREE')}
              </span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Cursos Inscritos</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estado de Email</span>
              <span className="stat-value verified">
                ✅ Verificado (Google)
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Proveedor</span>
              <span className="stat-value">
                Google
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <Link href="/profile" className="action-btn">
              📝 Editar Perfil
            </Link>
            <Link href="/my-courses" className="action-btn">
              📚 Mis Cursos
            </Link>
            <Link href="/settings" className="action-btn">
              ⚙️ Configuración
            </Link>
            <Link href="/upgrade" className="action-btn upgrade-btn">
              ⭐ Actualizar Plan
            </Link>
            <button onClick={handleLogout} className="action-btn logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}