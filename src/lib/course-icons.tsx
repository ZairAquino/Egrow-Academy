import React from 'react';
import {
  IconMicrophone,
  IconRobot,
  IconVideo,
  IconCode,
  IconBrand4chan,
  IconBrandYoutube,
  IconBrandGoogle,
  IconBrandOpenai,
  IconBrandFigma,
  IconBrandPhotoshop,
  IconBrandSketch,
  IconMusic,
  IconHeadphones,
  IconWaveSquare,
  IconMicrophoneOff,
  IconPlayerPlay,
  IconSettings,
  IconCloudComputing,
  IconApi,
  IconDatabase,
  IconBrandReact,
  IconBrandVue,
  IconBrandAngular,
  IconBrandPython,
  IconBrandJavascript,
  IconBrandTypescript,
  IconBrandDocker,
  IconBrandGithub,
  IconTools,
  IconPencil,
  IconBulb,
  IconTarget,
  IconChartPie,
  IconPalette,
  IconCamera,
  IconMail,
  IconWorld,
  IconDeviceMobile,
  IconLaptop,
  IconClock,
  IconStar,
  IconUsers,
  IconAward,
  IconTrendingUp,
  IconBookOpen,
  IconGraduationCap
} from '@tabler/icons-react';

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
export const TOOL_ICONS: Record<string, CourseIconComponent> = {
  // IA y Automatización
  'elevenlabs': IconMicrophone,
  'openai': IconBrandOpenai,
  'chatgpt': IconBrandOpenai,
  'gpt': IconBrandOpenai,
  'inteligencia artificial': IconRobot,
  'ia': IconRobot,
  'ai': IconRobot,
  'machine learning': IconRobot,
  'api': IconApi,
  
  // Audio
  'audio': IconHeadphones,
  'sonido': IconHeadphones,
  'microfono': IconMicrophone,
  'micrófono': IconMicrophone,
  'podcast': IconMicrophone,
  'voz': IconMicrophone,
  'voice': IconMicrophone,
  'text to speech': IconWaveSquare,
  'tts': IconWaveSquare,
  'edicion audio': IconMusic,
  'edición audio': IconMusic,
  'musica': IconMusic,
  'música': IconMusic,
  
  // Video
  'video': IconVideo,
  'youtube': IconBrandYoutube,
  'vimeo': IconVideo,
  'edicion video': IconVideo,
  'edición video': IconVideo,
  'streaming': IconPlayerPlay,
  'camara': IconCamera,
  'cámara': IconCamera,
  
  // Diseño
  'figma': IconBrandFigma,
  'photoshop': IconBrandPhotoshop,
  'sketch': IconBrandSketch,
  'diseño': IconPalette,
  'design': IconPalette,
  'ui': IconPalette,
  'ux': IconPencil,
  'prototipado': IconBrandFigma,
  
  // Programación
  'react': IconBrandReact,
  'vue': IconBrandVue,
  'angular': IconBrandAngular,
  'python': IconBrandPython,
  'javascript': IconBrandJavascript,
  'typescript': IconBrandTypescript,
  'docker': IconBrandDocker,
  'github': IconBrandGithub,
  'git': IconBrandGithub,
  'codigo': IconCode,
  'código': IconCode,
  'programacion': IconCode,
  'programación': IconCode,
  'desarrollo': IconCode,
  'backend': IconDatabase,
  'frontend': IconLaptop,
  'fullstack': IconSettings,
  
  // Marketing
  'google ads': IconBrandGoogle,
  'google': IconBrandGoogle,
  'seo': IconTrendingUp,
  'marketing': IconTarget,
  'analytics': IconChartPie,
  'email': IconMail,
  'web': IconWorld,
  'social media': IconWorld,
  'redes sociales': IconWorld,
  
  // General
  'herramientas': IconTools,
  'tools': IconTools,
  'configuracion': IconSettings,
  'configuración': IconSettings,
  'mobile': IconDeviceMobile,
  'movil': IconDeviceMobile,
  'móvil': IconDeviceMobile,
  'laptop': IconLaptop,
  'computadora': IconLaptop,
  'ordenador': IconLaptop
};

