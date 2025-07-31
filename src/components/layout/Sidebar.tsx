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
    { id: 'courses', label: 'Cursos', href: '#', icon: '📚', hasDropdown: true },
    { id: 'ai-news', label: 'AI-News', href: 'https://egrow-theta.vercel.app/ai-news', icon: '🤖', external: true },
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
          {menuItems.map((item, index) => (
            <div key={item.id}>
              {item.hasDropdown ? (
                <div className={`menu-item dropdown-sidebar ${activeDropdown === item.id ? 'active' : ''}`}>
                  <button 
                    onClick={() => toggleDropdown(item.id)}
                    className={`menu-link ${selectedIndex === index ? 'selected' : ''}`}
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-expanded={activeDropdown === item.id}
                    aria-controls={`${item.id}-submenu`}
                    tabIndex={0}
                  >
                    <span className="menu-icon" aria-hidden="true">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                    <span className="dropdown-arrow" aria-hidden="true">▼</span>
                  </button>
                  <div className="submenu" id={`${item.id}-submenu`} role="region" aria-label={`Submenú de ${item.label}`}>
                    <Link href="/cursos-gratuitos" className="submenu-link" onClick={handleLinkClick}>Cursos Gratuitos</Link>
                    <Link href="/courses" className="submenu-link" onClick={handleLinkClick}>Todos los Cursos 🔒</Link>
                  </div>
                </div>
              ) : (
                <Link 
                  href={item.href} 
                  className={`menu-link ${selectedIndex === index ? 'selected' : ''}`} 
                  onClick={handleLinkClick}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  tabIndex={0}
                >
                  <span className="menu-icon" aria-hidden="true">{item.icon}</span>
                  <span className="menu-text">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      <style jsx>{`
        .menu-link.selected {
          background-color: rgba(59, 130, 246, 0.1);
          border-left: 3px solid #3b82f6;
        }

        .menu-link:focus {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }

        .submenu-link:focus {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }
      `}</style>
    </>
  );
} 