'use client';

import { Webinar } from '@/types/webinar';
import { formatWebinarDate, getTimeUntilWebinar } from '@/lib/webinar';
import Link from 'next/link';
import Image from 'next/image';

interface WebinarCardProps {
  webinar: Webinar;
}

export default function WebinarCard({ webinar }: WebinarCardProps) {
  const timeUntil = getTimeUntilWebinar(webinar.dateTime);
  const isUpcoming = timeUntil.days > 0 || timeUntil.hours > 0 || timeUntil.minutes > 0;
  const isToday = timeUntil.days === 0 && timeUntil.hours <= 24;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      {/* Image */}
      {(webinar.imageUrl || webinar.title.toLowerCase().includes('aprende a crear videos profesionales con ia')) && (
        <div className="relative h-48">
          <Image
            src={webinar.title.toLowerCase().includes('aprende a crear videos profesionales con ia') ? "/images/webinarcv.png" : webinar.imageUrl}
            alt={webinar.title}
            width={400}
            height={192}
            className="w-full h-full object-cover"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {isToday ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                Hoy
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Próximamente
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Finalizado
              </span>
            )}
          </div>

          {/* Free Badge */}
          {webinar.isFree && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Gratis
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {webinar.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {webinar.shortDescription || webinar.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>{formatWebinarDate(webinar.dateTime)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⏱️</span>
            <span>{webinar.duration} minutos</span>
          </div>

          {webinar.hostName && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">👨‍💼</span>
              <span>{webinar.hostName}</span>
            </div>
          )}

          {webinar.maxAttendees && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">👥</span>
              <span>{webinar.currentAttendees}/{webinar.maxAttendees} registrados</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {webinar.tags && webinar.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {webinar.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div className="flex justify-between items-center">
          <Link
            href={`/webinar/${webinar.slug}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isUpcoming ? 'Registrarse' : 'Ver Detalles'}
          </Link>

          {/* Time until */}
          {isUpcoming && (
            <div className="text-sm text-gray-500">
              {timeUntil.days > 0 && `${timeUntil.days}d `}
              {timeUntil.hours > 0 && `${timeUntil.hours}h `}
              {timeUntil.minutes > 0 && `${timeUntil.minutes}m`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 