'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useResource } from '@/hooks/useResources';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';

export default function ResourcePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const slug = params.slug as string;
  const { resource, loading, error, checkAccess } = useResource(slug);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const verifyAccess = async () => {
      if (resource) {
        const accessResult = await checkAccess();
        setHasAccess(accessResult.hasAccess);
        setAccessChecked(true);
      }
    };

    if (resource && !accessChecked) {
      verifyAccess();
    }
  }, [resource, accessChecked, checkAccess]);

  const handleDownload = () => {
    if (resource?.fileUrl) {
      if (resource.type === 'LINK') {
        window.open(resource.fileUrl, '_blank');
      } else {
        window.open(resource.fileUrl, '_blank');
      }
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login?redirect=' + encodeURIComponent(`/resources/${slug}`));
  };

  if (loading) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner />
          </div>
        </main>
      </>
    );
  }

  if (error || !resource) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Recurso no encontrado</h1>
              <p className="text-gray-600 mb-6">{error || 'El recurso que buscas no existe.'}</p>
              <button 
                onClick={() => router.push('/resources')}
                className="btn btn-primary"
              >
                Volver a Recursos
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <div className="container">
            <div className="hero-content">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {resource.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-700">
                  {resource.type}
                </span>
              </div>
              <h1 className="hero-title">
                {resource.title}
              </h1>
              <p className="hero-description">
                Webinar completo que incluye acceso a ChatGPT especializado en contexto empresarial, 
                manuales detallados de GPT y GEM para crear asistentes virtuales inteligentes.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-white">📚 {resource.topics?.length || 0} recursos incluidos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resource Content */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {resource.description}
                  </p>
                </div>

                                 {/* Topics */}
                 {resource.topics && resource.topics.length > 0 && (
                   <div className="bg-white rounded-xl shadow-lg p-8">
                     <div className="text-center mb-8">
                       <h2 className="text-3xl font-bold text-gray-900 mb-2">Recursos Incluidos</h2>
                       <p className="text-gray-600">Accede a todos los materiales del webinar</p>
                     </div>
                     
                     <div className="courses-grid">
                       {resource.topics.map((topic, index) => {
                         const isFirstTopic = index === 0; // ChatGPT
                         const isSecondTopic = index === 1; // Manual GEM
                         const isThirdTopic = index === 2; // Manual GPT
                         
                         return (
                           <div 
                             key={topic.id} 
                             className="course-card-new transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                           >
                             {/* Image */}
                             <div className="course-image-new overflow-hidden">
                               {isFirstTopic && (
                                 <img 
                                   src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=center" 
                                   alt="ChatGPT"
                                   className="transform hover:scale-110 transition-transform duration-500"
                                 />
                               )}
                               {isSecondTopic && (
                                 <img 
                                   src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&crop=center" 
                                   alt="Google Gemini"
                                   className="transform hover:scale-110 transition-transform duration-500"
                                 />
                               )}
                               {isThirdTopic && (
                                 <img 
                                   src="https://images.unsplash.com/photo-1673187733777-2ea8f697d4b9?w=400&h=200&fit=crop&crop=center" 
                                   alt="Manual GPT"
                                   className="transform hover:scale-110 transition-transform duration-500"
                                 />
                               )}
                               <span className="course-type-badge bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg">
                                 {isFirstTopic ? 'ChatGPT' : isSecondTopic ? 'Manual GEM' : 'Manual GPT'}
                               </span>
                             </div>
                             
                             {/* Content */}
                             <div className="course-content-new p-6">
                               <div className="course-meta mb-3">
                                 <span className="course-instructor bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent font-bold">
                                   eGrow Academy
                                 </span>
                               </div>
                               
                               <h3 className="course-title-new text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-300">
                                 {topic.title}
                               </h3>
                               
                               {topic.description && (
                                 <p className="course-description-new text-gray-600 leading-relaxed mb-4">
                                   {topic.description}
                                 </p>
                               )}
                               
                               {/* Action button */}
                               <div className="course-link">
                                 {isFirstTopic && (
                                   <a
                                     href="https://chatgpt.com/g/g-687e84aba36c8191a44042cc330db2f1-contexto-empresarial"
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                   >
                                     <span>🔗</span>
                                     <span>Abrir ChatGPT</span>
                                   </a>
                                 )}
                                 
                                 {isSecondTopic && (
                                   <a
                                     href="/resources/Manual GEM.pdf"
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                   >
                                     <span>📥</span>
                                     <span>Descargar Manual GEM</span>
                                   </a>
                                 )}
                                 
                                 {isThirdTopic && (
                                   <a
                                     href="/resources/Manual GPT.pdf"
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                   >
                                     <span>📥</span>
                                     <span>Descargar Manual GPT</span>
                                   </a>
                                 )}
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                  <div className="text-center mb-6">
                    
                    {!isAuthenticated && resource.requiresAuth ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          🔒 Este recurso requiere iniciar sesión para acceder
                        </p>
                        <button 
                          onClick={handleLoginRedirect}
                          className="btn btn-primary w-full"
                        >
                          Iniciar Sesión
                        </button>
                      </div>
                    ) : hasAccess || !resource.requiresAuth ? (
                      <div className="space-y-4">
                        <button 
                          onClick={handleDownload}
                          className="btn btn-primary w-full"
                        >
                          {resource.type === 'LINK' ? '🔗 Abrir Enlace' : '📥 Descargar Recurso'}
                        </button>
                        {resource.type !== 'LINK' && resource.fileUrl && (
                          <a 
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full btn btn-outline"
                          >
                            👁️ Ver en Nueva Pestaña
                          </a>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Resource Info */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                        <span className="text-white text-lg">ℹ️</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Información del Recurso
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-sm">👤</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Autor</span>
                        </div>
                        <p className="text-gray-900 font-bold ml-11 text-lg">{resource.author || 'eGrow Academy'}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-sm">📂</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Categoría</span>
                        </div>
                        <p className="text-gray-900 font-bold ml-11 text-lg">{resource.category}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white text-sm">📄</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Tipo</span>
                        </div>
                        <p className="text-gray-900 font-bold ml-11 text-lg">{resource.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
} 