'use client';

import { useState } from 'react';
import SocialTrackingUrls from '@/components/social/SocialTrackingUrls';

export default function SocialTrackingPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'linkedin'>('instagram');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tracking de Redes Sociales
          </h1>
          <p className="text-gray-600">
            Gestiona las URLs de tracking para medir el tráfico desde redes sociales
          </p>
        </div>

        {/* Selector de plataforma */}
        <div className="mb-8">
          <div className="flex space-x-4">
            {(['instagram', 'tiktok', 'linkedin'] as const).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* URLs de tracking */}
        <SocialTrackingUrls platform={selectedPlatform} />

        {/* Estadísticas de tracking */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas de Tracking
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Visitas desde {selectedPlatform}</h4>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-blue-700">Últimos 30 días</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Conversiones</h4>
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-green-700">Desde {selectedPlatform}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Tasa de conversión</h4>
              <p className="text-2xl font-bold text-purple-600">0%</p>
              <p className="text-sm text-purple-700">Visitas → Conversiones</p>
            </div>
          </div>
        </div>

        {/* Instrucciones de uso */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cómo usar las URLs de tracking
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Copia la URL</h4>
              <p>Selecciona la campaña que quieres trackear y copia la URL correspondiente.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Úsala en tus posts</h4>
              <p>Pega la URL en la bio de tu perfil o en los posts de {selectedPlatform}.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Monitorea en Analytics</h4>
              <p>Ve a Google Analytics → Adquisición → Canales para ver el tráfico.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Personaliza si es necesario</h4>
              <p>Puedes agregar parámetros adicionales como utm_content para tracking más específico.</p>
            </div>
          </div>
        </div>

        {/* Eventos de GA4 */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Eventos de Google Analytics 4
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">social_impression</span>
              <span className="text-sm text-gray-600">Cuando alguien visita desde red social</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">social_click</span>
              <span className="text-sm text-gray-600">Cuando alguien hace click en elemento</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">social_conversion</span>
              <span className="text-sm text-gray-600">Cuando alguien se registra o compra</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 