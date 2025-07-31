'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/layout/Hero';
import CompaniesMarquee from '@/components/ui/CompaniesMarquee';
import FeaturedCourses from '@/components/courses/FeaturedCourses';
import Newsletter from '@/components/ui/Newsletter';
import WhyChoose from '@/components/ui/WhyChoose';
import Footer from '@/components/layout/Footer';
import ClientOnly from '@/components/ClientOnly';
import Navbar from '@/components/layout/Navbar';
import { RecommendationsSection } from '@/components/ui/RecommendationsSection';

import WelcomeModal from '@/components/ui/WelcomeModal';
import DynamicSEO from '@/components/seo/DynamicSEO';
import PromotionBannerWrapper from '@/components/PromotionBannerWrapper';


function HomeContent() {
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  // Efecto para mostrar notificación de pago exitoso y refrescar usuario
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    if (paymentSuccess === 'true') {
      setShowSuccessNotification(true);
      
      // Refrescar la información del usuario después del pago exitoso
      refreshUser();
      
      // Ocultar la notificación después de 5 segundos
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]); // Removemos refreshUser de las dependencias



  return (
    <>
      {/* SEO Dinámico para la página principal */}
      <DynamicSEO 
        title="eGrow Academy - Cursos de Inteligencia Artificial | Líder en México y Latinoamérica"
        description="Aprende Inteligencia Artificial con los mejores cursos online en español. Formación profesional en IA, Machine Learning, Deep Learning y más. Líder en México y Latinoamérica."
        keywords={[
          "cursos de inteligencia artificial",
          "cursos de IA",
          "machine learning México",
          "deep learning México",
          "inteligencia artificial México",
          "cursos de IA en español",
          "formación en inteligencia artificial",
          "aprender IA",
          "cursos online de inteligencia artificial",
          "especialización en IA"
        ]}
        type="website"
      />

      <ClientOnly>
        <Navbar />
      </ClientOnly>


      
      {/* Modal de bienvenida */}
      <ClientOnly>
        <WelcomeModal 
          isOpen={showSuccessNotification} 
          onClose={() => setShowSuccessNotification(false)} 
        />
      </ClientOnly>
      
      <main className="main-content pt-16">
        <Hero />
        
        {/* Banner Promocional - Posición elegante después del Hero */}
        <div className="w-full bg-gradient-to-b from-white to-gray-50 py-8">
          <PromotionBannerWrapper />
        </div>
        
        <CompaniesMarquee />
        
        {/* Sección de Recomendaciones Personalizadas */}
        <RecommendationsSection 
          title="Recomendado para ti"
          limit={6}
          showReason={true}
          className="bg-gray-50"
        />
        
        <FeaturedCourses />
        <WhyChoose />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}