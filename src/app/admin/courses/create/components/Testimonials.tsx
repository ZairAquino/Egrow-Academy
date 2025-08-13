'use client';

import { CourseFormData } from '@/types/course-admin';
import { useState } from 'react';

interface TestimonialsProps {
  formData: Partial<CourseFormData>;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string[]>;
}

export default function Testimonials({ formData, updateField, errors }: TestimonialsProps) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [studentTitle, setStudentTitle] = useState('');

  const addTestimonial = () => {
    if (!name.trim() || !text.trim()) return;
    const list = (formData.testimonials || []).slice();
    list.push({ name: name.trim(), text: text.trim(), rating, studentTitle: studentTitle.trim() } as any);
    updateField('testimonials', list);
    setName('');
    setText('');
    setRating(5);
    setStudentTitle('');
  };

  const removeTestimonial = (index: number) => {
    const list = (formData.testimonials || []).slice();
    list.splice(index, 1);
    updateField('testimonials', list);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Testimonios y Reviews</h2>
        <p className="mt-1 text-sm text-gray-600">
          Agrega testimonios y configura las valoraciones del curso.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Nombre del estudiante"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <input
            type="text"
            placeholder="Título/rol del estudiante (opcional)"
            value={studentTitle}
            onChange={(e) => setStudentTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <textarea
            placeholder="Testimonio breve"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Rating:</label>
            <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Math.max(1, Math.min(5, parseInt(e.target.value) || 5)))} className="w-20 px-3 py-2 border rounded" />
          </div>
          <button type="button" onClick={addTestimonial} className="px-3 py-2 bg-blue-600 text-white rounded-md w-max">Agregar testimonio</button>
        </div>

        <ul className="space-y-2">
          {(formData.testimonials || []).map((t, idx) => (
            <li key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
              <div className="flex items-center justify-between">
                <strong className="text-gray-900 text-sm">{t.name}</strong>
                <button className="text-red-600 text-sm" onClick={() => removeTestimonial(idx)}>Quitar</button>
              </div>
              <p className="text-gray-700 text-sm mt-1">{t.text}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                <span>Rating: {t.rating || 5}</span>
                {t.studentTitle && <span>• {t.studentTitle}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}