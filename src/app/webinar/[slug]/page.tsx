import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWebinarBySlug } from '@/lib/webinar';
import WebinarHero from '@/components/webinar/WebinarHero';
import WebinarCountdown from '@/components/webinar/WebinarCountdown';
import WebinarRegistrationWrapper from '@/components/webinar/WebinarRegistrationWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface WebinarPageProps {
  params: { slug: string };
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: WebinarPageProps): Promise<Metadata> {
  const webinar = await getWebinarBySlug(params.slug);

  if (!webinar) {
    return {
      title: 'Webinar no encontrado',
      description: 'El webinar que buscas no existe o ha sido removido.'
    };
  }

      return {
      title: `${webinar.title} - eGrow Academy`,
      description: webinar.shortDescription || webinar.description,
      openGraph: {
        title: webinar.title,
        description: webinar.shortDescription || webinar.description,
        type: 'website',
        images: webinar.imageUrl ? [webinar.imageUrl] : [],
      },
    twitter: {
      card: 'summary_large_image',
      title: webinar.title,
      description: webinar.shortDescription || webinar.description,
      images: webinar.imageUrl ? [webinar.imageUrl] : [],
    },
  };
}

export default async function WebinarPage({ params }: WebinarPageProps) {
  const webinar = await getWebinarBySlug(params.slug);

  if (!webinar) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <WebinarHero webinar={webinar} />

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
                    <p className="text-gray-700 leading-relaxed">
                      {webinar.description}
                    </p>
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
                        Estrategias prácticas para implementar en tu negocio
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        Casos de estudio reales y ejemplos aplicables
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <p className="text-gray-700">
                        Herramientas y recursos gratuitos para empezar
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

      <Footer />
    </>
  );
} 