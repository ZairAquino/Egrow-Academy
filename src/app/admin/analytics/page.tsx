'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, MousePointer, Eye } from 'lucide-react';

interface AnalyticsData {
  promotions: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
  };
  ga4: {
    pageViews: number;
    sessions: number;
    users: number;
    bounceRate: number;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Obtener datos de promociones
      const promotionsResponse = await fetch(`/api/promotions/roi?days=${dateRange}`);
      const promotionsData = await promotionsResponse.json();

      // Simular datos de GA4 (en producción se obtendrían de la API de GA4)
      const ga4Data = {
        pageViews: 15420,
        sessions: 8920,
        users: 6540,
        bounceRate: 23.5,
      };

      // Calcular métricas agregadas de promociones
      const totalPromotions = promotionsData.stats.reduce((acc: any, stat: any) => ({
        impressions: acc.impressions + stat.metrics.impressions,
        clicks: acc.clicks + stat.metrics.clicks,
        conversions: acc.conversions + stat.metrics.conversions,
        revenue: acc.revenue + stat.roi.estimatedRevenue,
        ctr: 0, // Se calculará después
        conversionRate: 0, // Se calculará después
      }), { impressions: 0, clicks: 0, conversions: 0, revenue: 0, ctr: 0, conversionRate: 0 });

      // Calcular tasas
      totalPromotions.ctr = totalPromotions.impressions > 0 
        ? (totalPromotions.clicks / totalPromotions.impressions) * 100 
        : 0;
      totalPromotions.conversionRate = totalPromotions.clicks > 0 
        ? (totalPromotions.conversions / totalPromotions.clicks) * 100 
        : 0;

      setAnalyticsData({
        promotions: totalPromotions,
        ga4: ga4Data,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
        </div>

        {/* Métricas de Promociones */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Métricas de Promociones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Impresiones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.promotions.impressions.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.promotions.clicks.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">CTR</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.promotions.ctr.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analyticsData?.promotions.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de Google Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Google Analytics 4</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.ga4.pageViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-pink-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.ga4.users.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sesiones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.ga4.sessions.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData?.ga4.bounceRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de GA4 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Google Analytics 4 - Eventos de Promociones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-800">Eventos Disponibles:</p>
              <ul className="mt-2 space-y-1 text-blue-700">
                <li>• <code>promotion_impression</code> - Cuando se muestra el banner</li>
                <li>• <code>promotion_click</code> - Cuando se hace click en el CTA</li>
                <li>• <code>promotion_close</code> - Cuando se cierra el banner</li>
                <li>• <code>promotion_conversion</code> - Cuando se completa una suscripción</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-800">Parámetros Incluidos:</p>
              <ul className="mt-2 space-y-1 text-blue-700">
                <li>• <code>promotion_id</code> - ID de la promoción</li>
                <li>• <code>promotion_title</code> - Título de la promoción</li>
                <li>• <code>promotion_type</code> - Tipo de promoción</li>
                <li>• <code>revenue</code> - Ingresos generados</li>
                <li>• <code>session_id</code> - ID de sesión</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 