// Opciones predefinidas de herramientas para el selector
export const PREDEFINED_TOOLS: ToolOption[] = [
  // IA y Automatización
  { id: 'elevenlabs', name: 'ElevenLabs', icon: IconMicrophone, category: 'ia', description: 'Síntesis de voz con IA' },
  { id: 'openai', name: 'OpenAI/ChatGPT', icon: IconBrandOpenai, category: 'ia', description: 'Modelos de lenguaje' },
  { id: 'api', name: 'APIs de IA', icon: IconApi, category: 'ia', description: 'Integración de APIs' },
  
  // Audio
  { id: 'audio-editing', name: 'Edición de Audio', icon: IconMusic, category: 'audio', description: 'Herramientas de edición' },
  { id: 'microphone', name: 'Micrófono', icon: IconMicrophone, category: 'audio', description: 'Equipo de grabación' },
  { id: 'podcast', name: 'Podcasting', icon: IconHeadphones, category: 'audio', description: 'Producción de podcast' },
  
  // Video
  { id: 'video-editing', name: 'Edición de Video', icon: IconVideo, category: 'video', description: 'Software de edición' },
  { id: 'youtube', name: 'YouTube', icon: IconBrandYoutube, category: 'video', description: 'Plataforma de video' },
  { id: 'camera', name: 'Cámara', icon: IconCamera, category: 'video', description: 'Equipo de grabación' },
  
  // Diseño
  { id: 'figma', name: 'Figma', icon: IconBrandFigma, category: 'design', description: 'Diseño UI/UX' },
  { id: 'photoshop', name: 'Photoshop', icon: IconBrandPhotoshop, category: 'design', description: 'Edición de imágenes' },
  { id: 'design-thinking', name: 'Design Thinking', icon: IconBulb, category: 'design', description: 'Metodología de diseño' },
  
  // Programación
  { id: 'react', name: 'React', icon: IconBrandReact, category: 'code', description: 'Framework JavaScript' },
  { id: 'python', name: 'Python', icon: IconBrandPython, category: 'code', description: 'Lenguaje de programación' },
  { id: 'javascript', name: 'JavaScript', icon: IconBrandJavascript, category: 'code', description: 'Lenguaje web' },
  { id: 'github', name: 'GitHub', icon: IconBrandGithub, category: 'code', description: 'Control de versiones' },
  
  // Marketing
  { id: 'google-ads', name: 'Google Ads', icon: IconBrandGoogle, category: 'marketing', description: 'Publicidad digital' },
  { id: 'seo', name: 'SEO', icon: IconTrendingUp, category: 'marketing', description: 'Optimización web' },
  { id: 'analytics', name: 'Analytics', icon: IconChartPie, category: 'marketing', description: 'Análisis de datos' },
  
  // General
  { id: 'laptop', name: 'Laptop/PC', icon: IconLaptop, category: 'general', description: 'Computadora' },
  { id: 'mobile', name: 'Móvil', icon: IconDeviceMobile, category: 'general', description: 'Dispositivo móvil' },
  { id: 'tools', name: 'Herramientas Generales', icon: IconTools, category: 'general', description: 'Utilidades varias' }
];

// Iconos para UI del curso
export const UI_ICONS: Record<string, CourseIconComponent> = {
  'duracion': IconClock,
  'duración': IconClock,
  'tiempo': IconClock,
  'nivel': IconStar,
  'level': IconStar,
  'dificultad': IconStar,
  'estudiantes': IconUsers,
  'students': IconUsers,
  'usuarios': IconUsers,
  'opiniones': IconTarget,
  'reviews': IconTarget,
  'valoraciones': IconAward,
  'ratings': IconAward,
  'certificado': IconGraduationCap,
  'certificate': IconGraduationCap,
  'lecciones': IconBookOpen,
  'lessons': IconBookOpen,
  'modulos': IconBookOpen,
  'modules': IconBookOpen
};

// Funciones principales

/**
 * Obtiene el icono apropiado para una herramienta
 */
export function getToolIcon(toolName: string): CourseIconComponent {
  const normalized = toolName.toLowerCase().trim();
  
  // Buscar coincidencia exacta primero
  if (TOOL_ICONS[normalized]) {
    return TOOL_ICONS[normalized];
  }
  
  // Buscar coincidencia parcial
  for (const [key, icon] of Object.entries(TOOL_ICONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  
  // Fallback por categoría
  if (normalized.includes('ia') || normalized.includes('ai')) return IconRobot;
  if (normalized.includes('audio') || normalized.includes('sonido')) return IconHeadphones;
  if (normalized.includes('video')) return IconVideo;
  if (normalized.includes('diseño') || normalized.includes('design')) return IconPalette;
  if (normalized.includes('codigo') || normalized.includes('code')) return IconCode;
  if (normalized.includes('marketing')) return IconTarget;
  
  // Fallback general
  return IconTools;
}

/**
 * Obtiene el icono para elementos de UI
 */
export function getUiIcon(iconName: string): CourseIconComponent {
  const normalized = iconName.toLowerCase().trim();
  
  if (UI_ICONS[normalized]) {
    return UI_ICONS[normalized];
  }
  
  // Buscar coincidencia parcial
  for (const [key, icon] of Object.entries(UI_ICONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  
  return IconBookOpen; // Fallback
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