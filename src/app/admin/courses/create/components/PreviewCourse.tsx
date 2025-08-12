'use client';

import { CourseFormData } from '@/types/course-admin';

interface PreviewCourseProps {
  formData: Partial<CourseFormData>;
  onPublish: () => void;
  errors: Record<string, string[]>;
}

export default function PreviewCourse({ formData, onPublish, errors }: PreviewCourseProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Preview y Publicación</h2>
        <p className="mt-1 text-sm text-gray-600">
          Revisa cómo se verá tu curso antes de publicarlo.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">🚧 En desarrollo</h3>
        <p className="text-blue-700">
          Esta sección está siendo implementada. Aquí tendrás:
        </p>
        <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
          <li>Preview en tiempo real 100% idéntico</li>
          <li>Validación final completa</li>
          <li>Checklist de campos obligatorios</li>
          <li>Botón de publicación</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-green-900 mb-2">📋 Estado actual</h3>
        <p className="text-green-700">
          Título: {formData.title || 'No definido'}<br/>
          Slug: {formData.slug || 'No definido'}<br/>
          Precio: ${formData.price || 0}<br/>
          Módulos: {formData.modules?.length || 0}
        </p>
      </div>
    </div>
  );
}