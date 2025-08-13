import { ModuleFormData, LessonFormData } from '@/types/course-admin';

// Utilidades para duplicar y manipular elementos del curso
export class CourseUtils {
  
  // Duplicar módulo completo
  static duplicateModule(module: ModuleFormData, suffix: string = 'Copia'): ModuleFormData {
    return {
      ...module,
      title: `${module.title} - ${suffix}`,
      lessons: module.lessons.map((lesson, index) => ({
        ...lesson,
        title: `${lesson.title} - ${suffix}`,
        order: index + 1
      }))
    };
  }

  // Duplicar lección individual
  static duplicateLesson(lesson: LessonFormData, suffix: string = 'Copia'): LessonFormData {
    return {
      ...lesson,
      title: `${lesson.title} - ${suffix}`
    };
  }

  // Mover lección entre módulos
  static moveLessonBetweenModules(
    modules: ModuleFormData[],
    fromModuleIndex: number,
    fromLessonIndex: number,
    toModuleIndex: number,
    toPosition?: number
  ): ModuleFormData[] {
    const newModules = [...modules];
    
    // Extraer la lección del módulo origen
    const [movedLesson] = newModules[fromModuleIndex].lessons.splice(fromLessonIndex, 1);
    
    // Reordenar lecciones en módulo origen
    newModules[fromModuleIndex].lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });
    
    // Insertar en módulo destino
    const targetPosition = toPosition ?? newModules[toModuleIndex].lessons.length;
    newModules[toModuleIndex].lessons.splice(targetPosition, 0, movedLesson);
    
    // Reordenar lecciones en módulo destino
    newModules[toModuleIndex].lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });
    
    return newModules;
  }

  // Copiar lección a otro módulo
  static copyLessonToModule(
    modules: ModuleFormData[],
    fromModuleIndex: number,
    fromLessonIndex: number,
    toModuleIndex: number,
    toPosition?: number
  ): ModuleFormData[] {
    const newModules = [...modules];
    
    // Copiar la lección
    const originalLesson = newModules[fromModuleIndex].lessons[fromLessonIndex];
    const copiedLesson = this.duplicateLesson(originalLesson);
    
    // Insertar en módulo destino
    const targetPosition = toPosition ?? newModules[toModuleIndex].lessons.length;
    newModules[toModuleIndex].lessons.splice(targetPosition, 0, copiedLesson);
    
    // Reordenar lecciones en módulo destino
    newModules[toModuleIndex].lessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });
    
    return newModules;
  }

  // Calcular duración total del curso
  static calculateTotalDuration(modules: ModuleFormData[]): number {
    return modules.reduce((total, module) => {
      const moduleDuration = module.lessons.reduce((moduleTotal, lesson) => {
        return moduleTotal + (lesson.duration || 0);
      }, 0);
      return total + moduleDuration;
    }, 0);
  }

  // Calcular duración de un módulo
  static calculateModuleDuration(module: ModuleFormData): number {
    return module.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  }

  // Obtener estadísticas del curso
  static getCourseStats(modules: ModuleFormData[]) {
    const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
    const totalDuration = this.calculateTotalDuration(modules);
    
    const lessonTypes = modules.reduce((types, module) => {
      module.lessons.forEach(lesson => {
        types[lesson.type] = (types[lesson.type] || 0) + 1;
      });
      return types;
    }, {} as Record<string, number>);

    const averageLessonDuration = totalLessons > 0 ? Math.round(totalDuration / totalLessons) : 0;
    
    return {
      totalModules: modules.length,
      totalLessons,
      totalDuration,
      averageLessonDuration,
      lessonTypes,
      estimatedHours: Math.ceil(totalDuration / 60)
    };
  }

  // Validar estructura del curso
  static validateCourseStructure(modules: ModuleFormData[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (modules.length === 0) {
      errors.push('El curso debe tener al menos 1 módulo');
    }
    
    modules.forEach((module, moduleIndex) => {
      if (!module.title.trim()) {
        errors.push(`El módulo ${moduleIndex + 1} necesita un título`);
      }
      
      if (module.lessons.length === 0) {
        errors.push(`El módulo "${module.title}" debe tener al menos 1 lección`);
      }
      
      if (module.lessons.length > 20) {
        warnings.push(`El módulo "${module.title}" tiene muchas lecciones (${module.lessons.length}). Consider dividirlo.`);
      }
      
      module.lessons.forEach((lesson, lessonIndex) => {
        if (!lesson.title.trim()) {
          errors.push(`La lección ${moduleIndex + 1}.${lessonIndex + 1} necesita un título`);
        }
        
        if (!lesson.duration || lesson.duration <= 0) {
          warnings.push(`La lección "${lesson.title}" debería tener una duración estimada`);
        }
        
        if (lesson.duration && lesson.duration > 120) {
          warnings.push(`La lección "${lesson.title}" es muy larga (${lesson.duration} min). Consider dividirla.`);
        }
      });
    });
    
    const stats = this.getCourseStats(modules);
    
    if (stats.totalDuration < 120) { // menos de 2 horas
      warnings.push('El curso es muy corto. Considera agregar más contenido.');
    }
    
    if (stats.totalDuration > 1200) { // más de 20 horas
      warnings.push('El curso es muy largo. Considera dividirlo en múltiples cursos.');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Generar numeración automática
  static autoNumberModules(modules: ModuleFormData[]): ModuleFormData[] {
    return modules.map((module, moduleIndex) => ({
      ...module,
      title: this.updateModuleNumbering(module.title, moduleIndex + 1),
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        title: this.updateLessonNumbering(lesson.title, moduleIndex + 1, lessonIndex + 1),
        order: lessonIndex + 1
      }))
    }));
  }

  private static updateModuleNumbering(title: string, moduleNumber: number): string {
    // Remover numeración existente
    const cleanTitle = title.replace(/^MÓDULO\s+\d+:\s*/i, '').replace(/^M\d+:\s*/i, '');
    return `MÓDULO ${moduleNumber}: ${cleanTitle}`;
  }

  private static updateLessonNumbering(title: string, moduleNumber: number, lessonNumber: number): string {
    // Remover numeración existente
    const cleanTitle = title.replace(/^\d+\.\d+\s*-?\s*/, '');
    return `${moduleNumber}.${lessonNumber} ${cleanTitle}`;
  }

  // Exportar estructura a JSON
  static exportToJSON(modules: ModuleFormData[]): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      stats: this.getCourseStats(modules),
      modules: modules
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Importar estructura desde JSON
  static importFromJSON(jsonString: string): ModuleFormData[] | null {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.modules && Array.isArray(data.modules)) {
        return data.modules;
      }
      
      return null;
    } catch {
      return null;
    }
  }

  // Buscar en contenido del curso
  static searchInCourse(modules: ModuleFormData[], query: string): {
    moduleIndex: number;
    lessonIndex?: number;
    type: 'module' | 'lesson';
    title: string;
    match: string;
  }[] {
    const results: any[] = [];
    const lowercaseQuery = query.toLowerCase();
    
    modules.forEach((module, moduleIndex) => {
      // Buscar en título del módulo
      if (module.title.toLowerCase().includes(lowercaseQuery)) {
        results.push({
          moduleIndex,
          type: 'module',
          title: module.title,
          match: 'título del módulo'
        });
      }
      
      // Buscar en descripción del módulo
      if (module.description?.toLowerCase().includes(lowercaseQuery)) {
        results.push({
          moduleIndex,
          type: 'module',
          title: module.title,
          match: 'descripción del módulo'
        });
      }
      
      // Buscar en lecciones
      module.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.title.toLowerCase().includes(lowercaseQuery)) {
          results.push({
            moduleIndex,
            lessonIndex,
            type: 'lesson',
            title: lesson.title,
            match: 'título de lección'
          });
        }
        
        if (lesson.description?.toLowerCase().includes(lowercaseQuery)) {
          results.push({
            moduleIndex,
            lessonIndex,
            type: 'lesson',
            title: lesson.title,
            match: 'descripción de lección'
          });
        }
        
        if (lesson.content?.toLowerCase().includes(lowercaseQuery)) {
          results.push({
            moduleIndex,
            lessonIndex,
            type: 'lesson',
            title: lesson.title,
            match: 'contenido de lección'
          });
        }
      });
    });
    
    return results;
  }
}