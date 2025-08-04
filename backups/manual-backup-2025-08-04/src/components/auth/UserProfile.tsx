'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import GlassAvatar from '@/components/ui/GlassAvatar';
import StreakDisplay from '@/components/streaks/StreakDisplay';

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const { user, status, logout } = useAuth();
  const { stats } = useUserStats();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Mostrar loading spinner mientras se verifica la autenticación
  if (status === 'loading') {
    return (
      <div className={`user-profile-container ${className}`} suppressHydrationWarning>
        <div className="loading-spinner">
          ⏳
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
          <GlassAvatar 
            size="medium"
            onClick={() => setIsOpen(!isOpen)}
            isDropdownOpen={isOpen}
            className="transition-all duration-300"
          />
          <span className="dropdown-arrow">▼</span>
        </button>

        <div className={`profile-dropdown ${isOpen ? 'show' : ''}`}>
            <div className="profile-header" style={{ background: 'linear-gradient(135deg, #6b7280, #4b5563)' }}>
              <GlassAvatar 
                size="large"
                className="transition-all duration-300"
              />
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
        <GlassAvatar 
          size="medium"
          profileImage={user.profileImage}
          onClick={() => setIsOpen(!isOpen)}
          isDropdownOpen={isOpen}
          className="transition-all duration-300"
        />
        <span className="dropdown-arrow">▼</span>
      </button>

      <div className={`profile-dropdown ${isOpen ? 'show' : ''}`}>
          <div className="profile-header">
            <GlassAvatar 
              size="large"
              profileImage={user.profileImage}
              className="transition-all duration-300"
            />
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

          {/* Mostrar racha del usuario */}
          <StreakDisplay compact={true} />

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
    </div>
  );
}