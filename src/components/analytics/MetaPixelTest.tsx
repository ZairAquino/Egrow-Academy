'use client';

import { useEffect, useState } from 'react';
import { trackFacebookPixelEvent } from '@/lib/facebook-pixel';

export default function MetaPixelTest() {
  const [isPixelLoaded, setIsPixelLoaded] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Verificar si el Meta Pixel está cargado
    const checkPixel = () => {
      if (typeof window !== 'undefined' && window.fbq) {
        setIsPixelLoaded(true);
        setTestResults(prev => [...prev, '✅ Meta Pixel cargado correctamente']);
      } else {
        setTestResults(prev => [...prev, '❌ Meta Pixel no está disponible']);
      }
    };

    // Verificar después de un breve delay para asegurar que se cargue
    setTimeout(checkPixel, 1000);
  }, []);

  const testPixelEvent = () => {
    try {
      trackFacebookPixelEvent('CustomEvent', {
        content_name: 'Test Event',
        content_category: 'Test',
        content_type: 'test_event',
        custom_parameters: {
          test_timestamp: new Date().toISOString(),
          test_source: 'MetaPixelTest Component'
        }
      });
      setTestResults(prev => [...prev, '✅ Evento de prueba enviado correctamente']);
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Error al enviar evento: ${error}`]);
    }
  };

  const testPageView = () => {
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
        setTestResults(prev => [...prev, '✅ PageView enviado correctamente']);
      }
    } catch (error) {
      setTestResults(prev => [...prev, `❌ Error en PageView: ${error}`]);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">🔍 Meta Pixel Test</h3>
      
      <div className="mb-3">
        <span className={`text-xs px-2 py-1 rounded ${isPixelLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isPixelLoaded ? 'Pixel Cargado' : 'Pixel No Cargado'}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <button
          onClick={testPixelEvent}
          className="w-full text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Test Custom Event
        </button>
        <button
          onClick={testPageView}
          className="w-full text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Test PageView
        </button>
      </div>

      <div className="max-h-32 overflow-y-auto">
        {testResults.map((result, index) => (
          <div key={index} className="text-xs text-gray-600 mb-1">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
} 