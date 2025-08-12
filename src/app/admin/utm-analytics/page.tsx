'use client';

import { useState, useEffect } from 'react';
import { getAllCourseLaunchUrls } from '@/lib/social-tracking';
import { getStoredUTMData } from '@/lib/utm-tracking';

interface UTMStats {
  total_urls: number;
  platforms: string[];
  campaign: string;
  last_updated: string;
}

export default function UTMAnalyticsPage() {
  const [utmUrls, setUtmUrls] = useState<Record<string, Record<string, string>>>({});
  const [currentUTM, setCurrentUTM] = useState<any>(null);
  const [stats, setStats] = useState<UTMStats>({
    total_urls: 0,
    platforms: [],
    campaign: '',
    last_updated: new Date().toLocaleString('es-ES'),
  });

  useEffect(() => {
    // Obtener todas las URLs UTM
    const urls = getAllCourseLaunchUrls();
    setUtmUrls(urls);

    // Calcular estadísticas
    const platforms = Object.keys(urls);
    const totalUrls = Object.values(urls).reduce((acc, platform) => {
      return acc + Object.keys(platform).length;
    }, 0);

    setStats({
      total_urls: totalUrls,
      platforms,
      campaign: 'curso_lanzamiento_2025',
      last_updated: new Date().toLocaleString('es-ES'),
    });

    // Obtener UTM actual si existe
    const storedUTM = getStoredUTMData();
    if (storedUTM) {
      setCurrentUTM(storedUTM);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Mostrar notificación
    alert('URL copiada al portapapeles');
  };

  const testUTMUrl = (url: string) => {
    // Abrir URL en nueva pestaña para testing
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Analytics UTM - Campaña "Monetiza tu Voz con IA"
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitoreo en tiempo real del tracking UTM para la campaña de lanzamiento
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-2xl">🔗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total URLs UTM
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.total_urls}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="text-2xl">📱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Plataformas
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.platforms.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Campaña
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.campaign}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Última Actualización
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stats.last_updated}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* UTM Actual (si existe) */}
        {currentUTM && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🎯 UTM Detectado Actualmente
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Source</p>
                <p className="font-mono text-blue-600 dark:text-blue-400">{currentUTM.utm_source}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
                <p className="font-mono text-green-600 dark:text-green-400">{currentUTM.utm_medium}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Campaign</p>
                <p className="font-mono text-purple-600 dark:text-purple-400">{currentUTM.utm_campaign}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Content</p>
                <p className="font-mono text-orange-600 dark:text-orange-400">{currentUTM.utm_content || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Term</p>
                <p className="font-mono text-red-600 dark:text-red-400">{currentUTM.utm_term || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* URLs UTM por Plataforma */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              🔗 URLs UTM Generadas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Todas las URLs con parámetros UTM para la campaña
            </p>
          </div>
          
          <div className="p-6">
            {Object.entries(utmUrls).map(([platform, contentTypes]) => (
              <div key={platform} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                  📱 {platform}
                </h3>
                
                <div className="space-y-3">
                  {Object.entries(contentTypes).map(([contentType, url]) => (
                    <div key={contentType} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {contentType.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            {platform === 'linkedin' || platform === 'google' ? 'CPC' : 'Paid Social'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono break-all">
                          {url}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => copyToClipboard(url)}
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          📋 Copiar
                        </button>
                        <button
                          onClick={() => testUTMUrl(url)}
                          className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          🧪 Probar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instrucciones de Uso */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            📚 Cómo Usar las URLs UTM
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>• <strong>LinkedIn:</strong> Usar en LinkedIn Ads Manager con medium "cpc"</p>
            <p>• <strong>Meta:</strong> Usar en Facebook/Instagram Ads con medium "paid_social"</p>
            <p>• <strong>Google:</strong> Usar en Google Ads con medium "cpc"</p>
            <p>• <strong>TikTok:</strong> Usar en TikTok Ads Manager con medium "paid_social"</p>
            <p>• <strong>Tracking:</strong> Los parámetros UTM se detectan automáticamente en GA4</p>
          </div>
        </div>

        {/* Estado del Tracking */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            ✅ Estado del Sistema de Tracking
          </h3>
          <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
            <p>• <strong>UTM Tracker:</strong> Integrado en el layout principal</p>
            <p>• <strong>GA4 Integration:</strong> Eventos automáticos configurados</p>
            <p>• <strong>Conversiones:</strong> Tracking automático de vistas, inscripciones y pagos</p>
            <p>• <strong>Debug Panel:</strong> Panel flotante para verificar parámetros UTM</p>
            <p>• <strong>Session Storage:</strong> Persistencia de datos UTM durante la sesión</p>
          </div>
        </div>
      </div>
    </div>
  );
}