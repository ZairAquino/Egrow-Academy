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
          <div className="sidebar-logo" style={{ width: '100%', padding: '0 12px' }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: 'inherit',
              width: '100%',
              padding: '8px 0'
            }} onClick={handleLinkClick}>
              <Image 
                src="/images/eGrowAcademylogo.png" 
                alt="Logo" 
                className="logo-image"
                width={150}
                height={45}
                priority
                style={{ flexShrink: 0 }}
              />

            </Link>
          </div>
        </div>

        <div className="sidebar-menu">
          <Link href="/" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">🏠</span>
            <span className="menu-text">Inicio</span>
          </Link>

          <Link href="/cursos-gratuitos" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">📚</span>
            <span className="menu-text">Cursos Gratuitos</span>
          </Link>

          <Link href="/courses" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">🔒</span>
            <span className="menu-text">Todos los Cursos</span>
          </Link>

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