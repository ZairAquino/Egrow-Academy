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
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                  {resource.category}
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-bold bg-white/90 text-gray-700 shadow-md backdrop-blur-sm">
                  {resource.type}
                </div>
              </div>
              
              {/* Título centrado con gradiente */}
              <h1 className="hero-title text-5xl md:text-6xl font-extrabold mb-6 text-center">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  {resource.title}
                </span>
              </h1>
              
              <p className="hero-description text-xl md:text-2xl leading-relaxed text-white/90 mb-8 max-w-4xl text-center mx-auto">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <span className="text-2xl">📚</span>
                  <div>
                    <div className="text-white font-bold text-lg">{resource.topics?.length || 0}</div>
                    <div className="text-white/80 text-sm">recursos incluidos</div>
                  </div>
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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">📖</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Descripción
                    </h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">
                    {resource.description}
                  </p>
                </div>

                                 {/* Topics */}
                 {resource.topics && resource.topics.length > 0 && (
                   <div className="bg-white rounded-xl shadow-lg p-8">
                     <div className="text-center mb-8">
                       <div className="flex items-center justify-center gap-3 mb-4">
                         <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                           <span className="text-white text-xl">🎁</span>
                         </div>
                         <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                           Recursos Incluidos
                         </h2>
                       </div>
                       <p className="text-gray-600 text-lg font-medium">Accede a todos los materiales del webinar</p>
                     </div>
                     
                     <div className="courses-grid">
                       {resource.topics.map((topic, index) => {
                         const isFirstTopic = index === 0; // ChatGPT
                         const isSecondTopic = index === 1; // Manual GEM
                         const isThirdTopic = index === 2; // Manual GPT
                         
                         return (
                           <div 
                             key={topic.id} 
                             className="course-card-new"
                           >
                             {/* Image */}
                             <div className="course-image-new">
                               {isFirstTopic && (
                                 <img 
                                   src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&crop=center" 
                                   alt="ChatGPT"
                                 />
                               )}
                               {isSecondTopic && (
                                 <img 
                                   src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&crop=center" 
                                   alt="Google Gemini"
                                 />
                               )}
                               {isThirdTopic && (
                                 <img 
                                   src="https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=200&fit=crop&crop=center" 
                                   alt="Manual GPT"
                                 />
                               )}
                               <span className="course-type-badge">
                                 {isFirstTopic ? 'ChatGPT' : isSecondTopic ? 'Manual GEM' : 'Manual GPT'}
                               </span>
                             </div>
                             
                             {/* Content */}
                             <div className="course-content-new">
                               <div className="course-meta">
                                 <span className="course-instructor">eGrow Academy</span>
                               </div>
                               
                               <h3 className="course-title-new">
                                 {topic.title}
                               </h3>
                               
                               {topic.description && (
                                 <p className="course-description-new">
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
                                     className="w-full inline-flex items-center justify-center gap-2"
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
                                     className="w-full inline-flex items-center justify-center gap-2"
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
                                     className="w-full inline-flex items-center justify-center gap-2"
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
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Información del Recurso</h3>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        className="resource-info-card"
                        style={{
                          '--bg-start': '#eff6ff',
                          '--bg-end': '#dbeafe',
                          '--border-color': '#3b82f6',
                          '--text-color': '#1e40af',
                          '--label-color': '#2563eb'
                        } as React.CSSProperties}
                      >
                        <div className="resource-info-value">
                          {resource.author || 'eGrow Academy'}
                        </div>
                        <div className="resource-info-label">
                          Autor
                        </div>
                      </div>
                      
                      <div 
                        className="resource-info-card"
                        style={{
                          '--bg-start': '#eff6ff',
                          '--bg-end': '#dbeafe',
                          '--border-color': '#3b82f6',
                          '--text-color': '#1e40af',
                          '--label-color': '#2563eb'
                        } as React.CSSProperties}
                      >
                        <div className="resource-info-value">
                          {resource.category}
                        </div>
                        <div className="resource-info-label">
                          Categoría
                        </div>
                      </div>
                      
                      <div 
                        className="resource-info-card"
                        style={{
                          '--bg-start': '#eff6ff',
                          '--bg-end': '#dbeafe',
                          '--border-color': '#3b82f6',
                          '--text-color': '#1e40af',
                          '--label-color': '#2563eb'
                        } as React.CSSProperties}
                      >
                        <div className="resource-info-value">
                          {resource.type}
                        </div>
                        <div className="resource-info-label">
                          Tipo
                        </div>
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

      <style jsx>{`
        .resource-info-card {
          background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .resource-info-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }
        
        .resource-info-value {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: var(--text-color);
          line-height: 1.2;
        }
        
        .resource-info-label {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--label-color);
          line-height: 1;
        }
      `}</style>
    </>
  );
} 