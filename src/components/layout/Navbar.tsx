import React, { useState } from 'react';
import UserProfile from '@/components/auth/UserProfile';
import Link from 'next/link';
import Image from 'next/image';
import ClientOnly from '@/components/ClientOnly';
import Sidebar from '@/components/layout/Sidebar';
import { AdvancedSearch } from '@/components/ui/AdvancedSearch';
import { useSearchEngine } from '@/hooks/useSearchEngine';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  // Prop opcional para compatibilidad con páginas que aún la usen
  onToggleSidebar?: () => void;
  // Prop para ocultar el sidebar (usado en páginas como subscription)
  hideSidebar?: boolean;
}

const NavbarContent: React.FC<NavbarProps> = ({ hideSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Motor de búsqueda global
  const {
    query,
    setQuery,
    filters,
    results: searchResults,
    isSearching,
    performSearch,
    generateSuggestions
  } = useSearchEngine({
    enableVoiceSearch: true,
    enableSuggestions: true,
    enableFilters: true,
    maxResults: 10
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Manejar búsqueda global
  const handleGlobalSearch = (query: string, searchFilters: any) => {
    // Redirigir a la página de búsqueda con los parámetros
    const searchParams = new URLSearchParams({
      q: query,
      ...searchFilters
    });
    router.push(`/search?${searchParams.toString()}`);
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion, filters);
    // Redirigir a la página de búsqueda
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/80 fixed top-0 z-50 flex items-center justify-between px-4 py-1 md:py-2 shadow-sm h-14 md:h-auto relative">
        {/* Botón de sidebar - solo mostrar si no está oculto */}
        <div className="flex items-center">
          {!hideSidebar && (
            <button
              onClick={toggleSidebar}
              className="navbar-menu-btn"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Logo - Centrado absolutamente */}
        <Link 
          href="/" 
          className="navbar-logo absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center w-auto h-auto"
          style={{
            maxWidth: 'var(--width-693_5, 693.5px)',
          }}
        >
          <Image
            src="/images/eGrowAcademylogo.png"
            alt="eGrow Academy Logo"
            width={71}
            height={46}
            className="w-auto h-9 object-contain"
            priority
          />
        </Link>

        {/* Buscador global */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <AdvancedSearch
            onSearch={handleGlobalSearch}
            onSuggestionClick={handleSuggestionClick}
            placeholder="Buscar en toda la plataforma..."
            className="w-full"
            showFilters={false}
          />
        </div>

        {/* Botón de suscripción y UserProfile */}
        <div className="flex items-center space-x-1">
          <Link
            href="/subscription"
            className="navbar-subscribe-btn"
          >
            Suscríbete
          </Link>
          <UserProfile />
        </div>
      </nav>
    
      {/* Sidebar - solo renderizar si no está oculto */}
      {!hideSidebar && <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
    </>
  );
};

const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <ClientOnly fallback={
      <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200/80 fixed top-0 z-50 flex items-center justify-between px-4 py-1 md:py-2 shadow-sm h-14 md:h-auto relative">
        <div className="flex items-center">
          {!props.hideSidebar && (
            <div className="p-2 rounded-md">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          )}
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-gray-200 rounded-md w-20 h-8"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </nav>
    }>
      <NavbarContent {...props} />
    </ClientOnly>
  );
};

export default Navbar; 