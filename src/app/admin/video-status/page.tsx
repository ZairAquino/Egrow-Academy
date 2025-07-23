'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface VideoStatus {
  courseTitle: string;
  lessonTitle: string;
  videoUrl: string;
  type: 'youtube' | 'uploadthing';
  status: 'working' | 'pending' | 'error';
}

export default function VideoStatusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videos, setVideos] = useState<VideoStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    fetchVideoStatus();
  }, [user, token, router]);

  const fetchVideoStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simular datos de videos (en producción, esto vendría de la API)
      const mockVideos: VideoStatus[] = [
        {
          courseTitle: 'Monetiza con IA',
          lessonTitle: 'M0 - AI Money‑Toolkit',
          videoUrl: 'https://www.youtube.com/watch?v=fOXqNPy_nDs',
          type: 'youtube',
          status: 'working'
        },
        {
          courseTitle: 'Desarrollo Web Full Stack',
          lessonTitle: 'Introducción al Desarrollo Full Stack',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          type: 'youtube',
          status: 'working'
        },
        {
          courseTitle: 'Desarrollo Web Full Stack',
          lessonTitle: 'Configuración del Entorno de Desarrollo',
          videoUrl: 'https://www.youtube.com/watch?v=8Xa2cPwKOPY',
          type: 'youtube',
          status: 'working'
        }
      ];

      setVideos(mockVideos);
    } catch (err) {
      setError('Error al cargar el estado de videos');
      console.error('Error fetching video status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working':
        return 'Funcionando';
      case 'pending':
        return 'Pendiente';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando estado de videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchVideoStatus}>Reintentar</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-top-right" />
      
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
                  Estado de Videos
                </h1>
                <p className="page-description">
                  Verifica el estado de todos los videos en los cursos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="admin-content">
          <div className="container">
            <div className="space-y-6">
              {/* Resumen */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Resumen</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {videos.filter(v => v.status === 'working').length}
                    </div>
                    <div className="text-sm text-green-700">Funcionando</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {videos.filter(v => v.status === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-700">Pendientes</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {videos.filter(v => v.status === 'error').length}
                    </div>
                    <div className="text-sm text-red-700">Con errores</div>
                  </div>
                </div>
              </Card>

              {/* Lista de videos */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Videos por Curso</h2>
                
                {videos.length === 0 ? (
                  <div className="text-center py-8">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No se encontraron videos</p>
                    <Button onClick={() => router.push('/admin/lesson-video-upload')}>
                      Agregar Videos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((video, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{video.courseTitle}</h3>
                            <p className="text-gray-600">{video.lessonTitle}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                video.type === 'youtube' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {video.type === 'youtube' ? 'YouTube' : 'UploadThing'}
                              </span>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(video.status)}
                                <span className="text-sm text-gray-600">
                                  {getStatusText(video.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Acciones */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Acciones</h2>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => router.push('/admin/lesson-video-upload')}>
                    <Video className="w-4 h-4 mr-2" />
                    Gestionar Videos
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/admin/video-demo')}
                  >
                    Ver Demo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={fetchVideoStatus}
                  >
                    Actualizar Estado
                  </Button>
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