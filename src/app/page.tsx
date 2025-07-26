'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Hero from '@/components/layout/Hero';
import CompaniesMarquee from '@/components/ui/CompaniesMarquee';
import FeaturedCourses from '@/components/courses/FeaturedCourses';
import Newsletter from '@/components/ui/Newsletter';
import WhyChoose from '@/components/ui/WhyChoose';
import Footer from '@/components/layout/Footer';
import { WelcomeModal } from '@/lib/lazy-components';
import DynamicSEO from '@/components/seo/DynamicSEO';


function HomeContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

      {/* UserProfile fijo en esquina superior derecha */}
      <UserProfile className="user-profile-fixed" />
      
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Modal de bienvenida */}
      <Suspense fallback={<div>Loading...</div>}>
        <WelcomeModal 
          isOpen={showSuccessNotification} 
          onClose={() => setShowSuccessNotification(false)} 
        />
      </Suspense>
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Hero />
        <CompaniesMarquee />
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
