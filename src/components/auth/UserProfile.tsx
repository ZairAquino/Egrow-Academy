'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const { user, status, logout } = useAuth();
  const { stats } = useUserStats();
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detectar cuando el componente se hidrata
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Logs de depuración
  useEffect(() => {
    console.log('UserProfile - Status:', status);
    console.log('UserProfile - User:', user);
  }, [user, status]);

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
      await logout();
      // Redirigir a la página principal después del logout
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
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

  // Función para obtener el nombre completo del usuario
  const getUserFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.username || 'Usuario';
  };

  // Función para obtener la inicial del nombre
  const getUserInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Durante la hidratación inicial, mostrar siempre el estado base
  // Esto asegura que server y client rendericen lo mismo
  if (!isHydrated || status === 'loading') {
    return (
      <div className={`user-profile-container ${className}`} suppressHydrationWarning>
        <div className="profile-trigger">
          <div className="profile-avatar">
            <span className="avatar-text">👤</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>
    );
  }

  // Mostrar estado no autenticado
  if (!user) {
    return (
      <div className={`user-profile-container ${className}`} ref={dropdownRef} suppressHydrationWarning>
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

  // El usuario ya está disponible del contexto

  return (
    <div className={`user-profile-container ${className}`} ref={dropdownRef} suppressHydrationWarning>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="profile-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          {user.profileImage ? (
            <Image 
              src={user.profileImage} 
              alt={getUserFullName()} 
              width={32} 
              height={32}
              className="avatar-image"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <span className="avatar-text">
              {getUserInitial()}
            </span>
          )}
        </div>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-avatar large">
              {user.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={getUserFullName()} 
                  width={48} 
                  height={48}
                  className="avatar-image"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span className="avatar-text">
                  {getUserInitial()}
                </span>
              )}
            </div>
            <div className="profile-details">
              <h3>{getUserFullName()}</h3>
              <p className="profile-email">{user.email || 'No disponible'}</p>
              <span 
                className="membership-badge"
                style={{ backgroundColor: getMembershipColor(user.membershipLevel || 'FREE') }}
              >
                {getMembershipLabel(user.membershipLevel || 'FREE')}
              </span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Cursos Inscritos</span>
              <span className="stat-value">{stats?.totalEnrolled || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cursos Completados</span>
              <span className="stat-value">{stats?.completedCourses || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estado de Email</span>
              <span className="stat-value verified">
                {user.emailVerified ? '✅ Verificado' : '❌ No verificado'}
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
            <button onClick={handleLogout} className="action-btn logout">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}