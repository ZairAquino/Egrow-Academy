import React from 'react';
// Íconos removidos temporalmente para evitar errores de build

// Tipos para el sistema de iconos
export type CourseIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  className?: string;
}>;

export interface ToolOption {
  id: string;
  name: string;
  icon: CourseIconComponent;
  category: 'ia' | 'audio' | 'video' | 'design' | 'code' | 'marketing' | 'general';
  description?: string;
}

// Mapeo completo de herramientas con iconos específicos
const PlaceholderIcon: CourseIconComponent = ({ size = 20, className }) => (
  <span className={className} style={{ display: 'inline-block', width: size, height: size }} />
);

export const TOOL_ICONS: Record<string, CourseIconComponent> = {};

// Opciones predefinidas de herramientas para el selector
export const PREDEFINED_TOOLS: ToolOption[] = [
  // IA y Automatización
  { id: 'elevenlabs', name: 'ElevenLabs', icon: PlaceholderIcon, category: 'ia', description: 'Síntesis de voz con IA' },
  { id: 'openai', name: 'OpenAI/ChatGPT', icon: PlaceholderIcon, category: 'ia', description: 'Modelos de lenguaje' },
  { id: 'api', name: 'APIs de IA', icon: PlaceholderIcon, category: 'ia', description: 'Integración de APIs' },
  
  // Audio
  { id: 'audio-editing', name: 'Edición de Audio', icon: PlaceholderIcon, category: 'audio', description: 'Herramientas de edición' },
  { id: 'microphone', name: 'Micrófono', icon: PlaceholderIcon, category: 'audio', description: 'Equipo de grabación' },
  { id: 'podcast', name: 'Podcasting', icon: PlaceholderIcon, category: 'audio', description: 'Producción de podcast' },
  
  // Video
  { id: 'video-editing', name: 'Edición de Video', icon: PlaceholderIcon, category: 'video', description: 'Software de edición' },
  { id: 'youtube', name: 'YouTube', icon: PlaceholderIcon, category: 'video', description: 'Plataforma de video' },
  { id: 'camera', name: 'Cámara', icon: PlaceholderIcon, category: 'video', description: 'Equipo de grabación' },
  
  // Diseño
  { id: 'figma', name: 'Figma', icon: PlaceholderIcon, category: 'design', description: 'Diseño UI/UX' },
  { id: 'photoshop', name: 'Photoshop', icon: PlaceholderIcon, category: 'design', description: 'Edición de imágenes' },
  { id: 'design-thinking', name: 'Design Thinking', icon: PlaceholderIcon, category: 'design', description: 'Metodología de diseño' },
  
  // Programación
  { id: 'react', name: 'React', icon: PlaceholderIcon, category: 'code', description: 'Framework JavaScript' },
  { id: 'python', name: 'Python', icon: PlaceholderIcon, category: 'code', description: 'Lenguaje de programación' },
  { id: 'javascript', name: 'JavaScript', icon: PlaceholderIcon, category: 'code', description: 'Lenguaje web' },
  { id: 'github', name: 'GitHub', icon: PlaceholderIcon, category: 'code', description: 'Control de versiones' },
  
  // Marketing
  { id: 'google-ads', name: 'Google Ads', icon: PlaceholderIcon, category: 'marketing', description: 'Publicidad digital' },
  { id: 'seo', name: 'SEO', icon: PlaceholderIcon, category: 'marketing', description: 'Optimización web' },
  { id: 'analytics', name: 'Analytics', icon: PlaceholderIcon, category: 'marketing', description: 'Análisis de datos' },
  
  // General
  { id: 'laptop', name: 'Laptop/PC', icon: PlaceholderIcon, category: 'general', description: 'Computadora' },
  { id: 'mobile', name: 'Móvil', icon: PlaceholderIcon, category: 'general', description: 'Dispositivo móvil' },
  { id: 'tools', name: 'Herramientas Generales', icon: PlaceholderIcon, category: 'general', description: 'Utilidades varias' }
];

// Iconos para UI del curso
export const UI_ICONS: Record<string, CourseIconComponent> = {};

// Funciones principales

/**
 * Obtiene el icono apropiado para una herramienta
 */
export function getToolIcon(toolName: string): CourseIconComponent {
  return PlaceholderIcon;
}

/**
 * Obtiene el icono para elementos de UI
 */
export function getUiIcon(iconName: string): CourseIconComponent {
  return PlaceholderIcon;
}

/**
 * Renderiza un icono de herramienta
 */
export function renderToolIcon(
  toolName: string,
  className?: string,
  size: number = 20,
  color: string = 'currentColor'
): React.ReactElement {
  const IconComponent = getToolIcon(toolName);
  return <IconComponent className={className} size={size} color={color} />;
}

/**
 * Renderiza un icono de UI
 */
export function renderCourseUiIcon(
  iconName: string,
  className?: string,
  size: number = 18,
  color: string = 'currentColor'
): React.ReactElement {
  const IconComponent = getUiIcon(iconName);
  return <IconComponent className={className} size={size} color={color} />;
}

/**
 * Obtiene herramientas por categoría
 */
export function getToolsByCategory(category: ToolOption['category']): ToolOption[] {
  return PREDEFINED_TOOLS.filter(tool => tool.category === category);
}

/**
 * Busca herramientas por nombre
 */
export function searchTools(query: string): ToolOption[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return PREDEFINED_TOOLS;
  
  return PREDEFINED_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(normalized) ||
    tool.description?.toLowerCase().includes(normalized) ||
    tool.category.includes(normalized)
  );
}