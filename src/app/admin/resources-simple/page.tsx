'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface LocalResource {
  name: string;
  size: number;
  path: string;
}

export default function AdminResourcesSimplePage() {
  const [localResources, setLocalResources] = useState<LocalResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocalResources();
  }, []);

  const fetchLocalResources = async () => {
    try {
      const response = await fetch('/api/admin/local-resources');
      if (response.ok) {
        const data = await response.json();
        setLocalResources(data.resources);
      } else {
        setError('Error al cargar recursos');
      }
    } catch (error) {
      console.error('Error fetching local resources:', error);
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchLocalResources} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel de Recursos (Versión Simple)
        </h1>
        <p className="text-gray-600">
          Vista simplificada para verificar recursos locales
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📁 Recursos Locales
            <span className="text-sm font-normal text-gray-500">
              ({localResources.length} archivos)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {localResources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">✅ No hay recursos locales</p>
              <p className="text-sm text-gray-400 mt-1">
                Todos los recursos están optimizados en UploadThing
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {localResources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{resource.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(resource.size)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.path, '_blank')}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Estos archivos ocupan espacio en el repositorio
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Recomendado: Migrar a UploadThing y eliminar locales
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>📊 Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {localResources.length}
                </p>
                <p className="text-sm text-blue-800">Archivos locales</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatFileSize(localResources.reduce((acc, r) => acc + r.size, 0))}
                </p>
                <p className="text-sm text-green-800">Tamaño total</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {formatFileSize(localResources.reduce((acc, r) => acc + r.size, 0))}
                </p>
                <p className="text-sm text-purple-800">Espacio a liberar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 