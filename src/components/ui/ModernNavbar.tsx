"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User } from "lucide-react";

interface ModernNavbarProps {
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function ModernNavbar({ onSidebarToggle, isSidebarOpen = false }: ModernNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/cursos-gratuitos", label: "Cursos Gratuitos" },
    { href: "/courses", label: "Todos los Cursos" },
    { href: "/community", label: "Comunidad" },
    { href: "/resources", label: "Recursos" },
    { href: "/contacto", label: "Contacto" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center gap-4">
            {onSidebarToggle && (
              <button
                onClick={onSidebarToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/eGrowAcademylogo.png" 
                alt="eGrow Academy" 
                width={150}
                height={45}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* User Profile */}
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full bg-black hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Menu className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-gray-700 hover:text-gray-900 font-medium border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}