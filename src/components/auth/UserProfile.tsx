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
    
    console.log('👤 [USER-PROFILE] User data:', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hasFirstName: !!user.firstName,
      hasLastName: !!user.lastName
    });
    
    // Si tiene firstName y lastName, usarlos
    if (user.firstName && user.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`;
      console.log('👤 [USER-PROFILE] Using full name:', fullName);
      return fullName;
    }
    
    // Si solo tiene firstName
    if (user.firstName) {
      console.log('👤 [USER-PROFILE] Using firstName only:', user.firstName);
      return user.firstName;
    }
    
    // Si solo tiene lastName
    if (user.lastName) {
      console.log('👤 [USER-PROFILE] Using lastName only:', user.lastName);
      return user.lastName;
    }
    
    // Si no tiene nombre, usar email
    console.log('👤 [USER-PROFILE] Using email as name:', user.email);
    return user.email;
  };

  const getUserInitial = () => {
    if (!user) return '?';
    return (user.firstName || user.email || '?')[0].toUpperCase();
  };

  const getMembershipStatus = () => {
    if (!user) return 'Gratuito';
    return user.membershipLevel === 'PREMIUM' ? 'Premium' : 'Gratuito';
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

  // Usuario autenticado - mostrar dropdown con estructura exacta de la imagen
  console.log('👤 [USER-PROFILE] Rendering authenticated user dropdown');
  console.log('👤 [USER-PROFILE] User object:', user);
  
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
              <h3 className="profile-name" style={{color: 'white', fontSize: '18px', fontWeight: '700'}}>
                {getUserFullName()}
              </h3>
              <p className="profile-email">{user.email}</p>
              <div className="premium-badge">
                <span className="premium-text">{getMembershipStatus()}</span>
                {getMembershipStatus() === 'Premium' && <span className="premium-star">⭐</span>}
              </div>
            </div>
          </div>
          
          <div className="profile-stats-section">
            <div className="stat-item">
              <span className="stat-label">CURSOS INSCRITOS</span>
              <span className="stat-value">{stats?.totalEnrolled || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">CURSOS COMPLETADOS</span>
              <span className="stat-value">{stats?.completedCourses || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">HORAS DE APRENDIZAJE</span>
              <span className="stat-value">{stats?.totalHoursLearned || 0}h</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">ESTADO DE EMAIL</span>
              <span className={`stat-value ${user.emailVerified ? 'verified' : 'pending'}`}>
                {user.emailVerified ? '✅ Verificado' : '⏳ Pendiente'}
              </span>
            </div>
          </div>
          
          <div className="profile-menu">
            <Link href="/profile" className="menu-item">
              <span className="menu-icon">👤</span>
              Editar Perfil
            </Link>
            <Link href="/my-courses" className="menu-item">
              <span className="menu-icon">📚</span>
              Mis Cursos
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