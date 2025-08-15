"use client";

import React, { useState } from 'react';
import UserProfile from '@/components/auth/UserProfile';
import Link from 'next/link';
import Image from 'next/image';
import ClientOnly from '@/components/ClientOnly';
import Sidebar from '@/components/layout/Sidebar';
import { AdvancedSearch } from '@/components/ui/AdvancedSearch';
import { useSearchEngine } from '@/hooks/useSearchEngine';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StreakDisplay from '@/components/streaks/StreakDisplay';
import { 
  IconTrophy, 
  IconSeedling, 
  IconTarget, 
  IconFlame, 
  IconBolt, 
  IconCrown, 
  IconRocket, 
  IconBook, 
  IconMoon 
} from '@tabler/icons-react';

// Componente mini para mostrar el badge de racha en el navbar
const StreakBadgeMini: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [badgeCustomization, setBadgeCustomization] = useState<any>(null);
  const { user } = useAuth();

  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch streak stats
        const streakResponse = await fetch('/api/streaks', {
          credentials: 'include', // Use cookies for authentication
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (streakResponse.ok) {
          const streakData = await streakResponse.json();
          setStats(streakData.data);
        } else if (streakResponse.status === 401) {
          console.warn('⚠️ [NAVBAR] Unauthorized access to streaks');
          setStats(null);
        }

        // Fetch badge customization
        const badgeResponse = await fetch('/api/profile/badge-customization', {
          credentials: 'include', // Use cookies for authentication
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (badgeResponse.ok) {
          const badgeData = await badgeResponse.json();
          setBadgeCustomization(badgeData.badgeCustomization);
          console.log('🎨 [NAVBAR] Badge customization loaded:', badgeData.badgeCustomization);
        } else if (badgeResponse.status === 401) {
          console.warn('⚠️ [NAVBAR] Unauthorized access to badge customization');
          setBadgeCustomization(null);
        }
      } catch (err) {
        console.error('Error fetching navbar data:', err);
      }
    };

    fetchData();
    
    // Listen for badge updates from profile page
    const handleBadgeUpdate = () => {
      console.log('🔄 [NAVBAR] Badge update detected, refreshing...');
      fetchData();
    };

    window.addEventListener('badgeCustomizationUpdated', handleBadgeUpdate);
    
    return () => {
      window.removeEventListener('badgeCustomizationUpdated', handleBadgeUpdate);
    };
  }, [user]);

  const getBadgeDisplay = () => {
    if (!stats) return { emoji: 'trophy', text: '-' };

    const currentBadge = stats.currentBadge;
    const streak = stats.currentStreak;

    // Use custom badge if available
    if (badgeCustomization && currentBadge) {
      const customEmoji = badgeCustomization.preferredEmojis?.[currentBadge.badgeLevel];
      if (customEmoji) {
        return {
          emoji: customEmoji,
          text: badgeCustomization.preferredBadgeStyle === 'text' ? currentBadge.badgeLevel : streak.toString(),
          level: currentBadge.badgeLevel
        };
      }
    }

    // Fall back to streak-based emoji
    const getStreakEmoji = (streak: number): string => {
      if (streak >= 52) return 'rocket';
      if (streak >= 24) return 'crown';
      if (streak >= 12) return 'bolt';
      if (streak >= 8) return 'flame';
      if (streak >= 4) return 'target';
      if (streak >= 2) return 'book';
      if (streak >= 1) return 'seedling';
      return 'moon';
    };

    return {
      emoji: getStreakEmoji(streak),
      text: streak.toString(),
      level: null
    };
  };

  const display = getBadgeDisplay();
  
  const renderIcon = (iconString: string) => {
    switch (iconString) {
      case 'trophy':
        return <IconTrophy size={20} color="#fbbf24" />;
      case 'seedling':
        return <IconSeedling size={20} color="#10b981" />;
      case 'target':
        return <IconTarget size={20} color="#3b82f6" />;
      case 'flame':
        return <IconFlame size={20} color="#ef4444" />;
      case 'bolt':
        return <IconBolt size={20} color="#f59e0b" />;
      case 'crown':
        return <IconCrown size={20} color="#8b5cf6" />;
      case 'rocket':
        return <IconRocket size={20} color="#06b6d4" />;
      case 'book':
        return <IconBook size={20} color="#3b82f6" />;
      case 'moon':
        return <IconMoon size={20} color="#6b7280" />;
      default:
        return <IconTrophy size={20} color="#fbbf24" />;
    }
  };
  
  if (!stats) {
    return (
      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm">
        <span>{renderIcon('trophy')}</span>
        <span className="ml-1 text-xs">-</span>
      </div>
    );
  }

  // Apply custom styling based on user preferences
  const getBackgroundStyle = () => {
    if (badgeCustomization) {
      if (badgeCustomization.preferredBadgeStyle === 'colorful' && badgeCustomization.badgeColor) {
        const color = badgeCustomization.badgeColor;
        return {
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          borderColor: `${color}80`
        };
      }
    }
    return {};
  };

  const customStyle = getBackgroundStyle();

  return (
    <div 
      className="flex items-center px-3 py-1 rounded-full text-sm border transition-all duration-300"
      style={Object.keys(customStyle).length > 0 ? customStyle : {
        background: 'linear-gradient(135deg, rgb(219 234 254), rgb(237 233 254))'
      }}
    >
      {badgeCustomization?.preferredBadgeStyle === 'text' ? (
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          {display.level ? display.level.replace('_', ' ') : display.text}
        </span>
      ) : badgeCustomization?.preferredBadgeStyle === 'colorful' ? (
        <>
          <div 
            className="w-4 h-4 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold"
            style={{ 
              backgroundColor: badgeCustomization.badgeColor || '#3b82f6'
            }}
          >
            {display.text}
          </div>
          <span className="text-xs font-semibold text-gray-700">
            {display.level ? display.level.replace('_', ' ') : 'Racha'}
          </span>
        </>
      ) : (
        <>
          <span className="text-lg">{renderIcon(display.emoji)}</span>
          <span className="ml-1 font-semibold text-gray-700">{display.text}</span>
        </>
      )}
    </div>
  );
};

