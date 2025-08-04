'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Promotion {
  id: string;
  type: 'PREMIUM_SUBSCRIPTION' | 'NEW_COURSE' | 'SPECIAL_OFFER';
  title: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
  priority: number;
  currentImpressions: number;
  createdAt: string;
}

interface PromotionStats {
  id: string;
  title: string;
  type: string;
  isActive: boolean;
  currentImpressions: number;
  metrics: {
    impressions: number;
    clicks: number;
    closes: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
    overallConversionRate: number;
  };
  roi: {
    estimatedRevenue: number;
    estimatedYearlyRevenue: number;
    estimatedCPA: number;
    revenuePerImpression: number;
    revenuePerClick: number;
  };
}

export default function PromotionsAdminPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<PromotionStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchPromotions();
    fetchStats();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions');
      if (response.ok) {
        const data = await response.json();
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/promotions/roi');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const togglePromotionStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchPromotions();
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
    }
  };

  const deletePromotion = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta promoción?')) return;

    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPromotions();
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Nueva Promoción</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Impresiones:</span>
                  <span className="font-medium">{stat.metrics.impressions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clicks:</span>
                  <span className="font-medium">{stat.metrics.clicks}</span>
                </div>
                <div className="flex justify-between">
                  <span>CTR:</span>
                  <span className="font-medium">{stat.metrics.ctr}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversiones:</span>
                  <span className="font-medium">{stat.metrics.conversions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conv. Rate:</span>
                  <span className="font-medium">{stat.metrics.overallConversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-medium text-green-600">${stat.roi.estimatedRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue/Click:</span>
                  <span className="font-medium text-green-600">${stat.roi.revenuePerClick.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de Promociones */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Promociones Activas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promoción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impresiones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{promotion.title}</div>
                        <div className="text-sm text-gray-500">{promotion.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {promotion.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promotion.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {promotion.currentImpressions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePromotionStatus(promotion.id, promotion.isActive)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          promotion.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {promotion.isActive ? (
                          <>
                            <Eye size={12} className="mr-1" />
                            Activa
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} className="mr-1" />
                            Inactiva
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deletePromotion(promotion.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 