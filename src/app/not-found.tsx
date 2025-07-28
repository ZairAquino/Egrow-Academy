'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DynamicLogo from '@/components/ui/DynamicLogo';
import Footer from '@/components/layout/Footer';
import DynamicSEO from '@/components/seo/DynamicSEO';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página principal después de 5 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      {/* SEO para página de error */}
      <DynamicSEO 
        title="Página no encontrada - eGrow Academy"
        description="Lo sentimos, la página que buscas no existe. Regresa al inicio de eGrow Academy para encontrar los mejores cursos de Inteligencia Artificial."
        keywords={[
          "eGrow Academy",
          "cursos de inteligencia artificial",
          "página no encontrada",
          "error 404"
        ]}
        errorPage={true}
        noindex={true}
        canonical="https://egrow-academy.com"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2">
              <DynamicLogo className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">eGrow Academy</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ir al Inicio
            </Link>

            <div className="text-sm text-gray-500">
              Serás redirigido automáticamente en 5 segundos...
            </div>
          </div>

          {/* Popular Pages */}
          <div className="mt-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Páginas populares</h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/courses"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Ver todos los cursos
              </Link>
              <Link
                href="/cursos-gratuitos"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Cursos gratuitos
              </Link>
              <Link
                href="/contacto"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
} 