interface NavbarProps {
  // Prop opcional para compatibilidad con páginas que aún la usen
  onToggleSidebar?: () => void;
  // Prop para ocultar el sidebar (usado en páginas como subscription)
  hideSidebar?: boolean;
}

const NavbarContent: React.FC<NavbarProps> = ({ hideSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, status } = useAuth();

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

  // Función para renderizar el botón dinámico
  const renderActionButton = () => {
    // Usuario no autenticado
    if (!user) {
      return (
        <Link
          href="/subscription"
          className="navbar-subscribe-btn"
        >
          Regístrate
        </Link>
      );
    }

    // Usuarios con planes de pago pueden ver el badge de racha
    if (user.membershipLevel === 'PREMIUM') {
      return (
        <div className="navbar-streak-badge">
          <StreakBadgeMini />
        </div>
      );
    }

    // Usuario con plan gratuito - mostrar suscríbete
    return (
      <Link
        href="/subscription"
        className="navbar-subscribe-btn"
      >
        Suscríbete
      </Link>
    );
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200/80 fixed top-0 z-50 flex items-center justify-between px-4 py-1 md:py-2 shadow-sm h-14 md:h-auto relative">
        {/* Lado izquierdo: Botón de sidebar + Buscador */}
        <div className="flex items-center space-x-4">
          {/* Botón de sidebar - solo mostrar si no está oculto */}
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
          
          {/* Buscador global */}
          <div className="hidden md:block">
            <AdvancedSearch
              onSearch={handleGlobalSearch}
              onSuggestionClick={handleSuggestionClick}
              placeholder="Search"
              className="w-full"
              showFilters={false}
            />
          </div>
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

        {/* Botón dinámico y UserProfile */}
        <div className="flex items-center space-x-1">
          {renderActionButton()}
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
      <nav className="w-full bg-white border-b border-gray-200/80 fixed top-0 z-50 flex items-center justify-between px-4 py-1 md:py-2 shadow-sm h-14 md:h-auto relative">
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