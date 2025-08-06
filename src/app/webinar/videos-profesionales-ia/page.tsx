import { Metadata } from 'next';
import { getWebinarBySlug } from '@/lib/webinar';
import WebinarCountdown from '@/components/webinar/WebinarCountdown';
import WebinarRegistrationWrapper from '@/components/webinar/WebinarRegistrationWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FacebookConversionsTracker, { WebinarConversionsTracker } from '@/components/analytics/FacebookConversionsTracker';
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Crea Videos Profesionales con IA
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Descubre cómo crear videos impactantes usando inteligencia artificial. 
            Aprende las mejores herramientas y técnicas del mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Iniciar Sesión para Comenzar
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Contenido del Webinar */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                ¿Qué aprenderás?
              </h2>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  Herramientas de IA para creación de videos
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  Técnicas de edición profesional
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  Optimización para redes sociales
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  Estrategias de monetización
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Detalles del Webinar
              </h3>
              <div className="space-y-3 text-gray-600">
                <p><strong>Duración:</strong> 90 minutos</p>
                <p><strong>Nivel:</strong> Principiante</p>
                <p><strong>Plataforma:</strong> Zoom</p>
                <p><strong>Incluye:</strong> Material descargable</p>
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

      {/* Facebook Conversions API Tracking */}
      <WebinarConversionsTracker
        webinarId="videos-profesionales-ia"
        webinarName="Crea Videos Profesionales con IA"
      />
      
      {/* Tracking adicional para eventos específicos del webinar */}
      <FacebookConversionsTracker 
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