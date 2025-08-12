import { CourseFormData, VALIDATION_RULES } from '@/types/course-admin';

// Función para generar slug desde título
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
}

// Función para validar URLs
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Función para validar URLs de video específicamente
export function isValidVideoUrl(url: string): boolean {
  if (!url) return true; // URL opcional
  
  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      return true;
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      return true;
    }
    
    // URLs directas de video
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
    if (videoExtensions.some(ext => urlObj.pathname.toLowerCase().includes(ext))) {
      return true;
    }
    
    // Otros dominios conocidos
    const validDomains = ['wistia.com', 'vidyard.com', 'loom.com', 'streamable.com'];
    return validDomains.some(domain => urlObj.hostname.includes(domain));
    
  } catch {
    return false;
  }
}

// Función para validar URLs de imagen específicamente
export function isValidImageUrl(url: string): boolean {
  if (!url) return true; // URL opcional
  
  try {
    const urlObj = new URL(url);
    
    // Verificar extensión de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    if (hasImageExtension) return true;
    
    // Verificar servicios de imágenes conocidos
    const imageDomains = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'images.unsplash.com'];
    return imageDomains.some(domain => urlObj.hostname.includes(domain));
    
  } catch {
    return false;
  }
}

// Interfaz para resultado de validación
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  field?: string;
}

