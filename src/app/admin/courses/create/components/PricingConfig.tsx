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

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Precio individual (USD)
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step={1}
            value={formData.price ?? 0}
            onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.price && <span className="text-xs text-red-600 mt-1">{errors.price[0]}</span>}
        </div>

        <div>
          <label htmlFor="durationHours" className="block text-sm font-medium text-gray-700 mb-2">
            Duración estimada (horas)
          </label>
          <input
            id="durationHours"
            type="number"
            min={1}
            step={0.5}
            value={formData.durationHours ?? 1}
            onChange={(e) => updateField('durationHours', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>
        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Precio original (opcional)
          </label>
          <input
            id="originalPrice"
            type="number"
            min={0}
            step={1}
            value={(formData as any).originalPrice ?? ''}
            onChange={(e) => updateField('originalPrice' as any, parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}