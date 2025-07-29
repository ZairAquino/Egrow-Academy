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

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
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
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo de cristal con gradiente */}
      <div className="
        absolute inset-0
        rounded-full
        bg-gradient-to-br from-white/20 to-white/10
        backdrop-blur-md
        border border-white/30
        shadow-lg
        transition-all duration-300
        group-hover:from-white/30 group-hover:to-white/20
        group-hover:border-white/50
        group-hover:shadow-xl
        group-hover:scale-105
      " />

      {/* Efecto de brillo superior */}
      <div className="
        absolute inset-0
        rounded-full
        bg-gradient-to-br from-white/40 via-transparent to-transparent
        opacity-60
        transition-opacity duration-300
        group-hover:opacity-80
      " />

      {/* Contenido del avatar */}
      <div className="
        relative z-10
        w-full h-full
        flex items-center justify-center
        rounded-full
        overflow-hidden
      ">
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
          <span className={`
            ${textSizes[size]}
            font-semibold
            text-gray-700
            transition-all duration-300
            group-hover:text-gray-900
            group-hover:scale-110
          `}>
            {userInitial}
          </span>
        )}
      </div>

      {/* Efecto de borde animado */}
      <div className={`
        absolute inset-0
        rounded-full
        border-2 border-transparent
        bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
        bg-clip-border
        transition-all duration-500
        ${isDropdownOpen ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
        group-hover:opacity-100
      `} />

      {/* Efecto de partículas de brillo */}
      <div className="
        absolute inset-0
        rounded-full
        overflow-hidden
        pointer-events-none
      ">
        <div className="
          absolute top-1 left-1
          w-1 h-1
          bg-white/60
          rounded-full
          animate-pulse
        " />
        <div className="
          absolute top-2 right-2
          w-0.5 h-0.5
          bg-white/40
          rounded-full
          animate-pulse
          animation-delay-200
        " />
      </div>
    </div>
  );
} 