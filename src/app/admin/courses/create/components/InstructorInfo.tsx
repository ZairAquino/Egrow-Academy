'use client';

import { CourseFormData } from '@/types/course-admin';
import FileUpload from '@/components/ui/FileUpload';

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

      {/* Formulario */}
      <div className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del instructor
          </label>
          <input
            id="instructorName"
            type="text"
            value={formData.instructor?.name || ''}
            onChange={(e) => updateField('instructor.name', e.target.value)}
            placeholder="Ej: Zair Aquino"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors['instructor.name'] ? 'border-red-300' : 'border-gray-300'}`}
            maxLength={100}
          />
          {errors['instructor.name'] && (
            <span className="text-xs text-red-600 mt-1">{errors['instructor.name'][0]}</span>
          )}
        </div>

        {/* Título/posición */}
        <div>
          <label htmlFor="instructorTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Título y posición
          </label>
          <input
            id="instructorTitle"
            type="text"
            value={formData.instructor?.title || ''}
            onChange={(e) => updateField('instructor.title', e.target.value)}
            placeholder="Ej: CEO de eGrow y especialista en IA"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors['instructor.title'] ? 'border-red-300' : 'border-gray-300'}`}
            maxLength={120}
          />
          {errors['instructor.title'] && (
            <span className="text-xs text-red-600 mt-1">{errors['instructor.title'][0]}</span>
          )}
        </div>

        {/* Biografía */}
        <div>
          <label htmlFor="instructorBio" className="block text-sm font-medium text-gray-700 mb-2">
            Biografía
          </label>
          <textarea
            id="instructorBio"
            rows={5}
            value={formData.instructor?.bio || ''}
            onChange={(e) => updateField('instructor.bio', e.target.value)}
            placeholder="Breve biografía del instructor..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors['instructor.bio'] ? 'border-red-300' : 'border-gray-300'}`}
            maxLength={500}
          />
          {errors['instructor.bio'] && (
            <span className="text-xs text-red-600 mt-1">{errors['instructor.bio'][0]}</span>
          )}
        </div>

        {/* Imagen del instructor: URL + Upload */}
        <div>
          <label htmlFor="instructorImage" className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del instructor
          </label>
          <div className="grid gap-3">
            <input
              id="instructorImage"
              type="url"
              value={formData.instructor?.image || ''}
              onChange={(e) => updateField('instructor.image', e.target.value)}
              placeholder="https://.../instructor.jpg"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
            <FileUpload
              endpoint="generalResource"
              acceptedTypes={["image/*"]}
              onUploadComplete={(url) => updateField('instructor.image', url)}
            />
          </div>
        </div>

        {/* Credenciales y logros (opcional) */}
        <div>
          <label htmlFor="instructorAchievements" className="block text-sm font-medium text-gray-700 mb-2">
            Credenciales y logros (opcional)
          </label>
          <input
            id="instructorAchievements"
            type="text"
            placeholder="Premios, certificaciones, publicaciones..."
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            onChange={(e) => updateField('instructor.achievements', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}