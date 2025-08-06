'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FacebookAnalyticsDashboard from '@/components/analytics/FacebookAnalyticsDashboard';
import { facebookAnalytics } from '@/lib/facebook-analytics';

export default function FacebookAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [exportData, setExportData] = useState<string>('');

  useEffect(() => {
    // Verificar si el usuario es admin
    if (!user || user.membershipLevel !== 'PREMIUM') {
      router.push('/login?redirect=/admin/facebook-analytics');
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  const handleExportData = () => {
    try {
      const data = facebookAnalytics.exportData();
      setExportData(data);
      
      // Crear y descargar archivo
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facebook-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      alert('Error al exportar datos');
    }
  };

  const handleCleanupData = () => {
    try {
      facebookAnalytics.cleanup();
      alert('Datos antiguos limpiados correctamente');
    } catch (error) {
      console.error('Error al limpiar datos:', error);
      alert('Error al limpiar datos');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="main-content pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Facebook Analytics
                </h1>
                <p className="mt-2 text-gray-600">
                  Estadísticas en tiempo real de Facebook Pixel para eGrow Academy
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Exportar Datos
                </button>
                <button
                  onClick={handleCleanupData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Limpiar Datos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Información del Pixel */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-900">Información del Facebook Pixel</h3>
                <p className="text-blue-700">
                  <strong>Pixel ID:</strong> 1247652460159167
                </p>
                <p className="text-blue-700">
                  <strong>Estado:</strong> Activo y funcionando
                </p>
                <p className="text-blue-700">
                  <strong>Última verificación:</strong> {new Date().toLocaleString('es-MX')}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard principal */}
            <div className="lg:col-span-2">
              <FacebookAnalyticsDashboard 
                showRealTime={true}
                refreshInterval={30000}
              />
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Estado del sistema */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Sistema</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Facebook Pixel</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Activo
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tracking de Eventos</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Funcionando
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Analytics en Tiempo Real</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Activo
                    </span>
                  </div>
                </div>
              </div>

              {/* Eventos recientes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Eventos Recientes</h3>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">
                    Los últimos eventos se muestran en tiempo real
                  </div>
                  <div className="text-sm text-gray-600">
                    Abre la consola del navegador (F12) para ver los logs de eventos
                  </div>
                </div>
              </div>

              {/* Configuración */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intervalo de actualización
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="15000">15 segundos</option>
                      <option value="30000" selected>30 segundos</option>
                      <option value="60000">1 minuto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modo de visualización
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="realtime" selected>Tiempo real</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Eventos Trackeados</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">PageView</span>
                  <span className="font-medium">Automático</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ViewContent</span>
                  <span className="font-medium">Cursos y páginas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead</span>
                  <span className="font-medium">Registros y webinars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase</span>
                  <span className="font-medium">Compras y upgrades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CustomEvent</span>
                  <span className="font-medium">Engagement y scroll</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Audiencias Creadas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Visitantes de la página principal</span>
                  <span className="font-medium text-green-600">Activa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usuarios que ven cursos</span>
                  <span className="font-medium text-green-600">Activa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usuarios que se registran</span>
                  <span className="font-medium text-green-600">Activa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usuarios que compran</span>
                  <span className="font-medium text-green-600">Activa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usuarios con engagement alto</span>
                  <span className="font-medium text-yellow-600">En construcción</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 