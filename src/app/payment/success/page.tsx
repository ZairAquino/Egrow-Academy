'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '@/components/layout/Footer';

export default function PaymentSuccessPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
    setIsLoadingSession(false);
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/images/Logo2.png" alt="eGrow Academy" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gray-900">eGrow Academy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-8">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tu suscripción a eGrow Academy ha sido activada correctamente
            </p>

            {/* Session ID */}
            {sessionId && (
              <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">ID de Sesión:</p>
                <p className="font-mono text-sm text-gray-800 break-all">{sessionId}</p>
              </div>
            )}

            {/* Welcome Message */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a eGrow Academy Premium!
              </h2>
              <p className="text-gray-600 mb-6">
                Ahora tienes acceso completo a todos nuestros cursos especializados y recursos premium.
                Tu viaje de aprendizaje comienza ahora.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">Acceso a todos los cursos especializados</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">Certificados de finalización</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">Soporte técnico prioritario</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">Comunidad exclusiva</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Explorar Cursos
              </Link>
              <Link
                href="/my-courses"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
              >
                Mis Cursos
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Qué sigue?
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• Recibirás un email de confirmación con los detalles de tu suscripción</li>
                <li>• Puedes acceder a tus cursos desde "Mis Cursos" en cualquier momento</li>
                <li>• Tu suscripción se renovará automáticamente según el plan elegido</li>
                <li>• Puedes cancelar tu suscripción desde tu perfil en cualquier momento</li>
              </ul>
            </div>

            {/* Support */}
            <div className="mt-8">
              <p className="text-gray-600 mb-4">
                ¿Tienes alguna pregunta? Nuestro equipo de soporte está aquí para ayudarte.
              </p>
              <Link
                href="/contacto"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contactar Soporte →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
} 