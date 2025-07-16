'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  membershipLevel: 'FREE' | 'PREMIUM' | 'BASIC';
  emailVerified: boolean;
  createdAt: string;
  enrollments?: any[];
}

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className = '' }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setUser(null);
        setIsOpen(false);
        window.location.reload();
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

  if (loading) {
    return (
      <div className={`user-profile-container ${className}`}>
        <div className="loading-spinner">⏳</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`user-profile-container ${className}`} ref={dropdownRef}>
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

  return (
    <div className={`user-profile-container ${className}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="profile-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          <span className="avatar-text">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="profile-info">
          <span className="profile-name">{user.name || 'Usuario'}</span>
          <span 
            className="profile-membership"
            style={{ color: getMembershipColor(user.membershipLevel) }}
          >
            {getMembershipLabel(user.membershipLevel)}
          </span>
        </div>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-avatar large">
              <span className="avatar-text">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="profile-details">
              <h3>{user.name || 'Usuario'}</h3>
              <p className="profile-username">@{user.username || 'usuario'}</p>
              <p className="profile-email">{user.email || 'No disponible'}</p>
              <span 
                className="membership-badge"
                style={{ backgroundColor: getMembershipColor(user.membershipLevel) }}
              >
                {getMembershipLabel(user.membershipLevel)}
              </span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Cursos Inscritos</span>
              <span className="stat-value">{user.enrollments?.length || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estado de Email</span>
              <span className={`stat-value ${user.emailVerified ? 'verified' : 'pending'}`}>
                {user.emailVerified ? '✅ Verificado' : '⏳ Pendiente'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Miembro desde</span>
              <span className="stat-value">
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long'
                })}
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
            {user.membershipLevel === 'FREE' && (
              <Link href="/upgrade" className="action-btn upgrade-btn">
                ⭐ Actualizar Plan
              </Link>
            )}
            <button onClick={handleLogout} className="action-btn logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}