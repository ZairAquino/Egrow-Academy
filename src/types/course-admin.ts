import { CourseCategory, Difficulty, CourseStatus } from '@prisma/client';

// Tipos para el formulario de administración de cursos
export interface CourseFormData {
  // Información Básica
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  mainVideoUrl: string;
  price: number;
  originalPrice?: number | null;
  category: CourseCategory;
  difficulty: Difficulty;
  durationHours: number;
  language: string;
  studentsCount?: number;
  rating?: number;
  objectivesLead?: string;
  
  // Instructor
  instructor: {
    name: string;
    title: string;
    image: string;
    bio: string;
  };
  
  // Objetivos y Contenido
  learningGoals?: string[]; // nuevo alias preferido en UI
  whatYouWillLearn?: string[]; // compat para código existente
  tools: string[];
  prerequisites: string[];
  
  // Módulos y Lecciones  
  modules: ModuleFormData[];
  
  // Reviews/Testimonios
  testimonials: TestimonialData[];
  
  // Configuración
  status: CourseStatus;
}

export interface ModuleFormData {
  title: string;
  description: string;
  lessons: LessonFormData[];
}

export interface LessonFormData {
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // en minutos
  type: 'video' | 'lab' | 'project' | 'reading';
  order: number;
  isFree?: boolean;
}

export interface TestimonialData {
  name: string;
  text: string;
  rating?: number;
  studentTitle?: string;
}

// Tipos para validación
export interface ValidationResponse {
  valid: boolean;
  errors?: string[];
  suggestions?: string[];
  generatedSlug?: string;
}

export interface ValidationRequest {
  field: 'slug' | 'title' | 'videoUrl' | 'imageUrl';
  value: string;
  courseId?: string;
}

// Tipos para preview
export interface PreviewResponse {
  success: boolean;
  preview: PreviewCourseData;
  metadata: {
    generatedAt: string;
    totalDuration: number;
    completionLevel: number;
    warnings: string[];
  };
}

export interface PreviewCourseData {
  // Información básica con fallbacks aplicados
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  mainVideoUrl: string;
  price: number;
  category: string;
  difficulty: string;
  durationHours: number;
  language: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  
  // Instructor
  instructor: {
    name: string;
    title: string;
    image: string;
    bio: string;
  };
  
  // Contenido
  whatYouWillLearn: string[];
  tools: string[];
  prerequisites: string[];
  testimonials: TestimonialData[];
  
  // Estructura de lecciones para el preview
  lessons: PreviewModuleData[];
}

export interface PreviewModuleData {
  id: number;
  title: string;
  description: string;
  duration: number;
  type: string;
  lessonsCount: number;
  lessons: PreviewLessonData[];
}

export interface PreviewLessonData {
  id: string;
  moduleId: number;
  title: string;
  duration: string;
  type: string;
  description: string;
  videoUrl?: string;
  content: string;
}

// Tipos para respuestas de la API
export interface CourseCreationResponse {
  success: boolean;
  course?: {
    id: string;
    title: string;
    slug: string;
    url: string;
    lessonsCount: number;
    status: CourseStatus;
  };
  message?: string;
  error?: string;
  errors?: string[];
}

// Enums para opciones del formulario
export const COURSE_CATEGORIES = [
  'HABILIDADES_IRREMPLAZABLES',
  'IA_PARA_EMPRENDER',
  'DESARROLLO_WEB',
  'MARKETING_DIGITAL',
  'PRODUCTIVIDAD',
  'FINANZAS_PERSONALES',
  'LIDERAZGO',
  'INNOVACION_TECNOLOGICA'
] as const;

export const DIFFICULTY_LEVELS = [
  'BEGINNER',
  'INTERMEDIATE', 
  'ADVANCED'
] as const;

export const COURSE_STATUSES = [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED'
] as const;

export const LESSON_TYPES = [
  'video',
  'lab',
  'project',
  'reading'
] as const;

export const LANGUAGES = [
  'Español',
  'English',
  'Português'
] as const;

// Configuración de validación
export const VALIDATION_RULES = {
  title: {
    minLength: 5,
    maxLength: 100
  },
  slug: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-z0-9-]+$/
  },
  description: {
    minLength: 50,
    maxLength: 2000
  },
  shortDescription: {
    minLength: 20,
    maxLength: 200
  },
  instructorBio: {
    minLength: 20,
    maxLength: 500
  },
  whatYouWillLearn: {
    minItems: 6,
    maxItems: 12
  },
  tools: {
    minItems: 1,
    maxItems: 10
  },
  prerequisites: {
    minItems: 1,
    maxItems: 8
  },
  modules: {
    minItems: 1,
    maxItems: 10
  },
  lessonsPerModule: {
    minItems: 1,
    maxItems: 20
  }
} as const;