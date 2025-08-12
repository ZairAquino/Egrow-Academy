'use client';

import { CourseFormData } from '@/types/course-admin';

interface PricingConfigProps {
  formData: Partial<CourseFormData>;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string[]>;
}

export default function PricingConfig({ formData, updateField, errors }: PricingConfigProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración de Precios</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configura las opciones de precio y planes disponibles.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">🚧 En desarrollo</h3>
        <p className="text-blue-700">
          Esta sección está siendo implementada. Aquí configurarás:
        </p>
        <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
          <li>Precio individual del curso</li>
          <li>Inclusión en e Plus</li>
          <li>Beneficios de cada plan</li>
          <li>Preview del sidebar de precios</li>
        </ul>
      </div>
    </div>
  );
}