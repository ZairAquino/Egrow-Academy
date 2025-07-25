'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const { user, status, logout } = useAuth();
  const { stats } = useUserStats();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logs de depuración
  useEffect(() => {
    console.log('UserProfile - Status:', status);
    console.log('UserProfile - User:', user);
  }, [status, user]);

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
      setIsOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getUserFullName = () => {
    if (!user) return '';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  };

  const getUserInitial = () => {
    if (!user) return '?';
    return (user.firstName || user.email || '?')[0].toUpperCase();
  };

  // Mostrar loading con avatar skeleton
  if (status === 'loading') {
    return (
      <div className={`user-profile-container ${className}`}>
        <div className="profile-trigger">
          <div className="profile-avatar">
            <div className="avatar-skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar avatar con dropdown de opciones
  if (status === 'unauthenticated') {
    return (
      <div className={`user-profile-container ${className}`} ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="profile-trigger"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="profile-avatar">
            <span className="avatar-text">?</span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </button>

        {isOpen && (
          <div className="profile-dropdown">
            <div className="profile-header">
              <div className="profile-avatar large">
                <span className="avatar-text">?</span>
              </div>
              <div className="profile-details">
                <h3 className="profile-name">Usuario Invitado</h3>
                <p className="profile-email">Inicia sesión para acceder a tu cuenta</p>
              </div>
            </div>
            
            <div className="profile-menu">
              <Link href="/login" className="menu-item">
                <span className="menu-icon">🔑</span>
                Iniciar Sesión
              </Link>
              <Link href="/register" className="menu-item">
                <span className="menu-icon">📝</span>
                Registrarse
              </Link>
              <div className="profile-stats">
                <span className="stat">
                  <strong>0</strong> cursos completados
                </span>
                <span className="stat">
                  <strong>0h</strong> de aprendizaje
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Usuario autenticado - mostrar dropdown completo
  return (
    <div className={`user-profile-container ${className}`} ref={dropdownRef}>
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
              <h3 className="profile-name">{getUserFullName()}</h3>
              <p className="profile-email">{user.email}</p>
              <div className="profile-stats">
                <span className="stat">
                  <strong>{stats?.completedCourses || 0}</strong> cursos completados
                </span>
                <span className="stat">
                  <strong>{stats?.totalHours || 0}h</strong> de aprendizaje
                </span>
              </div>
            </div>
          </div>
          
          <div className="profile-menu">
            <Link href="/profile" className="menu-item">
              <span className="menu-icon">👤</span>
              Mi Perfil
            </Link>
            <Link href="/my-courses" className="menu-item">
              <span className="menu-icon">📚</span>
              Mis Cursos
            </Link>
            <Link href="/progress" className="menu-item">
              <span className="menu-icon">📊</span>
              Mi Progreso
            </Link>
            <Link href="/settings" className="menu-item">
              <span className="menu-icon">⚙️</span>
              Configuración
            </Link>
            <button onClick={handleLogout} className="menu-item logout">
              <span className="menu-icon">🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}