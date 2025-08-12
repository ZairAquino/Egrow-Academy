'use client';

import { useState, useEffect } from 'react';
import { generateSocialTrackingUrl } from '@/lib/social-tracking';

interface SocialMetrics {
  platform: string;
  clicks: number;
  impressions: number;
  conversions: number;
  conversionRate: number;
  sessions: number;
  users: number;
}

export default function SocialAnalyticsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'linkedin'>('instagram');
  const [selectedCampaign, setSelectedCampaign] = useState('newsletter');
  const [metrics, setMetrics] = useState<SocialMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de métricas (en producción esto vendría de GA4 API)
  useEffect(() => {
    const mockMetrics: SocialMetrics[] = [
      {
        platform: 'instagram',
        clicks: 150,
        impressions: 1200,
        conversions: 45,
        conversionRate: 30,
        sessions: 120,
        users: 95
      },
      {
        platform: 'tiktok',
        clicks: 89,
        impressions: 800,
        conversions: 23,
        conversionRate: 25.8,
        sessions: 67,
        users: 52
      },
      {
        platform: 'linkedin',
        clicks: 234,
        impressions: 1500,
        conversions: 89,
        conversionRate: 38,
        sessions: 189,
        users: 156
      }
    ];

    setMetrics(mockMetrics);
    setIsLoading(false);
  }, []);

  const campaigns = [
    { id: 'newsletter', name: 'Newsletter', description: 'Suscripción al boletín' },
    { id: 'curso_ia', name: 'Curso IA', description: 'Promoción de cursos de IA' },
    { id: 'recursos_gratuitos', name: 'Recursos Gratuitos', description: 'Descarga de recursos' },
    { id: 'comunidad', name: 'Comunidad', description: 'Unirse a la comunidad' },
    { id: 'curso_monetiza', name: 'Curso Monetiza', description: 'Curso de monetización' },
    { id: 'curso_asistentes', name: 'Curso Asistentes', description: 'Curso de asistentes virtuales' }
  ];

  const currentMetrics = metrics.find(m => m.platform === selectedPlatform) || metrics[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics de Redes Sociales
          </h1>
          <p className="text-gray-600">
            Métricas detalladas del tráfico desde redes sociales con tracking UTM
          </p>
        </div>

        {/* Selectores */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataforma
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaña
            </label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Clicks Totales
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {currentMetrics?.clicks || 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Desde {selectedPlatform}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Impresiones
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {currentMetrics?.impressions || 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Alcance total
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Conversiones
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {currentMetrics?.conversions || 0}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Registros/Compras
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Tasa de Conversión
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {currentMetrics?.conversionRate || 0}%
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Clicks → Conversiones
            </p>
          </div>
        </div>

        {/* Tabla de Métricas por Plataforma */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Métricas por Plataforma
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impresiones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversiones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasa Conv.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sesiones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map((metric) => (
                  <tr key={metric.platform} className={metric.platform === selectedPlatform ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="capitalize font-medium text-gray-900">
                          {metric.platform}
                        </span>
                        {metric.platform === selectedPlatform && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Seleccionado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.impressions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {metric.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {metric.conversionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.sessions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metric.users}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* URLs de Tracking para la Campaña Seleccionada */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            URLs de Tracking - Campaña: {campaigns.find(c => c.id === selectedCampaign)?.name}
          </h3>
          <div className="space-y-3">
            {(['instagram', 'tiktok', 'linkedin'] as const).map((platform) => {
              const utmUrl = generateSocialTrackingUrl(platform, selectedCampaign);
              return (
                <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="capitalize font-medium text-gray-700 min-w-[80px]">
                      {platform}
                    </span>
                    <code className="text-sm text-gray-600 break-all flex-1">
                      {utmUrl}
                    </code>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(utmUrl)}
                    className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instrucciones para Ver Métricas en GA4 */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            📊 Cómo Ver Estas Métricas en Google Analytics 4
          </h3>
          
          <div className="space-y-4 text-blue-800">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">1. Panel de Adquisición</h4>
              <p className="text-sm">
                <strong>Ruta:</strong> GA4 → Adquisición → Canales → Social
              </p>
              <p className="text-sm">Aquí verás el tráfico total desde redes sociales</p>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-900 mb-2">2. Exploración Libre por UTM Source</h4>
              <p className="text-sm">
                <strong>Ruta:</strong> GA4 → Explorar → Exploración Libre → Nueva exploración
              </p>
              <p className="text-sm">
                <strong>Dimensión:</strong> utm_source | <strong>Métrica:</strong> event_count
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-900 mb-2">3. Eventos de Redes Sociales</h4>
              <p className="text-sm">
                <strong>Ruta:</strong> GA4 → Eventos → Eventos personalizados
              </p>
              <p className="text-sm">Busca: social_click, social_impression, social_conversion</p>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-900 mb-2">4. Análisis por Campaña</h4>
              <p className="text-sm">
                <strong>Ruta:</strong> GA4 → Explorar → Exploración Libre
              </p>
              <p className="text-sm">
                <strong>Dimensiones:</strong> utm_source + utm_campaign
              </p>
            </div>
          </div>
        </div>

        {/* Filtros de GA4 para Redes Sociales */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔍 Filtros Recomendados para GA4
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Filtro por Plataforma Social</h4>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">
                  utm_source = 'instagram' OR utm_source = 'tiktok' OR utm_source = 'linkedin'
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Filtro por Medio Social</h4>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">
                  utm_medium = 'social'
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Filtro por Campaña Específica</h4>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">
                  utm_campaign = 'newsletter'
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Filtro Combinado</h4>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">
                  utm_source = 'tiktok' AND utm_campaign = 'curso_ia'
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