// Validación completa de datos del curso
export function validateCourseData(data: Partial<CourseFormData>): ValidationResult {
  const errors: string[] = [];
  
  // Validar título
  if (!data.title || data.title.trim().length < VALIDATION_RULES.title.minLength) {
    errors.push(`El título debe tener al menos ${VALIDATION_RULES.title.minLength} caracteres`);
  }
  if (data.title && data.title.length > VALIDATION_RULES.title.maxLength) {
    errors.push(`El título no puede exceder ${VALIDATION_RULES.title.maxLength} caracteres`);
  }
  
  // Validar slug
  if (!data.slug || data.slug.trim().length < VALIDATION_RULES.slug.minLength) {
    errors.push(`El slug debe tener al menos ${VALIDATION_RULES.slug.minLength} caracteres`);
  }
  if (data.slug && !VALIDATION_RULES.slug.pattern.test(data.slug)) {
    errors.push('El slug solo puede contener letras minúsculas, números y guiones');
  }
  
  // Validar descripción
  if (!data.description || data.description.trim().length < VALIDATION_RULES.description.minLength) {
    errors.push(`La descripción debe tener al menos ${VALIDATION_RULES.description.minLength} caracteres`);
  }
  
  // Validar descripción corta
  if (!data.shortDescription || data.shortDescription.trim().length < VALIDATION_RULES.shortDescription.minLength) {
    errors.push(`La descripción corta debe tener al menos ${VALIDATION_RULES.shortDescription.minLength} caracteres`);
  }
  
  // Validar URLs
  if (data.imageUrl && !isValidImageUrl(data.imageUrl)) {
    errors.push('La URL de la imagen no es válida');
  }
  
  if (data.mainVideoUrl && !isValidVideoUrl(data.mainVideoUrl)) {
    errors.push('La URL del video principal no es válida');
  }
  
  // Validar precio
  if (data.price !== undefined && data.price < 0) {
    errors.push('El precio debe ser mayor o igual a 0');
  }
  
  // Validar duración
  if (data.durationHours !== undefined && data.durationHours <= 0) {
    errors.push('La duración debe ser mayor a 0 horas');
  }
  
  // Validar instructor
  if (data.instructor) {
    if (!data.instructor.name || data.instructor.name.trim().length < 2) {
      errors.push('El nombre del instructor es requerido');
    }
    
    if (!data.instructor.title || data.instructor.title.trim().length < 5) {
      errors.push('El título del instructor es requerido');
    }
    
    if (!data.instructor.bio || data.instructor.bio.trim().length < VALIDATION_RULES.instructorBio.minLength) {
      errors.push(`La biografía del instructor debe tener al menos ${VALIDATION_RULES.instructorBio.minLength} caracteres`);
    }
    
    if (data.instructor.image && !isValidImageUrl(data.instructor.image)) {
      errors.push('La URL de la imagen del instructor no es válida');
    }
  }
  
  // Validar objetivos de aprendizaje
  if (data.whatYouWillLearn) {
    if (data.whatYouWillLearn.length < VALIDATION_RULES.whatYouWillLearn.minItems) {
      errors.push(`Debe incluir al menos ${VALIDATION_RULES.whatYouWillLearn.minItems} objetivos de aprendizaje`);
    }
    if (data.whatYouWillLearn.length > VALIDATION_RULES.whatYouWillLearn.maxItems) {
      errors.push(`No puede tener más de ${VALIDATION_RULES.whatYouWillLearn.maxItems} objetivos de aprendizaje`);
    }
  }
  
  // Validar herramientas
  if (data.tools) {
    if (data.tools.length < VALIDATION_RULES.tools.minItems) {
      errors.push(`Debe incluir al menos ${VALIDATION_RULES.tools.minItems} herramienta`);
    }
  }
  
  // Validar prerrequisitos
  if (data.prerequisites) {
    if (data.prerequisites.length < VALIDATION_RULES.prerequisites.minItems) {
      errors.push(`Debe incluir al menos ${VALIDATION_RULES.prerequisites.minItems} prerrequisito`);
    }
  }
  
  // Validar módulos
  if (data.modules) {
    if (data.modules.length < VALIDATION_RULES.modules.minItems) {
      errors.push(`Debe incluir al menos ${VALIDATION_RULES.modules.minItems} módulo`);
    }
    
    data.modules.forEach((module, moduleIndex) => {
      if (!module.title || module.title.trim().length < 5) {
        errors.push(`El módulo ${moduleIndex + 1} debe tener un título de al menos 5 caracteres`);
      }
      
      if (!module.description || module.description.trim().length < 20) {
        errors.push(`El módulo ${moduleIndex + 1} debe tener una descripción de al menos 20 caracteres`);
      }
      
      if (!module.lessons || module.lessons.length < VALIDATION_RULES.lessonsPerModule.minItems) {
        errors.push(`El módulo ${moduleIndex + 1} debe tener al menos ${VALIDATION_RULES.lessonsPerModule.minItems} lección`);
      }
      
      if (module.lessons) {
        module.lessons.forEach((lesson, lessonIndex) => {
          if (!lesson.title || lesson.title.trim().length < 5) {
            errors.push(`La lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe tener un título de al menos 5 caracteres`);
          }
          
          if (!lesson.content || lesson.content.trim().length < 50) {
            errors.push(`La lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe tener contenido de al menos 50 caracteres`);
          }
          
          if (lesson.videoUrl && !isValidVideoUrl(lesson.videoUrl)) {
            errors.push(`La URL del video de la lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} no es válida`);
          }
          
          if (!lesson.duration || lesson.duration <= 0) {
            errors.push(`La lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe tener una duración mayor a 0 minutos`);
          }
        });
      }
    });
  }
  
  // Validar testimonios
  if (data.testimonials) {
    data.testimonials.forEach((testimonial, index) => {
      if (!testimonial.name || testimonial.name.trim().length < 2) {
        errors.push(`El testimonio ${index + 1} debe tener un nombre`);
      }
      
      if (!testimonial.text || testimonial.text.trim().length < 10) {
        errors.push(`El testimonio ${index + 1} debe tener un texto de al menos 10 caracteres`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validación de un campo específico
export function validateField(field: string, value: any, data?: Partial<CourseFormData>): ValidationResult {
  const errors: string[] = [];
  
  switch (field) {
    case 'title':
      if (!value || value.trim().length < VALIDATION_RULES.title.minLength) {
        errors.push(`El título debe tener al menos ${VALIDATION_RULES.title.minLength} caracteres`);
      }
      if (value && value.length > VALIDATION_RULES.title.maxLength) {
        errors.push(`El título no puede exceder ${VALIDATION_RULES.title.maxLength} caracteres`);
      }
      break;
      
    case 'slug':
      if (!value || value.trim().length < VALIDATION_RULES.slug.minLength) {
        errors.push(`El slug debe tener al menos ${VALIDATION_RULES.slug.minLength} caracteres`);
      }
      if (value && !VALIDATION_RULES.slug.pattern.test(value)) {
        errors.push('El slug solo puede contener letras minúsculas, números y guiones');
      }
      break;
      
    case 'description':
      if (!value || value.trim().length < VALIDATION_RULES.description.minLength) {
        errors.push(`La descripción debe tener al menos ${VALIDATION_RULES.description.minLength} caracteres`);
      }
      break;
      
    case 'shortDescription':
      if (!value || value.trim().length < VALIDATION_RULES.shortDescription.minLength) {
        errors.push(`La descripción corta debe tener al menos ${VALIDATION_RULES.shortDescription.minLength} caracteres`);
      }
      break;
      
    case 'imageUrl':
      if (value && !isValidImageUrl(value)) {
        errors.push('La URL de la imagen no es válida');
      }
      break;
      
    case 'videoUrl':
      if (value && !isValidVideoUrl(value)) {
        errors.push('La URL del video no es válida');
      }
      break;
      
    case 'price':
      if (value !== undefined && value < 0) {
        errors.push('El precio debe ser mayor o igual a 0');
      }
      break;
      
    default:
      errors.push(`Campo de validación no soportado: ${field}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    field
  };
}

// Función para calcular el progreso de completitud del formulario
export function calculateFormCompleteness(data: Partial<CourseFormData>): number {
  const requiredFields = [
    data.title,
    data.slug,
    data.description,
    data.shortDescription,
    data.instructor?.name,
    data.instructor?.title,
    data.instructor?.bio,
    data.whatYouWillLearn?.length && data.whatYouWillLearn.length >= 6,
    data.tools?.length && data.tools.length >= 1,
    data.prerequisites?.length && data.prerequisites.length >= 1,
    data.modules?.length && data.modules.length >= 1,
    data.price !== undefined,
    data.category,
    data.difficulty
  ];
  
  const completedFields = requiredFields.filter(Boolean).length;
  return Math.round((completedFields / requiredFields.length) * 100);
}