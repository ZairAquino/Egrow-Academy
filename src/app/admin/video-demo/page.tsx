'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import VideoPlayer from '@/components/courses/VideoPlayer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export default function VideoDemoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, token } = useAuth();
  const router = useRouter();

  // Videos de demostración
  const demoVideos = [
    {
      id: 1,
      title: 'Video de YouTube (funcionando)',
      url: 'https://www.youtube.com/watch?v=fOXqNPy_nDs',
      description: 'Este video de YouTube se reproduce correctamente con el VideoPlayer mejorado',
      status: 'working'
    },
    {
      id: 2,
      title: 'Video subido a UploadThing (requiere configuración)',
      url: 'https://uploadthing.com/demo-video.mp4',
      description: 'Este tipo de video funcionará una vez configurado UploadThing',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Video local (para desarrollo)',
      url: '/videos/demo.mp4',
      description: 'Videos almacenados localmente para desarrollo',
      status: 'pending'
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Requerido</h2>
            <p className="text-gray-600 mb-4">
              Necesitas iniciar sesión para acceder a esta página de demostración.
            </p>
            <Button onClick={() => router.push('/login')}>
              Iniciar Sesión
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-fixed" />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Header */}
        <section className="admin-header">
          <div className="container">
            <div className="header-content">
              <div className="header-left">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin')}
                  className="mb-4"
                >
                  ← Volver al Panel
                </Button>
                <h1 className="page-title">
                  <Video className="w-6 h-6 mr-2" />
                  Demostración de Videos
                </h1>
                <p className="page-description">
                  Prueba el sistema de videos antes de configurar UploadThing
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="admin-content">
          <div className="container">
            <div className="space-y-8">
              {/* Estado de configuración */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Estado de Configuración</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>VideoPlayer component configurado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Soporte para videos de YouTube</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span>UploadThing requiere configuración</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span>Variables de entorno faltantes</span>
                  </div>
                </div>
              </Card>

              {/* Videos de demostración */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Videos de Demostración</h2>
                
                {demoVideos.map((video) => (
                  <Card key={video.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Video className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2">{video.title}</h3>
                        <p className="text-gray-600 mb-4">{video.description}</p>
                        
                        {video.status === 'working' && (
                          <div className="mb-4">
                            <VideoPlayer
                              videoUrl={video.url}
                              title={video.title}
                              className="w-full h-64"
                            />
                          </div>
                        )}
                        
                        {video.status === 'pending' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                              <span className="text-yellow-800">
                                Requiere configuración de UploadThing
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Instrucciones de configuración */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Configurar UploadThing</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">1. Crear cuenta en UploadThing</h3>
                    <p className="text-gray-600 mb-2">
                      Ve a <a href="https://uploadthing.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">uploadthing.com</a> y crea una cuenta.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">2. Crear proyecto</h3>
                    <p className="text-gray-600 mb-2">
                      Crea un nuevo proyecto y configura tu servicio de almacenamiento (AWS S3, Cloudflare R2, etc.).
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">3. Obtener credenciales</h3>
                    <p className="text-gray-600 mb-2">
                      Copia las credenciales generadas y agrégalas a tu archivo .env:
                    </p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">
                      UPLOADTHING_SECRET="sk_live_..."<br/>
                      UPLOADTHING_APP_ID="..."
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">4. Probar funcionalidad</h3>
                    <p className="text-gray-600 mb-2">
                      Una vez configurado, ve a <a href="/admin/lesson-video-upload" className="text-blue-600 hover:underline">/admin/lesson-video-upload</a> para probar la subida de videos.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .admin-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .page-description {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .admin-content {
          padding: 2rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
      `}</style>
    </>
  );
} 