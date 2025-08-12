'use client';

import { CourseFormData } from '@/types/course-admin';

interface InstructorInfoProps {
  formData: Partial<CourseFormData>;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string[]>;
}

export default function InstructorInfo({ formData, updateField, errors }: InstructorInfoProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Información del Instructor</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configura la información del instructor que aparecerá en el curso.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">🚧 En desarrollo</h3>
        <p className="text-blue-700">
          Esta sección está siendo implementada. Aquí configurarás:
        </p>
        <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
          <li>Nombre del instructor</li>
          <li>Título y posición</li>
          <li>Biografía</li>
          <li>Imagen del instructor</li>
          <li>Credenciales y logros</li>
        </ul>
      </div>
    </div>
  );
}