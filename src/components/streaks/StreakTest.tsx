'use client';

import { useState } from 'react';

export default function StreakTest() {
  const [testResult, setTestResult] = useState<string>('');

  const testStreakAPI = async () => {
    try {
      setTestResult('Probando API de streaks...');
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/streaks', {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ API funciona: ${JSON.stringify(data.data, null, 2)}`);
      } else {
        const errorText = await response.text();
        setTestResult(`❌ Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      setTestResult(`❌ Error de conexión: ${error}`);
    }
  };

  const testLessonCompletion = async () => {
    try {
      setTestResult('Probando completar lección...');
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          courseId: 'asistentes-virtuales-ia',
          currentLesson: 1,
          completedLessons: ['1'],
          lessonNumber: 1,
          lessonTitle: 'Lección de Prueba',
          action: 'complete',
          timeSpent: 60
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Lección completada: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        setTestResult(`❌ Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      setTestResult(`❌ Error de conexión: ${error}`);
    }
  };

  const triggerManualUpdate = () => {
    setTestResult('Disparando actualización manual...');
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('lessonCompleted', {
      detail: { timestamp: Date.now(), manual: true }
    }));
    
    // Actualizar localStorage
    localStorage.setItem('lessonCompleted', Date.now().toString());
    
    // Llamar función global si existe
    if ((window as any).refreshStreaks) {
      (window as any).refreshStreaks();
    }
    
    setTestResult('✅ Eventos disparados manualmente');
  };

  return (
    <div className="streak-test bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">🧪 Pruebas del Sistema de Rachas</h3>
      
      <div className="space-y-2 mb-4">
        <button 
          onClick={testStreakAPI}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
        >
          Probar API Streaks
        </button>
        
        <button 
          onClick={testLessonCompletion}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mr-2"
        >
          Probar Completar Lección
        </button>
        
        <button 
          onClick={triggerManualUpdate}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
        >
          Actualizar Manualmente
        </button>
      </div>
      
      {testResult && (
        <div className="bg-white border rounded p-3">
          <div className="text-sm font-medium text-gray-700 mb-1">Resultado:</div>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
} 