'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WelcomeToEgrowSection() {
  const { user } = useAuth();
  const [hasAnyCourses, setHasAnyCourses] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkUserCourses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkUserCourses = async () => {
    try {
      const response = await fetch('/api/user/courses');
      if (response.ok) {
        const data = await response.json();
        setHasAnyCourses(data.courses && data.courses.length > 0);
      }
    } catch (error) {
      console.error('Error checking user courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Solo mostrar para usuarios autenticados que NO tengan cursos
  if (!user || loading || hasAnyCourses) {
    return null;
  }

  return (
    <section className="my-courses-section">
      <div className="container">
        <div className="empty-state">
          <div className="welcome-content">
            <div className="welcome-icon">
              <div className="icon-background">
                <span className="icon">🧠</span>
              </div>
            </div>
            <h3>¡Es hora de transformar tu carrera con IA!</h3>
            <p>
              Únete a miles de profesionales que ya están dominando las herramientas de 
              inteligencia artificial más demandadas del mercado. Desde crear contenido 
              hasta automatizar procesos, tenemos el curso perfecto para ti.
            </p>
            <div className="features-grid">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Aprendizaje práctico</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <span>Proyectos reales</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏆</span>
                <span>Certificaciones</span>
              </div>
            </div>
            <div className="cta-buttons">
              <Link href="/courses" className="btn btn-primary">
                <span>🔥 Explorar Cursos</span>
              </Link>
              <Link href="/courses?filter=free" className="btn btn-secondary">
                <span>👀 Ver Cursos Gratuitos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .my-courses-section {
          padding: 2rem 0;
          background: #f9fafb;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 2.5rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
        }

        .welcome-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .welcome-icon {
          margin-bottom: 1.5rem;
        }

        .icon-background {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #5a6fd8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .icon {
          font-size: 2.5rem;
        }

        .empty-state h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 1rem 0;
          line-height: 1.3;
        }

        .empty-state p {
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 2rem 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0.75rem;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
          background: #f3f4f6;
        }

        .feature-icon {
          font-size: 1.5rem;
        }

        .feature span:last-child {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          min-width: 160px;
        }

        .btn-primary {
          background: #667eea;
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
          background: #5a6fd8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .btn-secondary:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 768px) {
          .my-courses-section {
            padding: 1.5rem 0;
          }

          .empty-state {
            padding: 2rem 1.5rem;
          }

          .empty-state h3 {
            font-size: 1.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin: 1rem 0;
          }

          .feature {
            padding: 0.875rem 0.75rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }

          .btn {
            width: 100%;
            max-width: 240px;
            padding: 0.75rem 1rem;
          }

          .icon-background {
            width: 70px;
            height: 70px;
          }

          .icon {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}