'use client';

import { useState } from 'react';
import UTMSocialLinks from '@/components/social/UTMSocialLinks';
import SocialTrackingUrls from '@/components/social/SocialTrackingUrls';

export default function UTMDemoPage() {
  const [selectedCampaign, setSelectedCampaign] = useState('newsletter');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');

  const campaigns = [
    { id: 'newsletter', name: 'Newsletter', description: 'Suscripción al boletín' },
    { id: 'curso_ia', name: 'Curso IA', description: 'Promoción de cursos de IA' },
    { id: 'recursos_gratuitos', name: 'Recursos Gratuitos', description: 'Descarga de recursos' },
    { id: 'comunidad', name: 'Comunidad', description: 'Unirse a la comunidad' },
    { id: 'curso_monetiza', name: 'Curso Monetiza', description: 'Curso de monetización' },
    { id: 'curso_asistentes', name: 'Curso Asistentes', description: 'Curso de asistentes virtuales' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demostración del Sistema UTM
          </h1>
          <p className="text-gray-600">
            Prueba el sistema de tracking UTM para redes sociales
          </p>
        </div>

        {/* Selector de campaña */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Seleccionar Campaña</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign.id)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  selectedCampaign === campaign.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium">{campaign.name}</h3>
                <p className={`text-sm ${selectedCampaign === campaign.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {campaign.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Enlaces sociales con UTM */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Enlaces Sociales - Campaña: {campaigns.find(c => c.id === selectedCampaign)?.name}
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <UTMSocialLinks 
              campaign={selectedCampaign}
              showLabels={true}
              size="large"
              showUTMPreview={true}
              onClick={(platform, campaign, utmUrl) => {
                console.log(`Click en ${platform} para campaña ${campaign}:`, utmUrl);
              }}
            />
          </div>
        </div>

        {/* URLs de tracking por plataforma */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">URLs de Tracking por Plataforma</h2>
          <div className="flex space-x-4 mb-4">
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
          
          <SocialTrackingUrls platform={selectedPlatform} />
        </div>

        {/* Instrucciones de uso */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cómo funciona el Sistema UTM
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Generación Automática de URLs</h4>
              <p>El sistema genera automáticamente URLs con parámetros UTM para cada plataforma y campaña.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Tracking de Clicks</h4>
              <p>Cada click en un enlace social se registra en Google Analytics con información detallada.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Parámetros UTM Incluidos</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>utm_source:</strong> Plataforma social (instagram, tiktok, linkedin)</li>
                <li><strong>utm_medium:</strong> Tipo de medio (social)</li>
                <li><strong>utm_campaign:</strong> Nombre de la campaña</li>
                <li><strong>utm_content:</strong> Contenido específico (opcional)</li>
                <li><strong>utm_term:</strong> Términos de búsqueda (opcional)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Eventos de GA4</h4>
              <p>Se envían eventos personalizados a Google Analytics 4 para análisis detallado del tráfico social.</p>
            </div>
          </div>
        </div>

        {/* Ejemplo de URL generada */}
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Ejemplo de URL Generada
          </h3>
          <div className="bg-white rounded p-4 border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Campaña:</strong> {campaigns.find(c => c.id === selectedCampaign)?.name}
            </p>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Plataforma:</strong> {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
            </p>
            <code className="text-xs text-blue-700 break-all bg-blue-50 p-2 rounded block">
              {`https://egrowacademy.com/?utm_source=${selectedPlatform}&utm_medium=social&utm_campaign=${selectedCampaign}`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
