'use client';

import React from 'react';
import { Webinar } from '@/types/webinar';
import WebinarCard from './WebinarCard';

interface WebinarTabsProps {
  featuredWebinars: Webinar[];
  upcomingWebinars: Webinar[];
  pastWebinars: Webinar[];
  allWebinars: Webinar[];
}

export default function WebinarTabs({ 
  featuredWebinars, 
  upcomingWebinars, 
  pastWebinars, 
  allWebinars 
}: WebinarTabsProps) {
  // Mostrar todos los webinars activos
  const allActiveWebinars = [...featuredWebinars, ...upcomingWebinars, ...pastWebinars];

  return (
    <div className="webinar-tabs">
      {/* Contenido de webinars */}
      <div className="tab-content">
        {allActiveWebinars.length > 0 ? (
          <div className="webinars-grid">
            {allActiveWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3 className="empty-title">No hay webinars disponibles</h3>
            <p className="empty-description">
              No hay webinars disponibles en este momento.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .webinar-tabs {
          width: 100%;
        }

        .tab-content {
          min-height: 400px;
        }

        .webinars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #f9fafb;
          border-radius: 12px;
          border: 2px dashed #d1d5db;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.5rem 0;
        }

        .empty-description {
          color: #6b7280;
          margin: 0;
          max-width: 400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .webinars-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .empty-state {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
} 