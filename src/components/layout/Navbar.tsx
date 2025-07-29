import React, { useState, useEffect } from 'react';
import UserProfile from '@/components/auth/UserProfile';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full bg-white border-b border-gray-200 fixed top-0 z-50 flex items-center justify-between px-4 py-2 transition-all duration-300 ${
      isScrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : 'shadow-sm'
    }`}>
      {/* Botón de sidebar */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Logo centrado */}
      <div className="flex-1 flex justify-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf9BfN8GgLgae8NyBbzTISPo645dK2W0tprVHq"
            alt="eGrow Academy Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Botón de suscripción y UserProfile */}
      <div className="flex items-center space-x-3">
        <Link
          href="/subscription"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Suscríbete
        </Link>
        <UserProfile />
      </div>
    </nav>
  );
};

export default Navbar; 