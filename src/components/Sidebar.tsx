'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  hideToggle?: boolean;
}

export default function Sidebar({ isOpen, onToggle, hideToggle = false }: SidebarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menuItem: string) => {
    setActiveDropdown(activeDropdown === menuItem ? null : menuItem);
  };

  const handleLinkClick = () => {
    // Cerrar sidebar en móviles al hacer clic en un enlace
    if (window.innerWidth <= 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Menu Toggle Button */}
      {!hideToggle && (
        <button 
          onClick={onToggle}
          className={`menu-toggle ${isOpen ? 'active' : ''}`}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <div className="menu-icon" style={{
            fontSize: '40px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            lineHeight: '1'
          }}>
            {isOpen ? '‹' : '›'}
          </div>
        </button>
      )}

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onToggle}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Navegación principal">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }} onClick={handleLinkClick}>
              <Image 
                src="/images/Logo2.png" 
                alt="Logo" 
                className="logo-image"
                width={40}
                height={40}
                priority
              />
              <span className="logo-text">eGrow-academy</span>
            </Link>
          </div>
        </div>

        <div className="sidebar-menu">
          <Link href="/" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">🏠</span>
            <span className="menu-text">Inicio</span>
          </Link>

          <div className={`menu-item dropdown-sidebar ${activeDropdown === 'courses' ? 'active' : ''}`}>
            <button 
              onClick={() => toggleDropdown('courses')}
              className="menu-link"
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-expanded={activeDropdown === 'courses'}
              aria-controls="courses-submenu"
            >
              <span className="menu-icon" aria-hidden="true">📚</span>
              <span className="menu-text">Cursos</span>
              <span className="dropdown-arrow" aria-hidden="true">▼</span>
            </button>
            <div className="submenu" id="courses-submenu" role="region" aria-label="Submenú de cursos">
              <Link href="/cursos-cortos" className="submenu-link" onClick={handleLinkClick}>Cursos Gratuitos</Link>
              <Link href="/courses" className="submenu-link" onClick={handleLinkClick}>Todos los Cursos 🔒</Link>
            </div>
          </div>

          <a href="https://egrow-theta.vercel.app/ai-news" target="_blank" rel="noopener noreferrer" className="menu-link ai-news-btn" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">🤖</span>
            <span className="menu-text">AI-News</span>
          </a>

          <Link href="/community" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">👥</span>
            <span className="menu-text">Comunidad</span>
          </Link>

          <Link href="/resources" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">📖</span>
            <span className="menu-text">Recursos</span>
          </Link>

          <Link href="/contacto" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">✉️</span>
            <span className="menu-text">Contacto</span>
          </Link>

          <a href="https://egrow.lat/ai-experts" target="_blank" rel="noopener noreferrer" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">🏢</span>
            <span className="menu-text">AI Experts©</span>
          </a>
        </div>
      </nav>
    </>
  );
} 