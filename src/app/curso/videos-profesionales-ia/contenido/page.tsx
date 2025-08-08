"use client";

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContenidoVideosProfesionalesIAPage() {
  return (
    <>
      <Navbar />
      <main>
        <section>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-4">Contenido en mantenimiento</h1>
              <p className="text-gray-600">Estamos optimizando esta página para mejorar el rendimiento del build.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


