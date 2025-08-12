import React from 'react';
import { Home01Icon } from 'hugeicons-react';
import {
  IconUsers,
  IconMessageDots,
  IconThumbUp,
  IconLanguage,
  IconPackage,
  IconShieldCheck,
  IconClock,
  IconStar,
  IconCircleCheck,
} from '@tabler/icons-react';

// Tipado de componente de icono (props comunes)
export type ToolIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  className?: string;
}>;

// Mapeo inicial: por ahora usamos un icono base hasta refinar por plataforma
const DEFAULT_ICON: ToolIconComponent = Home01Icon;

// Normaliza el nombre de herramienta para matching básico por palabras clave
function normalizeName(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ') // espacios simples
    .trim();
}

// Devuelve el componente de icono asociado; por ahora fallback genérico
export function getToolIcon(toolName: string): ToolIconComponent {
  const n = normalizeName(toolName);

  // Placeholder para futuras asociaciones específicas (Docker, React, etc.)
  // if (n.includes('react')) return ReactIcon;
  // if (n.includes('docker')) return DockerIcon;
  // if (n.includes('github')) return GithubIcon;

  return DEFAULT_ICON;
}

// Render helper para uso directo en JSX
export function renderToolIcon(
  toolName: string,
  className?: string,
  size: number = 20,
  color: string = 'currentColor'
): React.ReactElement {
  const IconComponent = getToolIcon(toolName);
  return <IconComponent className={className} size={size} color={color} />;
}

// UI icon helper (por ahora usa un icono genérico hasta mapear cada caso)
export function renderUiIcon(
  iconName: string,
  className?: string,
  size: number = 18,
  color: string = 'currentColor'
): React.ReactElement {
  const n = normalizeName(iconName);
  let IconComp: React.ComponentType<any> = Home01Icon;

  if (n.includes('estudiante') || n.includes('student')) IconComp = IconUsers;
  else if (n.includes('opinion') || n.includes('review') || n.includes('coment')) IconComp = IconMessageDots;
  else if (n.includes('valoracion') || n.includes('positivo') || n.includes('thumb') || n.includes('like')) IconComp = IconThumbUp;
  else if (n.includes('idioma') || n.includes('language') || n.includes('mundo') || n.includes('globe')) IconComp = IconLanguage;
  else if (n.includes('incluye') || n.includes('proyecto') || n.includes('package') || n.includes('paquete')) IconComp = IconPackage;
  else if (n.includes('acceso') || n.includes('lifetime') || n.includes('permanente')) IconComp = IconShieldCheck;
  else if (n.includes('duracion') || n.includes('duración') || n.includes('tiempo') || n.includes('min')) IconComp = IconClock;
  else if (n.includes('nivel') || n.includes('level')) IconComp = IconStar;
  else if (n.includes('check') || n.includes('complet')) IconComp = IconCircleCheck;

  return <IconComp className={className} size={size} color={color} />;
}


