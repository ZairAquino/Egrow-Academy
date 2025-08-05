import { Webinar } from '@/types/webinar';
import { formatWebinarDate } from '@/lib/webinar';

interface WebinarHeroProps {
  webinar: Webinar;
}

export default function WebinarHero({ webinar }: WebinarHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
            Webinar en Vivo
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {webinar.title}
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            {webinar.shortDescription || webinar.description}
          </p>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold mb-2">Fecha y Hora</h3>
              <p className="text-blue-100 text-sm">
                {formatWebinarDate(webinar.dateTime)}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-2xl mb-2">⏱️</div>
              <h3 className="font-semibold mb-2">Duración</h3>
              <p className="text-blue-100 text-sm">
                {webinar.duration} minutos
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold mb-2">Cupos</h3>
              <p className="text-blue-100 text-sm">
                {webinar.maxAttendees ? `${webinar.currentAttendees}/${webinar.maxAttendees}` : 'Sin límite'}
              </p>
            </div>
          </div>

          {/* Host Information */}
          {webinar.hostName && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Ponente</h3>
                  <p className="text-blue-100">{webinar.hostName}</p>
                  {webinar.hostBio && (
                    <p className="text-blue-200 text-sm mt-1">{webinar.hostBio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {webinar.tags && webinar.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {webinar.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="space-y-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg">
              Registrarse al Webinar
            </button>
            <p className="text-blue-200 text-sm">
              ¡Es completamente gratuito!
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-32 translate-y-32"></div>
    </section>
  );
} 