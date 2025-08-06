'use client';

import { useState, useEffect } from 'react';
import { facebookAnalytics, type FacebookAnalyticsMetrics } from '@/lib/facebook-analytics';

interface FacebookAnalyticsDashboardProps {
  showRealTime?: boolean;
  refreshInterval?: number; // en milisegundos
  className?: string;
}

export default function FacebookAnalyticsDashboard({
  showRealTime = true,
  refreshInterval = 30000, // 30 segundos
  className = ''
}: FacebookAnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<FacebookAnalyticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const updateMetrics = () => {
      try {
        const currentMetrics = facebookAnalytics.getMetrics();
        setMetrics(currentMetrics);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener métricas de Facebook Analytics:', error);
        setIsLoading(false);
      }
    };

    // Actualizar métricas inmediatamente
    updateMetrics();

    // Configurar actualización automática si está habilitado
    let intervalId: NodeJS.Timeout;
    if (showRealTime) {
      intervalId = setInterval(updateMetrics, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showRealTime, refreshInterval]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(2) + '%';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Facebook Analytics</h2>
          <p className="text-sm text-gray-500">
            Estadísticas en tiempo real de Facebook Pixel
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">
            Última actualización
          </div>
          <div className="text-sm font-medium text-gray-600">
            {lastUpdated.toLocaleTimeString('es-MX')}
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Vistas de Página</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.pageViews)}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Visitantes Únicos</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.uniqueVisitors)}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.conversionRate)}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.revenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Páginas más visitadas */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Páginas Más Visitadas</h3>
        <div className="space-y-3">
          {metrics.topPages.map((page, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">#{index + 1}</span>
                <span className="text-sm text-gray-800 truncate">{page.page}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{page.views} vistas</span>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel de conversión */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Funnel de Conversión</h3>
        <div className="space-y-3">
          {metrics.userJourney.map((step, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">#{index + 1}</span>
                <span className="text-sm text-gray-800">{step.step}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">{step.users} usuarios</span>
                {step.conversion > 0 && (
                  <span className="text-xs text-green-600 ml-2">({step.conversion} conversiones)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eventos más frecuentes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Eventos Más Frecuentes</h3>
        <div className="space-y-3">
          {metrics.topEvents.slice(0, 5).map((event, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-800 truncate">{event.event}</span>
              <span className="text-sm font-semibold text-gray-900">{event.count} veces</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de tiempo real */}
      {showRealTime && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Actualización en tiempo real cada {refreshInterval / 1000} segundos
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar métricas específicas
export function FacebookMetricsCard({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  format = 'number' 
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  format?: 'number' | 'percentage' | 'currency';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  const formatValue = (val: number): string => {
    switch (format) {
      case 'percentage':
        return val.toFixed(2) + '%';
      case 'currency':
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'USD'
        }).format(val);
      default:
        return val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' :
               val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val.toString();
    }
  };

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        </div>
      </div>
    </div>
  );
} 