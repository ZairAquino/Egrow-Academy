'use client';

import { CourseFormData, ModuleFormData, LessonFormData } from '@/types/course-admin';
import { useState } from 'react';

interface ModulesLessonsProps {
  formData: Partial<CourseFormData>;
  updateModule: (moduleIndex: number, moduleData: Partial<ModuleFormData>) => void;
  updateLesson: (moduleIndex: number, lessonIndex: number, lessonData: Partial<LessonFormData>) => void;
  errors: Record<string, string[]>;
}

export default function ModulesLessons({ formData, updateModule, updateLesson, errors }: ModulesLessonsProps) {
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const addModule = () => {
    const modules = (formData.modules || []).slice();
    modules.push({ title: newModuleTitle || `Módulo ${modules.length + 1}`, description: '', lessons: [] } as any);
    updateModule(modules.length - 1, modules[modules.length - 1]);
    setNewModuleTitle('');
  };

  const addLesson = (mIndex: number) => {
    const lessons = (formData.modules?.[mIndex]?.lessons || []).slice();
    lessons.push({ title: `Lección ${lessons.length + 1}`, description: '', content: '', duration: 10, type: 'video', order: lessons.length + 1, isFree: false } as any);
    updateLesson(mIndex, lessons.length - 1, lessons[lessons.length - 1]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Módulos y Lecciones</h2>
        <p className="mt-1 text-sm text-gray-600">
          Estructura el contenido de tu curso en módulos y lecciones.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Título del módulo"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <button type="button" onClick={addModule} className="px-3 py-2 bg-blue-600 text-white rounded-md">Agregar Módulo</button>
        </div>

        <div className="space-y-4">
          {(formData.modules || []).map((module, mIndex) => (
            <div key={mIndex} className="border rounded-lg p-4">
              <input
                type="text"
                value={module.title}
                onChange={(e) => updateModule(mIndex, { title: e.target.value })}
                placeholder={`Módulo ${mIndex + 1}`}
                className="w-full mb-2 px-3 py-2 border rounded-md border-gray-300"
              />
              <textarea
                value={module.description || ''}
                onChange={(e) => updateModule(mIndex, { description: e.target.value })}
                placeholder="Descripción del módulo"
                rows={2}
                className="w-full mb-3 px-3 py-2 border rounded-md border-gray-300"
              />
              <button type="button" onClick={() => addLesson(mIndex)} className="px-2 py-1 bg-gray-800 text-white rounded-md text-sm">Agregar lección</button>
              <div className="mt-3 space-y-2">
                {(module.lessons || []).map((lesson, lIndex) => (
                  <div key={lIndex} className="grid md:grid-cols-5 gap-2 border p-2 rounded">
                    <input type="text" value={lesson.title} onChange={(e) => updateLesson(mIndex, lIndex, { title: e.target.value })} className="px-2 py-1 border rounded" placeholder={`Lección ${lIndex + 1}`} />
                    <input type="text" value={lesson.videoUrl || ''} onChange={(e) => updateLesson(mIndex, lIndex, { videoUrl: e.target.value })} className="px-2 py-1 border rounded" placeholder="Video URL" />
                    <input type="number" value={lesson.duration || 10} onChange={(e) => updateLesson(mIndex, lIndex, { duration: parseInt(e.target.value) || 0 })} className="px-2 py-1 border rounded" placeholder="Duración (min)" />
                    <input type="text" value={lesson.type || 'video'} onChange={(e) => updateLesson(mIndex, lIndex, { type: e.target.value as any })} className="px-2 py-1 border rounded" placeholder="Tipo" />
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={!!(lesson as any).isFree} onChange={(e) => updateLesson(mIndex, lIndex, { isFree: e.target.checked } as any)} />
                      Gratis
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}