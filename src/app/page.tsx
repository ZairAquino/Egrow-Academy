'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/layout/Hero';
import HeroV2 from '@/components/layout/HeroV2';
import { FEATURE_FLAGS } from '@/lib/config';
import CompaniesMarquee from '@/components/ui/CompaniesMarquee';
import FeaturedCourses from '@/components/courses/FeaturedCourses';
import CourseBenefits from '@/components/courses/CourseBenefits';
import Newsletter from '@/components/ui/Newsletter';
import Footer from '@/components/layout/Footer';
import ClientOnly from '@/components/ClientOnly';
import Navbar from '@/components/layout/Navbar';
import { RecommendationsSection } from '@/components/ui/RecommendationsSection';
import WelcomeBannerSection from '@/components/welcome/WelcomeBannerSection';
import WelcomeToEgrowSection from '@/components/welcome/WelcomeToEgrowSection';
import MyCourses from '@/components/courses/MyCourses';
import PersonalizedRecommendations from '@/components/courses/PersonalizedRecommendations';

import WelcomeModal from '@/components/ui/WelcomeModal';
import DynamicSEO from '@/components/seo/DynamicSEO';
import PromotionBannerWrapper from '@/components/PromotionBannerWrapper';
import FacebookPixelTracker from '@/components/analytics/FacebookPixelTracker';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';


function HomeContent() {
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const searchParams = useSearchParams();
  const { user, status, refreshUser } = useAuth();
  const { trackEvent, trackFunnel, isUserLoggedIn } = useFacebookPixel();
  const isAuthenticated = status === 'authenticated' && user;

  // Debug temporal para verificar el flag del hero
  useEffect(() => {
    console.log('🏠 Página principal - FEATURE_FLAGS.HERO_V2:', FEATURE_FLAGS.HERO_V2);
    console.log('🔧 Variable de entorno NEXT_PUBLIC_HERO_V2:', process.env.NEXT_PUBLIC_HERO_V2);
  }, []);

  // Efecto para mostrar notificación de pago exitoso y refrescar usuario
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    if (paymentSuccess === 'true') {
      setShowSuccessNotification(true);
      
      // Refrescar la información del usuario después del pago exitoso
      refreshUser();
      
      // Trackear evento de pago exitoso
      trackEvent('Purchase', {
        content_name: 'Payment Success',
        content_category: 'Payment',
        content_type: 'payment_success',
        value: 0, // Valor será actualizado cuando tengamos datos reales
        currency: 'USD'
      });
      
      // Ocultar la notificación después de 5 segundos
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, refreshUser, trackEvent]);

  // Trackear eventos de engagement en la página de inicio
  useEffect(() => {
    // Trackear visualización de página de inicio
    trackEvent('ViewContent', {
      content_name: 'eGrow Academy Homepage',
      content_category: 'Homepage',
      content_type: 'homepage',
      custom_parameters: {
        page_section: 'main',
        user_status: isUserLoggedIn ? 'logged_in' : 'anonymous'
      }
    });

    // Trackear funnel de conversión - paso 1: visualización
    trackFunnel('view', {
      content_name: 'eGrow Academy Homepage',
      content_category: 'Homepage',
      custom_parameters: {
        funnel_step: 'homepage_view',
        user_status: isUserLoggedIn ? 'logged_in' : 'anonymous'
      }
    });
  }, [trackEvent, trackFunnel, isUserLoggedIn]);

  return (
    <>
      {/* Facebook Pixel Tracking para página de inicio */}
      <FacebookPixelTracker 
        trackPageView={true}
        pageData={{
          content_name: 'eGrow Academy Homepage',
          content_category: 'Homepage',
          content_type: 'homepage',
          custom_parameters: {
            page_section: 'main',
            user_status: isUserLoggedIn ? 'logged_in' : 'anonymous'
          }
        }}
        customEvents={[
          {
            event: 'ViewContent',
            data: {
              content_name: 'eGrow Academy Homepage',
              content_category: 'Homepage',
              content_type: 'homepage'
            },
            delay: 1000 // Delay de 1 segundo para asegurar que la página esté cargada
          }
        ]}
      />

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
        {isAuthenticated ? (
          /* Contenido para usuarios autenticados */
          <>
            {FEATURE_FLAGS.HERO_V2 ? <HeroV2 /> : <Hero />}
            
            {/* Banner Promocional y Mensaje de Bienvenida */}
            <WelcomeBannerSection />
            
            <CompaniesMarquee />
            
            {/* Sección de Bienvenida para usuarios sin cursos */}
            <WelcomeToEgrowSection />
            
            {/* Mis Cursos - Cursos en progreso del usuario */}
            <MyCourses />
            
            {/* Cursos Destacados */}
            <FeaturedCourses />
            
            {/* Beneficios de los Cursos */}
            <CourseBenefits />
            
            {/* Recomendaciones Personalizadas */}
            <PersonalizedRecommendations />
            
            {/* Newsletter de Webinars */}
            <Newsletter />
          </>
        ) : (
          /* Contenido para usuarios no autenticados (original) */
          <>
            {FEATURE_FLAGS.HERO_V2 ? <HeroV2 /> : <Hero />}
            
            {/* Banner Promocional y Mensaje de Bienvenida */}
            <WelcomeBannerSection />
            
            <CompaniesMarquee />
            
            {/* Sección de Recomendaciones Personalizadas - Temporalmente deshabilitada */}
            {/* <RecommendationsSection 
              title="Recomendado para ti"
              limit={6}
              showReason={true}
              className="bg-gray-50"
            /> */}
            
            <FeaturedCourses />
            
            {/* Beneficios de los Cursos */}
            <CourseBenefits />
            
            <Newsletter />
          </>
        )}
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