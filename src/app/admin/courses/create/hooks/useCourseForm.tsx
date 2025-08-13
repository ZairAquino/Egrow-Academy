'use client';

import { useState, useCallback } from 'react';
import { CourseFormData, ModuleFormData, LessonFormData, CourseCreationResponse } from '@/types/course-admin';
import { validateCourseData, validateField, calculateFormCompleteness } from '@/lib/course-validation';

// Estado inicial del formulario
const initialFormData: Partial<CourseFormData> = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  imageUrl: '',
  mainVideoUrl: '',
  price: 97,
  category: 'HABILIDADES_IRREMPLAZABLES',
  difficulty: 'BEGINNER',
  durationHours: 8,
  language: 'Español',
  instructor: {
    name: '',
    title: '',
    image: '',
    bio: ''
  },
  whatYouWillLearn: [],
  tools: [],
  prerequisites: [],
  modules: [],
  testimonials: [],
  status: 'DRAFT'
};

export function useCourseForm() {
  const [formData, setFormData] = useState<Partial<CourseFormData>>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Función para actualizar un campo del formulario
  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // Manejar campos anidados (ej: instructor.name)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        newData[parent as keyof CourseFormData] = {
          ...(newData[parent as keyof CourseFormData] as any),
          [child]: value
        };
      } else {
        (newData as any)[field] = value;
      }
      
      return newData;
    });

    // Limpiar errores del campo cuando se actualiza
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Función para actualizar un módulo
  const updateModule = useCallback((moduleIndex: number, moduleData: Partial<ModuleFormData>) => {
    setFormData(prev => {
      const newModules = [...(prev.modules || [])];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        ...moduleData
      };
      return {
        ...prev,
        modules: newModules
      };
    });
  }, []);

  // Función para actualizar una lección
  const updateLesson = useCallback((moduleIndex: number, lessonIndex: number, lessonData: Partial<LessonFormData>) => {
    setFormData(prev => {
      const newModules = [...(prev.modules || [])];
      const newLessons = [...(newModules[moduleIndex]?.lessons || [])];
      newLessons[lessonIndex] = {
        ...newLessons[lessonIndex],
        ...lessonData
      };
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lessons: newLessons
      };
      return {
        ...prev,
        modules: newModules
      };
    });
  }, []);

  // Función para validar un step específico
  const validateStep = useCallback((step: number): boolean => {
    const stepErrors: Record<string, string[]> = {};

    switch (step) {
      case 1: // Información Básica
        if (!formData.title) stepErrors.title = ['El título es requerido'];
        if (!formData.slug) stepErrors.slug = ['El slug es requerido'];
        if (!formData.description || formData.description.length < 50) {
          stepErrors.description = ['La descripción debe tener al menos 50 caracteres'];
        }
        if (!formData.shortDescription || formData.shortDescription.length < 20) {
          stepErrors.shortDescription = ['La descripción corta debe tener al menos 20 caracteres'];
        }
        if (formData.price === undefined || formData.price < 0) {
          stepErrors.price = ['El precio debe ser mayor o igual a 0'];
        }
        break;

      case 2: // Instructor
        if (!formData.instructor?.name) stepErrors['instructor.name'] = ['El nombre del instructor es requerido'];
        if (!formData.instructor?.title) stepErrors['instructor.title'] = ['El título del instructor es requerido'];
        if (!formData.instructor?.bio || formData.instructor.bio.length < 20) {
          stepErrors['instructor.bio'] = ['La biografía debe tener al menos 20 caracteres'];
        }
        break;

      case 3: // Objetivos y Contenido
        if (!formData.whatYouWillLearn || formData.whatYouWillLearn.length < 6) {
          stepErrors.whatYouWillLearn = ['Debe incluir al menos 6 objetivos de aprendizaje'];
        }
        if (!formData.tools || formData.tools.length < 1) {
          stepErrors.tools = ['Debe incluir al menos 1 herramienta'];
        }
        if (!formData.prerequisites || formData.prerequisites.length < 1) {
          stepErrors.prerequisites = ['Debe incluir al menos 1 prerrequisito'];
        }
        break;

      case 4: // Módulos y Lecciones
        if (!formData.modules || formData.modules.length < 1) {
          stepErrors.modules = ['Debe incluir al menos 1 módulo'];
        } else {
          formData.modules.forEach((module, index) => {
            if (!module.title) stepErrors[`module.${index}.title`] = ['El título del módulo es requerido'];
            if (!module.lessons || module.lessons.length < 1) {
              stepErrors[`module.${index}.lessons`] = ['El módulo debe tener al menos 1 lección'];
            }
          });
        }
        break;

      case 5: // Testimonios (opcional, pero si hay deben ser válidos)
        if (formData.testimonials) {
          formData.testimonials.forEach((testimonial, index) => {
            if (testimonial.name && !testimonial.text) {
              stepErrors[`testimonial.${index}.text`] = ['El texto del testimonio es requerido'];
            }
          });
        }
        break;

      case 6: // Precios (ya validado en step 1)
        break;

      case 7: // Preview (validación completa)
        const fullValidation = validateCourseData(formData);
        if (!fullValidation.valid) {
          fullValidation.errors.forEach(error => {
            stepErrors.general = stepErrors.general || [];
            stepErrors.general.push(error);
          });
        }
        break;
    }

    // Solo actualizar errores si han cambiado para evitar re-renders
    const stepKey = `step${step}`;
    const currentStepErrors = Object.fromEntries(
      Object.entries(errors).filter(([key]) => key.startsWith(`${stepKey}.`))
        .map(([key, value]) => [key.replace(`${stepKey}.`, ''), value])
    );
    const hasChanged = JSON.stringify(currentStepErrors) !== JSON.stringify(stepErrors);
    
    if (hasChanged) {
      setErrors(prev => {
        const newErrors = { ...prev };
        // Aplanar los errores del step
        Object.entries(stepErrors).forEach(([key, errorArray]) => {
          newErrors[`${stepKey}.${key}`] = errorArray;
        });
        return newErrors;
      });
    }

    return Object.keys(stepErrors).length === 0;
  }, [formData, errors]);

  // Navegación entre steps
  const nextStep = useCallback(() => {
    if (currentStep < 7 && validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  }, []);

  // Función para guardar como borrador
  const saveAsDraft = useCallback(async () => {
    setIsLoading(true);
    try {
      // Aquí se haría la llamada al endpoint de guardar borrador
      // Por ahora simulamos un guardado en localStorage
      localStorage.setItem('course-draft', JSON.stringify(formData));
      return { success: true };
    } catch (error) {
      console.error('Error guardando borrador:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  // Función para publicar el curso
  const publishCourse = useCallback(async (): Promise<CourseCreationResponse> => {
    setIsLoading(true);
    try {
      // Validar datos completos antes de publicar
      const validation = validateCourseData(formData);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Llamar al endpoint de creación
      const response = await fetch('/api/admin/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          status: 'PUBLISHED'
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Limpiar borrador después de publicar exitosamente
        localStorage.removeItem('course-draft');
        return result;
      } else {
        return {
          success: false,
          error: result.error || 'Error publicando el curso',
          errors: result.errors
        };
      }
    } catch (error) {
      console.error('Error publicando curso:', error);
      return {
        success: false,
        error: 'Error de conexión al publicar el curso'
      };
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    localStorage.removeItem('course-draft');
  }, []);

  // Calcular progreso de completitud
  const completeness = calculateFormCompleteness(formData);

  return {
    formData,
    currentStep,
    isValid: true, // Se validará al hacer click en continuar
    errors,
    isLoading,
    completeness,
    nextStep,
    prevStep,
    goToStep,
    updateField,
    updateModule,
    updateLesson,
    saveAsDraft,
    publishCourse,
    validateStep,
    resetForm
  };
}