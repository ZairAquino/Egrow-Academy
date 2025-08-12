'use client';

import { CourseFormData, ModuleFormData, LessonFormData } from '@/types/course-admin';

interface ModulesLessonsProps {
  formData: Partial<CourseFormData>;
  updateModule: (moduleIndex: number, moduleData: Partial<ModuleFormData>) => void;
  updateLesson: (moduleIndex: number, lessonIndex: number, lessonData: Partial<LessonFormData>) => void;
  errors: Record<string, string[]>;
}

export default function ModulesLessons({ formData, updateModule, updateLesson, errors }: ModulesLessonsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Módulos y Lecciones</h2>
        <p className="mt-1 text-sm text-gray-600">
          Estructura el contenido de tu curso en módulos y lecciones.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">🚧 En desarrollo</h3>
        <p className="text-blue-700">
          Esta sección está siendo implementada. Aquí configurarás:
        </p>
        <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
          <li>Crear/editar/eliminar módulos</li>
          <li>Agregar lecciones a cada módulo</li>
          <li>Editor de contenido enriquecido</li>
          <li>URLs de videos por lección</li>
          <li>Sistema drag & drop para reordenar</li>
        </ul>
      </div>
    </div>
  );
}