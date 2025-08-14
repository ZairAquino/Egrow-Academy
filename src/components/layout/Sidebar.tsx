'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMenuNavigation } from '@/hooks/useKeyboardNavigation';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  hideToggle?: boolean;
}

export default function Sidebar({ isOpen, onToggle, hideToggle = false }: SidebarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleDropdown = (menuItem: string) => {
    setActiveDropdown(activeDropdown === menuItem ? null : menuItem);
  };

  const handleLinkClick = () => {
    // Cerrar sidebar en móviles al hacer clic en un enlace
    if (isMobile) {
      onToggle();
    }
  };

  // Configuración de navegación por teclado
  const menuItems = [
    { id: 'home', label: 'Inicio', href: '/', icon: '🏠' },
    { id: 'courses', label: 'Cursos', href: '/courses', icon: '📚' },
    // { id: 'ai-news', label: 'AI-News', href: 'https://egrow-theta.vercel.app/ai-news', icon: '🤖', external: true }, // Temporalmente desactivado
    { id: 'community', label: 'Comunidad', href: '/community', icon: '👥' },
    { id: 'resources', label: 'Recursos', href: '/resources', icon: '📖' },
    { id: 'contact', label: 'Contacto', href: '/contacto', icon: '✉️' },
    { id: 'ai-experts', label: 'AI Experts©', href: 'https://egrow.lat/ai-experts', icon: '🏢', external: true }
  ];

  const { selectedIndex, isOpen: menuOpen, setIsOpen: setMenuOpen } = useMenuNavigation(
    menuItems.map(item => item.id),
    (index) => {
      const item = menuItems[index];
      if (item.hasDropdown) {
        toggleDropdown(item.id);
      } else if (item.href !== '#') {
        if (item.external) {
          window.open(item.href, '_blank');
        } else {
          window.location.href = item.href;
        }
        handleLinkClick();
      }
    }
  );

  useEffect(() => {
    setMenuOpen(isOpen);
  }, [isOpen, setMenuOpen]);

  return (
    <>
      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onToggle}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <nav 
        className={`sidebar ${isOpen ? 'open' : ''}`} 
        role="navigation" 
        aria-label="Navegación principal"
        tabIndex={0}
      >
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

          <Link href="/courses" className="menu-link" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">📚</span>
            <span className="menu-text">Cursos</span>
          </Link>

          {/* Temporalmente desactivado - AI News */}
          {/* <a href="https://egrow-theta.vercel.app/ai-news" target="_blank" rel="noopener noreferrer" className="menu-link ai-news-btn" onClick={handleLinkClick}>
            <span className="menu-icon" aria-hidden="true">🤖</span>
            <span className="menu-text">AI-News</span>
          </a> */}

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