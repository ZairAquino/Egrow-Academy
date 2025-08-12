'use client';

import { CourseFormData } from '@/types/course-admin';

interface LearningGoalsProps {
  formData: Partial<CourseFormData>;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string[]>;
}

export default function LearningGoals({ formData, updateField, errors }: LearningGoalsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Objetivos y Contenido</h2>
        <p className="mt-1 text-sm text-gray-600">
          Define qué aprenderán los estudiantes, herramientas necesarias y prerrequisitos.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">🚧 En desarrollo</h3>
        <p className="text-blue-700">
          Esta sección está siendo implementada. Aquí configurarás:
        </p>
        <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
          <li>Lo que aprenderás (6-12 objetivos)</li>
          <li>Herramientas y tecnologías</li>
          <li>Prerrequisitos del curso</li>
          <li>Sistema drag & drop para reordenar</li>
        </ul>
      </div>
    </div>
  );
}