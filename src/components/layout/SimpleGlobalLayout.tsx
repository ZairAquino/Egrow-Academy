'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';

interface SimpleGlobalLayoutProps {
  children: React.ReactNode;
}

export default function SimpleGlobalLayout({ children }: SimpleGlobalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Simple Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200" style={{ zIndex: 1050 }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            
            {/* Logo */}
            <Link href="/">
              <Image 
                src="/images/eGrowAcademylogo.png" 
                alt="eGrow Academy" 
                className="h-8 w-auto cursor-pointer"
                priority
                width={150}
                height={45}
              />
            </Link>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">
              Inicio
            </Link>
            <Link href="/cursos-gratuitos" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">
              Cursos Gratuitos
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">
              Todos los Cursos
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">
              Comunidad
            </Link>
            <Link href="/contacto" className="text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm">
              Contacto
            </Link>
          </nav>
          
          {/* User Profile Placeholder */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with spacing */}
      <div style={{ paddingTop: '80px' }}>
        {children}
      </div>
    </>
  );
}