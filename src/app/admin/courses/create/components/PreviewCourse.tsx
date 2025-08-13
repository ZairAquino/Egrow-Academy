'use client';

import { useState, useEffect } from 'react';
import { CourseFormData } from '@/types/course-admin';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import CourseTemplateV1 from '@/components/course/templates/CourseTemplateV1';
import type { CourseTemplateV1Data } from '@/types/course-template';

interface PreviewCourseProps {
  formData: Partial<CourseFormData>;
  onPublish: () => void;
  errors: Record<string, string[]>;
}

interface PreviewData {
  success: boolean;
  data?: any;
  error?: string;
}

export default function PreviewCourse({ formData, onPublish, errors }: PreviewCourseProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'validation'>('preview');

  // Cargar preview cuando cambie formData
  useEffect(() => {
    loadPreview();
  }, [formData]);

  const loadPreview = async () => {
    if (!formData.title) return;

    setIsLoading(true);
    try {
      // Construir snapshot local para la plantilla V1
      const totalLessons = formData.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
      const totalDuration = formData.modules?.reduce((total, module) => total + (module.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0), 0) || 0;

      const snapshot: CourseTemplateV1Data = {
        title: formData.title || 'Título del curso',
        shortDescription: formData.shortDescription,
        description: formData.description,
        thumbnail: formData.imageUrl,
        introVideo: (formData as any).mainVideoUrl,
        price: formData.price || 0,
        originalPrice: (formData as any).originalPrice ?? null,
        isFree: (formData.price || 0) === 0,
        rating: (formData as any).rating,
        studentsCount: (formData as any).studentsCount,
        objectivesLead: (formData as any).objectivesLead,
        learningGoals: (formData.learningGoals || formData.whatYouWillLearn || []),
        tools: formData.tools || [],
        prerequisites: formData.prerequisites || [],
        modules: (formData.modules || []).map((m) => ({
          title: m.title || '',
          description: m.description || '',
          lessons: (m.lessons || []).map((l) => ({
            title: l.title || '',
            duration: l.duration,
            isFree: (l as any).isFree,
            videoUrl: l.videoUrl
          }))
        })),
        instructor: {
          name: formData.instructor?.name || '',
          title: formData.instructor?.title,
          image: formData.instructor?.image,
          bio: formData.instructor?.bio
        },
        testimonials: (formData.testimonials || []).map(t => ({
          studentName: t.name || '',
          content: t.text || '',
          rating: t.rating,
          studentTitle: t.studentTitle
        })),
        sidebar: { durationHours: formData.durationHours, includes: [] }
      };

      setPreviewData({ success: true, data: snapshot });
    } catch (error) {
      console.error('Error loading preview:', error);
      setPreviewData({ success: false, error: 'Error al construir preview' });
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular validación
  const validationChecks = [
    { label: 'Información básica', valid: !!formData.title && !!formData.slug },
    { label: 'Descripción', valid: !!formData.description },
    { label: 'Instructor', valid: !!formData.instructor?.name },
    { label: 'Objetivos de aprendizaje', valid: ((formData.learningGoals?.length || formData.whatYouWillLearn?.length) || 0) >= 3 },
    { label: 'Módulos y lecciones', valid: (formData.modules?.length || 0) >= 1 },
    { label: 'Testimonios', valid: (formData.testimonials?.length || 0) >= 1 },
    { label: 'Precio configurado', valid: formData.price !== undefined && formData.price > 0 },
    { label: 'Imágenes', valid: !!formData.imageUrl }
  ];

  const isReadyToPublish = validationChecks.every(check => check.valid);
  const completionPercentage = Math.round((validationChecks.filter(c => c.valid).length / validationChecks.length) * 100);

  // Calcular estadísticas del curso
  const totalLessons = formData.modules?.reduce((total, module) => 
    total + (module.lessons?.length || 0), 0) || 0;
  const totalDuration = formData.modules?.reduce((total, module) => 
    total + (module.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Preview y Publicación</h2>
        <p className="mt-1 text-sm text-gray-600">
          Revisa cómo se verá tu curso antes de publicarlo.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vista Previa
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'validation'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Validación
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'preview' ? (
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : previewData?.success ? (
            <CourseTemplateV1 course={previewData.data as any} onPrimaryAction={() => {}} />
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-semibold">Preview no disponible</h3>
              </div>
              <p className="text-yellow-700">
                Completa al menos la información básica del curso para ver el preview.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Validation Tab */
        <div className="space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Progreso de completado</h3>
              <span className="text-2xl font-bold text-purple-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Lista de validación</h3>
            <div className="space-y-3">
              {validationChecks.map((check, i) => (
                <div key={i} className="flex items-center gap-3">
                  {check.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={check.valid ? 'text-gray-700' : 'text-gray-400'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Publish Button */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Publicar curso</h3>
            {isReadyToPublish ? (
              <div>
                <p className="text-green-600 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Tu curso está listo para ser publicado
                </p>
                <button
                  onClick={onPublish}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Publicar curso ahora
                </button>
              </div>
            ) : (
              <div>
                <p className="text-yellow-600 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Completa todos los campos requeridos antes de publicar
                </p>
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  No disponible para publicar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}