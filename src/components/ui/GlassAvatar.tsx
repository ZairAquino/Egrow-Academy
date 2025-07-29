'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GlassAvatarProps {
  size?: 'small' | 'medium' | 'large';
  userInitial?: string;
  profileImage?: string;
  onClick?: () => void;
  className?: string;
  isDropdownOpen?: boolean;
}

export default function GlassAvatar({ 
  size = 'medium', 
  userInitial = 'U', 
  profileImage, 
  onClick,
  className = '',
  isDropdownOpen = false
}: GlassAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div
      className={`
        relative
        ${sizeClasses[size]}
        ${className}
        cursor-pointer
        transition-all duration-300 ease-out
        group
        ${isHovered ? 'scale-105' : 'scale-100'}
        ${isDropdownOpen ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo animado con gradiente fuerte y efecto palpitante */}
      <div className="
        absolute inset-0
        rounded-full
        bg-gradient-to-br from-blue-500/80 via-purple-500/70 to-pink-500/80
        backdrop-blur-md
        border-2 border-white/40
        shadow-lg shadow-blue-500/25
        transition-all duration-500
        group-hover:from-blue-600/90 group-hover:via-purple-600/80 group-hover:to-pink-600/90
        group-hover:border-white/60
        group-hover:shadow-xl group-hover:shadow-blue-500/40
        group-hover:scale-105
        animate-pulse
      " />

      {/* Efecto de brillo superior más intenso */}
      <div className="
        absolute inset-0
        rounded-full
        bg-gradient-to-br from-white/70 via-white/30 to-transparent
        opacity-80
        transition-opacity duration-300
        group-hover:opacity-100
      " />

      {/* Contenedor principal de cristal */}
      <div className="
        relative z-10
        w-full h-full
        flex items-center justify-center
        rounded-full
        overflow-hidden
      ">
        
        {/* Contenido del avatar */}
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            width={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
            height={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
            className="
              w-full h-full
              object-cover
              rounded-full
              transition-transform duration-300
              group-hover:scale-110
            "
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {/* Icono SVG de usuario */}
            <svg 
              className={`${iconSizes[size]} text-white drop-shadow-lg transition-all duration-300 group-hover:scale-110`}
              fill="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Efecto de borde animado más intenso */}
      <div className={`
        absolute inset-0
        rounded-full
        border-2 border-transparent
        bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
        bg-clip-border
        transition-all duration-500
        ${isDropdownOpen ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
        group-hover:opacity-100
        animate-spin-slow
      `} />

      {/* Efecto de partículas de brillo más visibles */}
      <div className="
        absolute inset-0
        rounded-full
        overflow-hidden
        pointer-events-none
      ">
        <div className="
          absolute top-1 left-1
          w-1.5 h-1.5
          bg-white/80
          rounded-full
          animate-pulse
        " />
        <div className="
          absolute top-2 right-2
          w-1 h-1
          bg-white/60
          rounded-full
          animate-pulse
          animation-delay-200
        " />
        <div className="
          absolute bottom-1 left-2
          w-0.5 h-0.5
          bg-white/40
          rounded-full
          animate-pulse
          animation-delay-500
        " />
      </div>

      {/* Efecto de resplandor exterior */}
      <div className="
        absolute -inset-1
        rounded-full
        bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
        opacity-0
        transition-opacity duration-300
        group-hover:opacity-30
        blur-sm
        scale-110
      " />
    </div>
  );
} 