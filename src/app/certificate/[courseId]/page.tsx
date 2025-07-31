'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

interface Certificate {
  id: string;
  courseId: string;
  userId: string;
  courseTitle: string;
  userName: string;
  completedAt: Date;
  certificateNumber: string;
  hasCertificate: boolean;
}

export default function CertificatePage() {
  const { user, status } = useAuth();
  const params = useParams();
  const courseId = params.courseId as string;
  
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  // Cargar certificado
  useEffect(() => {
    const loadCertificate = async () => {
      if (status !== 'authenticated' || !user || !courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/courses/certificate?courseId=${courseId}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setCertificate(data.certificate);
        } else {
          setError('No se pudo cargar el certificado');
        }
      } catch (error) {
        console.error('Error loading certificate:', error);
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificate();
  }, [user, status, courseId]);


  // Redirigir si no está autenticado
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Requerido</h1>
          <p className="mb-4">Necesitas iniciar sesión para ver tu certificado.</p>
          <Link href="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar  />
      
      
      <main className="main-content pt-16">
        {/* Hero Section */}
        <section className="hero gradient-bg">
          <img
            src="/images/background.png"
            alt="Header background"
            className="hero-background"
          />
          
          <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            <div className="hero-content">
              <h1 className="hero-title">
                Certificado de Finalización
                <span className="block">¡Felicitaciones!</span>
              </h1>
              <p className="hero-description">
                Has completado exitosamente el curso. Descarga tu certificado y compártelo.
              </p>
            </div>
          </div>
        </section>

        {/* Certificate Section */}
        <section className="section">
          <div className="container">
            {isLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>Generando tu certificado...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <Link href="/my-courses" className="btn btn-secondary">
                  Volver a Mis Cursos
                </Link>
              </div>
            ) : certificate ? (
              <div className="certificate-container">
                {/* Certificate Display */}
                <div className="certificate-preview">
                  <div className="certificate-content">
                    <div className="certificate-header">
                      <div className="logo-section">
                        <img 
                          src="/images/egacademylogoblanco.png" 
                          alt="eGrow Academy" 
                          className="logo"
                        />
                        <h2>eGrow Academy</h2>
                      </div>
                      <div className="certificate-title">
                        <h1>Certificado de Finalización</h1>
                        <p>Se otorga este certificado a</p>
                      </div>
                    </div>

                    <div className="certificate-body">
                      <h3 className="student-name">{certificate.userName}</h3>
                      <p className="completion-text">
                        por haber completado exitosamente el curso
                      </p>
                      <h4 className="course-title">{certificate.courseTitle}</h4>
                      
                      <div className="certificate-details">
                        <div className="detail-item">
                          <span className="label">Fecha de Finalización:</span>
                          <span className="value">
                            {new Date(certificate.completedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Número de Certificado:</span>
                          <span className="value">{certificate.certificateNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="certificate-footer">
                      <div className="signature-section">
                        <div className="signature-line"></div>
                        <p>Director de eGrow Academy</p>
                      </div>
                      <div className="verification-section">
                        <p>Verificar en: egrow-academy.com/certificate/{certificate.certificateNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Actions */}
                <div className="certificate-actions">
                  <button 
                    onClick={() => window.print()} 
                    className="btn btn-primary"
                  >
                    🖨️ Imprimir Certificado
                  </button>
                  
                  <button 
                    onClick={() => {
                      // Función para descargar PDF (implementar después)
                      alert('Función de descarga próximamente disponible');
                    }} 
                    className="btn btn-secondary"
                  >
                    📥 Descargar PDF
                  </button>
                  
                  <button 
                    onClick={() => {
                      // Función para compartir en redes sociales
                      if (navigator.share) {
                        navigator.share({
                          title: `Certificado: ${certificate.courseTitle}`,
                          text: `¡He completado el curso ${certificate.courseTitle} en eGrow Academy!`,
                          url: window.location.href
                        });
                      } else {
                        // Fallback: copiar URL al portapapeles
                        navigator.clipboard.writeText(window.location.href);
                        alert('URL del certificado copiada al portapapeles');
                      }
                    }} 
                    className="btn btn-outline"
                  >
                    📤 Compartir
                  </button>
                  
                  <Link href="/my-courses" className="btn btn-outline">
                    📚 Volver a Mis Cursos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏆</div>
                <h3>Certificado no encontrado</h3>
                <p>No se encontró un certificado para este curso.</p>
                <Link href="/my-courses" className="btn btn-primary">
                  Ver Mis Cursos
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .certificate-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .certificate-preview {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 2rem;
          border: 2px solid #e5e7eb;
        }

        .certificate-content {
          padding: 3rem;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          position: relative;
        }

        .certificate-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23e5e7eb" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23e5e7eb" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .certificate-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .logo-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .certificate-title h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .certificate-title p {
          font-size: 1.125rem;
          color: #6b7280;
          margin: 0;
        }

        .certificate-body {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .student-name {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }

        .completion-text {
          font-size: 1.125rem;
          color: #6b7280;
          margin: 0 0 1rem 0;
        }

        .course-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #667eea;
          margin: 0 0 2rem 0;
        }

        .certificate-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .detail-item {
          text-align: left;
        }

        .label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .value {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #1f2937;
        }

        .certificate-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 3rem;
          position: relative;
          z-index: 1;
        }

        .signature-section {
          text-align: center;
        }

        .signature-line {
          width: 200px;
          height: 2px;
          background: #1f2937;
          margin-bottom: 0.5rem;
        }

        .signature-section p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .verification-section p {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }

        .certificate-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-outline {
          background: transparent;
          color: #667eea;
          border: 1px solid #667eea;
        }

        .btn-outline:hover {
          background: #667eea;
          color: white;
        }

        .loading-container,
        .error-container,
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 1rem;
        }

        @media print {
          .certificate-actions,
          .hero,
          .sidebar,
          .user-profile-top-right,
          .footer {
            display: none !important;
          }

          .certificate-preview {
            box-shadow: none;
            border: none;
          }

          .certificate-content {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .certificate-content {
            padding: 2rem 1rem;
          }

          .certificate-title h1 {
            font-size: 2rem;
          }

          .student-name {
            font-size: 1.5rem;
          }

          .certificate-details {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .certificate-footer {
            flex-direction: column;
            gap: 2rem;
            align-items: center;
          }

          .certificate-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
          }
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -1;
        }
      `}</style>
    </>
  );
} 