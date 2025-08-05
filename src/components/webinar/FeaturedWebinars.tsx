'use client';

import React from 'react';
import { Webinar } from '@/types/webinar';
import WebinarCard from './WebinarCard';

interface FeaturedWebinarsProps {
  webinars: Webinar[];
}

export default function FeaturedWebinars({ webinars }: FeaturedWebinarsProps) {
  if (webinars.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Webinars Destacados
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Los próximos eventos que no te puedes perder. Regístrate ahora y asegura tu lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {webinars.map((webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))}
        </div>
      </div>
    </section>
  );
} 