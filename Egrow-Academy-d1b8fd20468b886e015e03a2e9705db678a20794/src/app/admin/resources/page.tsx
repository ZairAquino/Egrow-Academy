'use client';

import { useState, useEffect } from 'react';
import ResourceUpload from '@/components/resources/ResourceUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface LocalResource {
  name: string;
  size: number;
  path: string;
}

export default function AdminResourcesPage() {
  const [localResources, setLocalResources] = useState<LocalResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedResources, setUploadedResources] = useState<string[]>([]);

  useEffect(() => {
    fetchLocalResources();
  }, []);

  const fetchLocalResources = async () => {
    try {
      const response = await fetch('/api/admin/local-resources');
      if (response.ok) {
        const data = await response.json();
        setLocalResources(data.resources);
      }
    } catch (error) {
      console.error('Error fetching local resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = (url: string) => {
    setUploadedResources(prev => [...prev, url]);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Administración de Recursos
        </h1>
        <p className="text-gray-600">
          Gestiona y optimiza los recursos de la plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de Recursos Locales */}
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          // Aquí iría la lógica para eliminar el archivo
                          console.log('Eliminar:', resource.name);
                        }}
                      >
                        Eliminar
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

        {/* Panel de Subida a UploadThing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ☁️ Subir a UploadThing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResourceUpload onUploadComplete={handleUploadComplete} />
            
            {uploadedResources.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Archivos subidos recientemente:
                </h3>
                <div className="space-y-2">
                  {uploadedResources.map((url, index) => (
                    <div
                      key={index}
                      className="p-2 bg-green-50 border border-green-200 rounded text-sm"
                    >
                      <p className="text-green-800 break-all">{url}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>📊 Estadísticas de Optimización</CardTitle>
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
                  {uploadedResources.length}
                </p>
                <p className="text-sm text-green-800">Subidos hoy</p>
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