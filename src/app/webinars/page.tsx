import { Metadata } from 'next';
import { 
  getActiveWebinars, 
  getUpcomingWebinars, 
  getPastWebinars, 
  getFeaturedWebinars 
} from '@/lib/webinar';
import WebinarCard from '@/components/webinar/WebinarCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Webinars - eGrow Academy',
  description: 'Descubre nuestros webinars gratuitos sobre IA, emprendimiento, desarrollo web y más. Aprende de expertos en tiempo real.',
};

// Fuerza runtime Node para usar Prisma correctamente
export const runtime = 'nodejs';

export default async function WebinarsPage() {
  // Obtener todos los tipos de webinars
  const [featuredWebinars, upcomingWebinars, pastWebinars, allWebinars] = await Promise.all([
    getFeaturedWebinars(),
    getUpcomingWebinars(),
    getPastWebinars(),
    getActiveWebinars()
  ]);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Webinars Gratuitos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Aprende de expertos en tiempo real. Únete a nuestros webinars gratuitos sobre IA, emprendimiento y tecnología.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-2">🎯</span>
                <span className="font-semibold">Aprende en Vivo</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-2">💡</span>
                <span className="font-semibold">Conocimiento Práctico</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl mr-2">🎁</span>
                <span className="font-semibold">Completamente Gratis</span>
              </div>
            </div>
          </div>
        </div>
             </section>

       {/* Próximos Webinars */}
       <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">
               Próximos Webinars
             </h2>
             <p className="text-gray-600 max-w-2xl mx-auto">
               No te pierdas nuestros próximos eventos. Regístrate ahora y asegura tu lugar.
             </p>
           </div>

                       {upcomingWebinars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingWebinars.slice(0, 3).map((webinar) => (
                  <WebinarCard key={webinar.id} webinar={webinar} />
                ))}
              </div>
            ) : (
             <div className="text-center py-12">
               <div className="text-4xl mb-4">📅</div>
               <h3 className="text-xl font-semibold text-gray-700 mb-2">
                 No hay webinars próximos
               </h3>
               <p className="text-gray-500">
                 Pronto anunciaremos nuevos webinars. ¡Mantente atento!
               </p>
             </div>
           )}
         </div>
       </section>

       {/* Todos los Webinars - eGrow Academy */}
       <section className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">
               Webinars eGrow Academy
             </h2>
             <p className="text-gray-600 max-w-2xl mx-auto">
               Explora nuestra colección completa de webinars sobre IA, emprendimiento y tecnología.
             </p>
           </div>

           {allWebinars.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {allWebinars.map((webinar) => (
                 <WebinarCard key={webinar.id} webinar={webinar} />
               ))}
             </div>
           ) : (
             <div className="text-center py-12">
               <div className="text-4xl mb-4">🎓</div>
               <h3 className="text-xl font-semibold text-gray-700 mb-2">
                 No hay webinars disponibles
               </h3>
               <p className="text-gray-500">
                 Estamos preparando contenido increíble para ti.
               </p>
             </div>
           )}
         </div>
       </section>

       {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              ¿Por qué asistir a nuestros webinars?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Contenido Específico
                </h3>
                <p className="text-gray-600">
                  Cada webinar se enfoca en un tema específico con estrategias prácticas que puedes implementar inmediatamente.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Expertos Reales
                </h3>
                <p className="text-gray-600">
                  Aprende directamente de profesionales con experiencia comprobada en sus campos.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Interacción en Vivo
                </h3>
                <p className="text-gray-600">
                  Haz preguntas en tiempo real y obtén respuestas directas de los expertos.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Recursos Gratuitos
                </h3>
                <p className="text-gray-600">
                  Recibe materiales complementarios, herramientas y recursos sin costo adicional.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Acceso desde Cualquier Lugar
                </h3>
                <p className="text-gray-600">
                  Participa desde tu computadora, tablet o smartphone sin necesidad de descargar software.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Grabaciones Disponibles
                </h3>
                <p className="text-gray-600">
                  Si no puedes asistir en vivo, recibirás la grabación por email para verla cuando quieras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
} 