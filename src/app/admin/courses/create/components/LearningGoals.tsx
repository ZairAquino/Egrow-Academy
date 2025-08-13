'use client';

import { CourseFormData } from '@/types/course-admin';
import { useState } from 'react';

interface LearningGoalsProps {
  formData: Partial<CourseFormData>;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string[]>;
}

export default function LearningGoals({ formData, updateField, errors }: LearningGoalsProps) {
  const [goalInput, setGoalInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [leadInput, setLeadInput] = useState('');
  const [prereqInput, setPrereqInput] = useState('');

  const addItem = (field: 'whatYouWillLearn' | 'tools' | 'prerequisites', value: string) => {
    if (!value.trim()) return;
    const current = (formData[field] as string[] | undefined) || [];
    updateField(field, [...current, value.trim()]);
  };

  const removeItem = (field: 'whatYouWillLearn' | 'tools' | 'prerequisites', index: number) => {
    const current = (formData[field] as string[] | undefined) || [];
    updateField(field, current.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Objetivos y Contenido</h2>
        <p className="mt-1 text-sm text-gray-600">
          Define qué aprenderán los estudiantes, herramientas necesarias y prerrequisitos.
        </p>
      </div>

      {/* Objetivos de aprendizaje */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Lo que aprenderás</label>
        <input
          type="text"
          value={leadInput}
          onChange={(e) => setLeadInput(e.target.value)}
          onBlur={() => updateField('objectivesLead', leadInput)}
          placeholder="Enfocado en resultados reales: dominio técnico, flujo de trabajo claro y aplicabilidad inmediata."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
        />
        <p className="text-xs text-gray-500">Texto breve que aparece bajo el título de objetivos (igual a la página de referencia).</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('whatYouWillLearn', goalInput); setGoalInput(''); }}}
            placeholder="Ej: Configurar ElevenLabs de principio a fin"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <button type="button" onClick={() => { addItem('whatYouWillLearn', goalInput); setGoalInput(''); }} className="px-3 py-2 bg-blue-600 text-white rounded-md">Agregar</button>
        </div>
        <ul className="space-y-2">
          {(formData.whatYouWillLearn || []).map((item, idx) => (
            <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
              <span className="text-sm text-gray-800">{item}</span>
              <button type="button" onClick={() => removeItem('whatYouWillLearn', idx)} className="text-sm text-red-600">Quitar</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Herramientas */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Herramientas y tecnologías</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={toolInput}
            onChange={(e) => setToolInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('tools', toolInput); setToolInput(''); }}}
            placeholder="Ej: ElevenLabs"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <button type="button" onClick={() => { addItem('tools', toolInput); setToolInput(''); }} className="px-3 py-2 bg-blue-600 text-white rounded-md">Agregar</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.tools || []).map((tool, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 px-2 py-1 text-sm bg-gray-100 border border-gray-200 rounded">
              {tool}
              <button type="button" onClick={() => removeItem('tools', idx)} className="text-red-600">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Prerrequisitos */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Prerrequisitos</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prereqInput}
            onChange={(e) => setPrereqInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('prerequisites', prereqInput); setPrereqInput(''); }}}
            placeholder="Ej: Computadora e internet"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <button type="button" onClick={() => { addItem('prerequisites', prereqInput); setPrereqInput(''); }} className="px-3 py-2 bg-blue-600 text-white rounded-md">Agregar</button>
        </div>
        <ul className="space-y-2">
          {(formData.prerequisites || []).map((item, idx) => (
            <li key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
              <span className="text-sm text-gray-800">{item}</span>
              <button type="button" onClick={() => removeItem('prerequisites', idx)} className="text-sm text-red-600">Quitar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}