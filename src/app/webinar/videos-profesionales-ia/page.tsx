import { Metadata } from 'next';
import { getWebinarBySlug } from '@/lib/webinar';
import WebinarCountdown from '@/components/webinar/WebinarCountdown';
import WebinarRegistrationWrapper from '@/components/webinar/WebinarRegistrationWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FacebookPixelTracker, { WebinarTracker } from '@/components/analytics/FacebookPixelTracker';
import { notFound } from 'next/navigation';

// Metadata para SEO
export const metadata: Metadata = {
  title: 'Aprende a crear videos profesionales con IA - eGrow Academy',
  description: 'Crea videos profesionales con Inteligencia Artificial usando Sora y VEO Gemini. Atrae 80% más clientes sin experiencia en edición.',
  openGraph: {
    title: 'Aprende a crear videos profesionales con IA',
    description: 'Descubre cómo crear contenido de alto impacto con IA y atraer hasta 80% más de clientes.',
    type: 'website',
    images: ['/images/webinars/videos-ia-webinar.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aprende a crear videos profesionales con IA',
    description: 'Crea videos profesionales con IA y atrae 80% más clientes sin experiencia en edición.',
    images: ['/images/webinars/videos-ia-webinar.jpg'],
  },
};

export default async function VideosIAWebinarPage() {
  const webinar = await getWebinarBySlug('videos-profesionales-ia');

  if (!webinar) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      {/* Main Content */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column - Content */}
              <div className="space-y-8">
                {/* Countdown */}
                <WebinarCountdown date={webinar.dateTime} />

                {/* Description */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Acerca de este Webinar
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {webinar.description}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                      <p className="font-semibold text-blue-900 mb-2">📅 Información del Evento</p>
                      <p className="text-blue-800 mb-1"><strong>Fecha:</strong> Viernes 8 de agosto de 2025</p>
                      <p className="text-blue-800 mb-1"><strong>Hora México:</strong> 5:00 PM</p>
                      <div className="mt-3">
                        <p className="font-medium text-blue-900">🌎 Horarios por país:</p>
                        <p className="text-sm text-blue-700">
                          Argentina (8:00 PM), Colombia/Perú/Ecuador (6:00 PM), Cuba/Venezuela/Rep. Dominicana (7:00 PM), Nicaragua (5:00 PM), España (1:00 AM sábado)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    ¿Qué aprenderás?
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        Fundamentos de Sora y VEO Gemini para crear videos profesionales
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        Cómo generar videos de alto impacto con solo texto e ideas
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        Estrategias para atraer hasta 80% más clientes con contenido IA
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        Sesión de preguntas y respuestas en vivo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Host Information */}
                {webinar.hostName && (
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Sobre el Ponente
                    </h2>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👨‍💼</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {webinar.hostName}
                        </h3>
                        {webinar.hostBio && (
                          <p className="text-gray-700 leading-relaxed">
                            {webinar.hostBio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Registration Form */}
              <div className="lg:sticky lg:top-8">
                <WebinarRegistrationWrapper webinar={webinar} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Preguntas Frecuentes
            </h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¿Necesito experiencia previa en edición de video?
                    </h3>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">
                      No, este webinar está diseñado para principiantes. Las herramientas de IA hacen todo el trabajo técnico por ti.
                    </p>
                  </div>
                </details>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¿Es realmente gratuito?
                    </h3>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">
                      Sí, este webinar es completamente gratuito. No hay costos ocultos ni suscripciones requeridas.
                    </p>
                  </div>
                </details>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¿Cómo recibo el link de acceso?
                    </h3>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">
                      Recibirás un email de confirmación inmediatamente después de registrarte, y un recordatorio con el link de acceso 15 minutos antes del evento.
                    </p>
                  </div>
                </details>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¿Puedo ver la grabación después?
                    </h3>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">
                      Sí, si no puedes asistir en vivo, te enviaremos la grabación por email después del evento.
                    </p>
                  </div>
                </details>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ¿Necesito instalar algún software?
                    </h3>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">
                      No es necesario. El webinar se realizará a través de Zoom Web, que funciona directamente en tu navegador sin necesidad de descargar nada.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Pixel Tracking para Webinar */}
      <WebinarTracker 
        webinarId="videos-profesionales-ia"
        webinarName="Crea Videos Profesionales con IA"
      />
      
      {/* Tracking adicional para eventos específicos del webinar */}
      <FacebookPixelTracker 
        trackPageView={true}
        pageData={{
          content_name: 'Crea Videos Profesionales con IA',
          content_category: 'Webinar',
          content_type: 'webinar_landing_page',
          content_ids: ['videos-profesionales-ia']
        }}
        customEvents={[
          {
            event: 'ViewContent',
            data: {
              content_name: 'Crea Videos Profesionales con IA',
              content_category: 'Webinar',
              content_type: 'webinar_view',
              content_ids: ['videos-profesionales-ia'],
              custom_parameters: {
                webinar_id: 'videos-profesionales-ia',
                webinar_type: 'ia_video_creation',
                course_duration: '90 minutos',
                course_level: 'Principiante',
                course_category: 'Marketing Digital'
              }
            },
            delay: 1000 // 1 segundo después de cargar
          },
          {
            event: 'CustomEvent',
            data: {
              content_name: 'Webinar Landing Page View',
              content_category: 'Webinar',
              content_type: 'webinar_landing_view',
              custom_parameters: {
                webinar_id: 'videos-profesionales-ia',
                funnel_step: 'landing_page_view'
              }
            },
            delay: 2000 // 2 segundos después de cargar
          }
        ]}
      />

      <Footer />
    </>
  );
}