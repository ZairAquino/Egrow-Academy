'use client';

import { useState, useEffect } from 'react';
import { CourseFormData, COURSE_CATEGORIES, DIFFICULTY_LEVELS, LANGUAGES } from '@/types/course-admin';
import FileUpload from '@/components/ui/FileUpload';
import { generateSlugFromTitle } from '@/lib/course-validation';

interface BasicInfoProps {
  formData: Partial<CourseFormData>;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string[]>;
}

export default function BasicInfo({ formData, updateField, errors }: BasicInfoProps) {
  const [slugValidation, setSlugValidation] = useState<{ valid: boolean; message?: string }>({ valid: true });
  const [softWarnings, setSoftWarnings] = useState<Record<string, string>>({});
  const [isValidatingSlug, setIsValidatingSlug] = useState(false);

  // Auto-generar slug cuando cambia el título (bloqueado para edición manual)
  useEffect(() => {
    if (!formData.title) return;
    const generatedSlug = generateSlugFromTitle(formData.title);
    // Solo reasignar si aún no hay slug o si el slug actual es temporal tipo "draft-..."
    if (!formData.slug || formData.slug.startsWith('draft-')) {
      updateField('slug', generatedSlug);
    }
  }, [formData.title, formData.slug, updateField]);

  // Validar slug en tiempo real
  useEffect(() => {
    if (!formData.slug) return;

    const validateSlug = async () => {
      setIsValidatingSlug(true);
      try {
        const response = await fetch('/api/admin/courses/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: 'slug', value: formData.slug })
        });
        
        const result = await response.json();
        setSlugValidation({
          valid: result.valid,
          message: result.valid ? 'Slug disponible' : result.errors?.[0] || 'Slug no disponible'
        });
      } catch (error) {
        setSlugValidation({ valid: false, message: 'Error validando slug' });
      } finally {
        setIsValidatingSlug(false);
      }
    };

    const timeoutId = setTimeout(validateSlug, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.slug]);

  // Avisos suaves (sin bloquear) para campos clave del paso 1
  useEffect(() => {
    const warnings: Record<string, string> = {};
    if (!formData.title || (formData.title?.length || 0) < 5) {
      warnings.title = 'Recomendado: título de 5+ caracteres';
    }
    if (!formData.shortDescription || (formData.shortDescription?.length || 0) < 20) {
      warnings.shortDescription = 'Recomendado: descripción corta de 20+ caracteres';
    }
    if (!formData.description || (formData.description?.length || 0) < 50) {
      warnings.description = 'Recomendado: descripción de 50+ caracteres';
    }
    if (formData.price === undefined || formData.price < 0) {
      warnings.price = 'Recomendado: precio >= 0';
    }
    setSoftWarnings(warnings);
  }, [formData.title, formData.shortDescription, formData.description, formData.price]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Información Básica</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configura los detalles fundamentales de tu curso. Esta información aparecerá en la página principal del curso.
        </p>
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        {/* Título del curso */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título del curso *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ej: Monetiza tu Voz con IA: ElevenLabs"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.title ? 'border-red-300' : 'border-gray-300'}
            `}
            maxLength={100}
          />
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-500">
              {formData.title?.length || 0}/100 caracteres
            </span>
            {errors.title ? (
              <span className="text-xs text-red-600">{errors.title[0]}</span>
            ) : softWarnings.title ? (
              <span className="text-xs text-yellow-600">{softWarnings.title}</span>
            ) : null}
          </div>
        </div>

        {/* Slug del curso */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL del curso (slug) *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              /curso/
            </span>
            <input
              type="text"
              id="slug"
              value={formData.slug || ''}
              readOnly
              placeholder="se genera automáticamente"
              className={`
                flex-1 px-4 py-3 border rounded-r-lg bg-gray-50 text-gray-600 cursor-not-allowed
                ${errors.slug ? 'border-red-300' : slugValidation.valid ? 'border-green-300' : 'border-yellow-300'}
              `}
              aria-readonly
            />
          </div>
          <div className="mt-1 flex justify-between">
            <div className="flex items-center space-x-2">
              {isValidatingSlug ? (
                <div className="flex items-center text-gray-500 text-xs">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-1"></div>
                  Validando...
                </div>
              ) : slugValidation.message ? (
                <span className={`text-xs ${slugValidation.valid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {slugValidation.message}
                </span>
              ) : null}
            </div>
            {errors.slug && (
              <span className="text-xs text-red-600">{errors.slug[0]}</span>
            )}
          </div>
        </div>

        {/* Descripción corta */}
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción corta *
          </label>
          <textarea
            id="shortDescription"
            rows={3}
            value={formData.shortDescription || ''}
            onChange={(e) => updateField('shortDescription', e.target.value)}
            placeholder="Descripción que aparecerá en el hero section del curso..."
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.shortDescription ? 'border-red-300' : 'border-gray-300'}
            `}
            maxLength={200}
          />
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-500">
              {formData.shortDescription?.length || 0}/200 caracteres
            </span>
            {errors.shortDescription ? (
              <span className="text-xs text-red-600">{errors.shortDescription[0]}</span>
            ) : softWarnings.shortDescription ? (
              <span className="text-xs text-yellow-600">{softWarnings.shortDescription}</span>
            ) : null}
          </div>
        </div>

        {/* Descripción completa */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción completa *
          </label>
          <textarea
            id="description"
            rows={6}
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Descripción detallada que aparecerá en la sección principal del curso. Explica qué aprenderán los estudiantes, cómo les ayudará en su carrera profesional, y por qué deberían tomar este curso..."
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${errors.description ? 'border-red-300' : 'border-gray-300'}
            `}
            maxLength={2000}
          />
          <div className="mt-1 flex justify-between">
            <span className="text-xs text-gray-500">
              {formData.description?.length || 0}/2000 caracteres
            </span>
            {errors.description ? (
              <span className="text-xs text-red-600">{errors.description[0]}</span>
            ) : softWarnings.description ? (
              <span className="text-xs text-yellow-600">{softWarnings.description}</span>
            ) : null}
          </div>
        </div>

        {/* Grid de configuración */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="category"
              value={formData.category || 'HABILIDADES_IRREMPLAZABLES'}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {COURSE_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Dificultad */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de dificultad *
            </label>
            <select
              id="difficulty"
              value={formData.difficulty || 'BEGINNER'}
              onChange={(e) => updateField('difficulty', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Precio (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                id="price"
                min="0"
                step="1"
                value={formData.price || ''}
                onChange={(e) => updateField('price', parseInt(e.target.value) || 0)}
                className={`
                  w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.price ? 'border-red-300' : 'border-gray-300'}
                `}
              />
            </div>
            {errors.price ? (
              <span className="text-xs text-red-600 mt-1">{errors.price[0]}</span>
            ) : softWarnings.price ? (
              <span className="text-xs text-yellow-600 mt-1">{softWarnings.price}</span>
            ) : null}
          </div>

          {/* Duración */}
          <div>
            <label htmlFor="durationHours" className="block text-sm font-medium text-gray-700 mb-2">
              Duración estimada (horas) *
            </label>
            <input
              type="number"
              id="durationHours"
              min="1"
              step="0.5"
              value={formData.durationHours || ''}
              onChange={(e) => updateField('durationHours', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Idioma */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Idioma *
            </label>
            <select
              id="language"
              value={formData.language || 'Español'}
              onChange={(e) => updateField('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {LANGUAGES.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          {/* Rating (opcional) */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1–5) opcional
            </label>
            <input
              type="number"
              id="rating"
              min="1"
              max="5"
              step="0.1"
              value={(formData as any).rating ?? ''}
              onChange={(e) => updateField('rating' as any, parseFloat(e.target.value) || 0)}
              placeholder="4.8"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Si lo dejas vacío, se mostrará un valor por defecto.</p>
          </div>

          {/* Estudiantes (opcional) */}
          <div>
            <label htmlFor="studentsCount" className="block text-sm font-medium text-gray-700 mb-2">
              Número de estudiantes (opcional)
            </label>
            <input
              type="number"
              id="studentsCount"
              min="0"
              step="1"
              value={(formData as any).studentsCount ?? ''}
              onChange={(e) => updateField('studentsCount' as any, parseInt(e.target.value) || 0)}
              placeholder="2863"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Si lo dejas vacío, se derivará o se mostrará 0.</p>
          </div>
        </div>

        {/* URLs de medios */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Medios del curso</h3>
          
          {/* Imagen principal */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL de imagen principal
            </label>
            <div className="grid gap-3">
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl || ''}
                onChange={(e) => updateField('imageUrl', e.target.value)}
                placeholder="https://ejemplo.com/imagen-curso.jpg"
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.imageUrl ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              <div>
                <FileUpload
                  endpoint="generalResource"
                  acceptedTypes={["image/*"]}
                  onUploadComplete={(url) => updateField('imageUrl', url)}
                />
              </div>
            </div>
            {errors.imageUrl && (
              <span className="text-xs text-red-600 mt-1">{errors.imageUrl[0]}</span>
            )}
          </div>

          {/* Video principal */}
          <div>
            <label htmlFor="mainVideoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              URL del video preview
            </label>
            <div className="grid gap-3">
              <input
                type="url"
                id="mainVideoUrl"
                value={formData.mainVideoUrl || ''}
                onChange={(e) => updateField('mainVideoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.mainVideoUrl ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              <div>
                <FileUpload
                  endpoint="courseVideo"
                  acceptedTypes={["video/*"]}
                  onUploadComplete={(url) => updateField('mainVideoUrl', url)}
                />
              </div>
            </div>
            {errors.mainVideoUrl && (
              <span className="text-xs text-red-600 mt-1">{errors.mainVideoUrl[0]}</span>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Soporta YouTube, Vimeo y URLs directas de video
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}