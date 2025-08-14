'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import VideoPlayer from '@/components/courses/VideoPlayer';

import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { renderToolIcon, renderUiIcon } from '@/lib/tool-icons';

// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function MockupCeroPage() {
  console.log('🔍 [DEBUG] Componente MockupCeroPage cargado');
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentReviewSlide, setCurrentReviewSlide] = useState(0);
  const [showMainVideo, setShowMainVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [showStickyNavbar, setShowStickyNavbar] = useState(false);
  const [stickyOpacity, setStickyOpacity] = useState(0);
  const stickyTriggerRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLElement | null>(null);
  const reviewsTrackRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const reviewSlidesCount = 3; // 6 testimonios, 2 por slide
  const { user, status } = useAuth();
  const { hasPremiumAccess, isLoading: subscriptionLoading } = useSubscriptionStatus();
  const router = useRouter();
  
  console.log('🔍 [DEBUG] Estados iniciales:', { 
    currentLesson, 
    completedLessons: completedLessons.length,
    progressPercentage,
    isLoading,
    user: !!user,
    userDetails: user ? { id: user.id, email: user.email } : null,
    authStatus: status
  });

  // Función para inscribir e ir al contenido del curso
  const goToCourseContent = async () => {
    console.log('[MOCKUP-PAGE] Botón clickeado - Estado de autenticación:', { 
      user: !!user, 
      status, 
      userEmail: user?.email,
      userId: user?.id,
      hasPremiumAccess
    });
    
    // Verificar si el usuario está autenticado
    if (status === 'loading' || subscriptionLoading) {
      console.log('⏳ [MOCKUP-PAGE] Estado de autenticación cargando, esperando...');
      return;
    }
    
    if (!user || status === 'unauthenticated') {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/mockup-cero/contenido`;
      console.log(`[MOCKUP-PAGE] Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    if (!hasPremiumAccess) {
      // Si el usuario no tiene acceso premium, redirigir a suscripción
      console.log(`[MOCKUP-PAGE] Usuario no tiene acceso premium - Redirigiendo a suscripción`);
      router.push('/subscription');
      return;
    }
    
    // Si el usuario está logueado y tiene premium, inscribirlo automáticamente y redirigir
    console.log(`[MOCKUP-PAGE] Usuario logueado con premium (${user.email}) - Inscribiendo y redirigiendo...`);
    
    try {
      console.log('🔄 [MOCKUP-PAGE] Iniciando inscripción automática...');
      
      // Inscribir automáticamente al usuario
      const enrollResponse = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: courseData.id }),
        credentials: 'include',
      });
      
      console.log('📡 [MOCKUP-PAGE] Respuesta de inscripción:', { 
        status: enrollResponse.status, 
        ok: enrollResponse.ok 
      });
      
      if (enrollResponse.ok) {
        const enrollData = await enrollResponse.json();
        console.log('[MOCKUP-PAGE] Usuario inscrito automáticamente:', enrollData);
      } else {
        const errorData = await enrollResponse.text();
        console.error('⚠️ [MOCKUP-PAGE] Error al inscribir:', { 
          status: enrollResponse.status, 
          error: errorData 
        });
      }
    } catch (error) {
      console.error('❌ [MOCKUP-PAGE] Error en inscripción automática:', error);
    }
    
    // Redirigir al contenido del curso independientemente del resultado de la inscripción
    const contentUrl = '/curso/mockup-cero/contenido';
    console.log(`🔄 [MOCKUP-PAGE] Redirigiendo a: ${contentUrl}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = contentUrl;
    }
  };

  const handleVideoPreviewClick = () => {
    setShowMainVideo(!showMainVideo);
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    setVideoCurrentTime(currentTime);
  };

  const courseData = {
    id: 'mockup-cero',
    title: 'Crea Mockups con IA desde cero',
    description: 'Aprende a presentar ideas, productos y servicios de manera visual y profesional sin experiencia previa en diseño. Domina herramientas de IA como ChatGPT, Canva y Sora para crear mockups modernos en formatos web, móvil, producto y redes sociales. Incluye prompts listos para usar y un mini portafolio al finalizar.',
    mainVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '5 horas',
    level: 'Principiante',
    difficulty: 'Principiante',
    categoryText: 'Premium • Certificado digital incluido',
    category: 'Diseño y Mockups',
    price: 'Premium - $97',
    language: 'Español',
    image: '/images/19.png',
    lessonsCount: 10,
    instructor: {
      name: 'eGrow Academy',
      title: 'Especialista en Diseño y Mockups con IA - eGrow Academy',
      image: '/images/Rick.png',
      bio: 'Experto en diseño de mockups y prototipado con herramientas de IA, con más de 4 años de experiencia en diseño digital y UX/UI.'
    },
    prerequisites: [
      'Manejo básico de internet.',
      'Tener cuentas activas en Canva, Sora (generador de video IA) y acceso a ChatGPT.',
      'Computadora con navegador actualizado.'
    ],
    whatYouWillLearn: [
      'Fundamentos del diseño de mockups',
      'Uso de herramientas de IA para mockups',
      'Creación de mockups para sitios web',
      'Diseño de mockups para aplicaciones móviles',
      'Mockups de productos y branding',
      'Presentaciones profesionales con Sora',
      'Técnicas de prototipado rápido',
      'Mejores prácticas del diseño UX/UI'
    ],
    tools: [
      'Figma con IA',
      'Adobe XD',
      'Canva Pro',
      'Midjourney',
      'DALL-E 3',
      'Sora (OpenAI)',
      'Framer',
      'Sketch'
    ],
    lessons: [
      {
        id: 1,
        title: 'MÓDULO 1: Introducción al Mockup',
        description: 'Comprende los fundamentos del diseño de mockups, su importancia en el proceso de diseño y las herramientas de IA disponibles.',
        duration: 50,
        type: 'Video',
        lessonsCount: 3,
        subLessons: [
          {
            id: '1.1',
            title: 'Qué es un mockup y por qué importa',
            description: 'Introducción al concepto de mockup, diferencia con wireframes y prototipos, y su importancia en el proceso de diseño.',
            content: 'Aprenderás qué es exactamente un mockup, cómo se diferencia de otras herramientas de diseño y por qué es fundamental para presentar ideas de manera profesional.',
            deliverable: 'primer mockup básico de práctica.',
            duration: 15,
            type: 'Video'
          },
          {
            id: '1.2',
            title: 'Panorama de herramientas de IA para mockups',
            description: 'Exploración de las principales herramientas de IA disponibles para crear mockups: ventajas, limitaciones y casos de uso.',
            content: 'Conocerás las herramientas más potentes del mercado, desde Canva AI hasta Midjourney, y aprenderás cuándo usar cada una.',
            deliverable: 'tabla comparativa de herramientas.',
            duration: 20,
            type: 'Video'
          },
          {
            id: '1.3',
            title: 'Configuración del entorno de trabajo',
            description: 'Preparación de cuentas, instalación de herramientas y organización del flujo de trabajo para máxima productividad.',
            content: 'Configurarás todas las herramientas necesarias y aprenderás a organizar tu espacio de trabajo digital para crear mockups eficientemente.',
            deliverable: 'entorno de trabajo listo y organizado.',
            duration: 15,
            type: 'Práctica'
          }
        ]
      },
      {
        id: 2,
        title: 'MÓDULO 2: Fundamentos de diseño y mockups web',
        description: 'Domina los principios básicos del diseño y aprende a crear mockups profesionales para sitios web responsive.',
        duration: 75,
        type: 'Lab',
        lessonsCount: 4,
        subLessons: [
          {
            id: '2.1',
            title: 'Principios básicos de diseño visual',
            description: 'Color, tipografía, espaciado y jerarquía visual aplicados a mockups. Reglas fundamentales del buen diseño.',
            content: 'Dominarás los principios fundamentales del diseño que harán que tus mockups se vean profesionales y atractivos.',
            deliverable: 'guía de estilo personal.',
            duration: 20,
            type: 'Video'
          },
          {
            id: '2.2',
            title: 'Estructura y componentes web con IA',
            description: 'Generación de layouts, headers, footers y componentes web usando prompts de IA efectivos.',
            content: 'Aprenderás a usar IA para generar rápidamente estructuras web completas y componentes reutilizables.',
            deliverable: 'biblioteca de componentes web.',
            duration: 20,
            type: 'Práctica'
          },
          {
            id: '2.3',
            title: 'Mockup de landing page completa',
            description: 'Creación paso a paso de una landing page profesional usando Canva AI y ChatGPT para el contenido.',
            content: 'Crearás tu primera landing page completa, desde el concepto hasta el mockup final listo para presentar.',
            deliverable: 'landing page completa en mockup.',
            duration: 25,
            type: 'Práctica'
          },
          {
            id: '2.4',
            title: 'Adaptación responsive y variantes',
            description: 'Cómo adaptar tus mockups web para móvil, tablet y desktop. Crear variantes para A/B testing.',
            content: 'Aprenderás a crear versiones responsive de tus diseños y múltiples variantes para testing.',
            deliverable: '3 versiones responsive del mockup.',
            duration: 10,
            type: 'Video'
          }
        ]
      },
      {
        id: 3,
        title: 'MÓDULO 3: Mockups móviles, productos y presentaciones con Sora',
        description: 'Especialízate en mockups para apps móviles, productos físicos y crea presentaciones dinámicas con Sora AI.',
        duration: 90,
        type: 'Project',
        lessonsCount: 3,
        subLessons: [
          {
            id: '3.1',
            title: 'Diseño de interfaces móviles con IA',
            description: 'Creación de mockups para aplicaciones iOS y Android. Patrones de diseño móvil y mejores prácticas.',
            content: 'Diseñarás interfaces móviles modernas y funcionales, siguiendo las guías de diseño de iOS y Material Design.',
            deliverable: 'mockup completo de app móvil.',
            duration: 30,
            type: 'Práctica'
          },
          {
            id: '3.2',
            title: 'Mockups de productos y branding',
            description: 'Usar Midjourney y DALL-E para crear mockups de productos físicos, packaging y material de marca.',
            content: 'Aprenderás a presentar productos físicos de manera profesional y crear todo el material de branding asociado.',
            deliverable: 'suite completa de mockups de producto.',
            duration: 35,
            type: 'Práctica'
          },
          {
            id: '3.3',
            title: 'Presentaciones dinámicas con Sora',
            description: 'Convierte tus mockups estáticos en presentaciones de video impactantes usando Sora AI.',
            content: 'Transformarás tus mockups en videos profesionales que cautivarán a clientes e inversores.',
            deliverable: 'video presentación de 60 segundos.',
            duration: 25,
            type: 'Project'
          }
        ]
      }
    ]
  };

  // Calcular duración total
  const totalDuration = courseData.lessons.reduce((total, lesson) => {
    return total + lesson.duration;
  }, 0);

  // Efectos para manejar el progreso del usuario
  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect [user, status] ejecutado');
    console.log('🔍 [DEBUG] Estado del usuario:', { user: !!user, userId: user?.id, status });
    
    if (user && status === 'authenticated') {
      console.log('🔍 [DEBUG] Usuario autenticado detectado, cargando progreso');
      loadUserProgress();
    } else if (status === 'unauthenticated' || (!user && status !== 'loading')) {
      console.log('🔍 [DEBUG] Usuario no autenticado, estableciendo isLoading = false');
      setIsLoading(false);
    } else {
      console.log('🔍 [DEBUG] Estado de autenticación en progreso...');
    }
  }, [user, status]);

  // Contador de tiempo para la oferta (cuenta regresiva desde 1h 54m)
  useEffect(() => {
    const countdownMs = ((1 * 60) + 54) * 60 * 1000; // 1 hora y 54 minutos en milisegundos
    const endDate = new Date(Date.now() + countdownMs);

    const calculateTimeLeft = () => {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days: 0, hours, minutes, seconds });
      return true;
    };

    const timer = window.setInterval(() => {
      const stillRunning = calculateTimeLeft();
      if (!stillRunning) {
        window.clearInterval(timer);
      }
    }, 1000);

    calculateTimeLeft();
    return () => window.clearInterval(timer);
  }, []);

  // Auto-play del carrusel de opiniones
  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentReviewSlide((prev) => (prev + 1) % reviewSlidesCount);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  // Aplicar transform al track cuando cambie el slide
  useEffect(() => {
    if (reviewsTrackRef.current) {
      reviewsTrackRef.current.style.transform = `translateX(-${currentReviewSlide * 100}%)`;
    }
  }, [currentReviewSlide]);

  // Mostrar navbar sticky a partir de Objetivos y desvanecer antes de Opiniones
  useEffect(() => {
    const handleScroll = () => {
      const trigger = stickyTriggerRef.current;
      if (!trigger) {
        console.log('🚨 [STICKY DEBUG] No trigger found');
        return;
      }
      const triggerTop = trigger.getBoundingClientRect().top;
      const passedObjectives = triggerTop <= 0;

      const reviewsEl = reviewsRef.current;
      let opacity = 0;
      if (passedObjectives) {
        // Calcular desvanecimiento al acercarse a Opiniones
        const reviewsTop = reviewsEl ? reviewsEl.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
        const fadeStart = 240; // px antes de llegar a Opiniones
        const fadeEnd = 40;    // px del tope donde ya debe estar casi oculto
        if (reviewsTop === Number.POSITIVE_INFINITY) {
          opacity = 1;
        } else if (reviewsTop <= fadeEnd) {
          opacity = 0;
        } else if (reviewsTop < fadeStart) {
          opacity = Math.max(0, Math.min(1, (reviewsTop - fadeEnd) / (fadeStart - fadeEnd)));
        } else {
          opacity = 1;
        }
      }

      console.log('🔍 [STICKY DEBUG]', {
        triggerTop,
        passedObjectives,
        opacity,
        showStickyNavbar: passedObjectives && opacity > 0.01
      });

      setStickyOpacity(opacity);
      setShowStickyNavbar(passedObjectives && opacity > 0.01);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true } as any);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (user && status === 'authenticated') {
        loadUserProgress();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user && status === 'authenticated') {
        loadUserProgress();
      }
    };

    const handlePopState = () => {
      if (user && status === 'authenticated') {
        loadUserProgress();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user, status]);

  const loadUserProgress = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/user/progress?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCompletedLessons(data.completedLessons || []);
        setCurrentLesson(data.currentLesson || 0);
        setProgressPercentage(data.progressPercentage || 0);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingTime = () => {
    if (completedLessons.length === 0) {
      return `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}min`;
    }
    
    const remainingLessons = courseData.lessonsCount - completedLessons.length;
    const averageTimePerLesson = totalDuration / courseData.lessonsCount;
    const totalRemainingTime = remainingLessons * averageTimePerLesson;
    
    const hours = Math.floor(totalRemainingTime / 60);
    const minutes = Math.round(totalRemainingTime % 60);
    return `${hours}h ${minutes}min`;
  };

  // Mapeo de las lecciones por módulo para determinar si un módulo está completado
  const getModuleLessons = (moduleId: number): string[] => {
    const lessonsByModule: Record<number, string[]> = {
      1: ['mock1.1', 'mock1.2', 'mock1.3'],
      2: ['mock2.1', 'mock2.2', 'mock2.3', 'mock2.4'],
      3: ['mock3.1', 'mock3.2', 'mock3.3']
    };
    return lessonsByModule[moduleId] || [];
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    const moduleLessons = getModuleLessons(moduleId);
    return moduleLessons.every(lessonId => completedLessons.includes(lessonId));
  };

  // Calcular módulos completados (hay 3 módulos en total)
  const getCompletedModulesCount = (): number => {
    let completedCount = 0;
    for (let moduleId = 1; moduleId <= 3; moduleId++) {
      if (isModuleCompleted(moduleId)) {
        completedCount++;
      }
    }
    return completedCount;
  };

  // Calcular porcentaje de progreso basado en módulos (3 módulos total)
  const getModuleProgressPercentage = (): number => {
    const completedModules = getCompletedModulesCount();
    return Math.round((completedModules / 3) * 100);
  };

  // Función para determinar si mostrar el banner
  const shouldShowBanner = () => {
    // Mostrar banner si el usuario no está logueado
    if (!user || status === 'unauthenticated') {
      return true;
    }
    
    // Mostrar banner si el usuario está logueado pero no tiene acceso premium
    if (user && !hasPremiumAccess) {
      return true;
    }
    
    // No mostrar banner si tiene acceso premium
    return false;
  };

  const handleBannerClick = () => {
    router.push('/subscription');
  };

  const handleStickyThumbnailClick = () => {
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  console.log('🔍 [DEBUG] Renderizando componente, isLoading:', isLoading, 'authStatus:', status);
  
  // Mostrar loading mientras se verifica la autenticación o se carga el progreso
  if (status === 'loading' || isLoading || subscriptionLoading) {
    console.log('🔍 [DEBUG] Mostrando loading unificado:', { status, isLoading, subscriptionLoading });
    return (
      <div className="loading-container" suppressHydrationWarning>
        <LoadingSpinner />
        <p>Cargando...</p>
      </div>
    );
  }

  // Verificar que el estado de autenticación esté completamente cargado
  const isUserAuthenticated = user && status === 'authenticated';

  console.log('🔍 [DEBUG] Renderizando JSX principal');
  
  return (
    <>
      {/* Banner promocional exclusivo de esta página */}
      {shouldShowBanner() && (
        <div className="promo-banner" role="button" onClick={handleBannerClick}>
          <div className="promo-banner-content">
            <span className="promo-banner-message">
              Accede a todos nuestros cursos con Suscripción Plus por solo $12.49 USD/mes – ¡Oferta por tiempo limitado!
            </span>
            <div className="promo-banner-timer" aria-label="Tiempo restante de la oferta">
              {/* Si hay días, se muestran como horas acumuladas para un look compacto */}
              <span className="timer-chip">{String(timeLeft.days * 24 + timeLeft.hours).padStart(2, '0')}h</span>
              <span className="timer-chip">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span className="timer-chip">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>
      )}
      
      <Navbar />
      
      {/* Sticky Course Navbar - aparece al hacer scroll */}
      {showStickyNavbar && (
        <div className="sticky-course-navbar" style={{ opacity: stickyOpacity, transition: 'opacity 180ms ease-out' }}>
          <div className="sticky-navbar-content">
            <div className="sticky-course-info">
              <div className="sticky-video-thumbnail" onClick={handleStickyThumbnailClick}>
                <img 
                  src="/images/19.png" 
                  alt="Curso Mockup"
                />
                <div className="sticky-play-icon">
                  <svg width="12" height="14" viewBox="0 0 20 24" fill="none">
                    <path d="M0 2.4C0 1.07 1.34 0.16 2.5 0.83L18.5 11.43C19.66 12.1 19.66 13.9 18.5 14.57L2.5 23.17C1.34 23.84 0 22.93 0 21.6V2.4Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="sticky-course-title">
                <h3>Mockups con IA</h3>
                <div className="sticky-course-rating">
                  <span className="stars">★★★★★</span>
                  <span>4.9 (523)</span>
                </div>
              </div>
            </div>
            <div className="sticky-pricing">
              {/* Replicar exactamente la tarjeta de precios original completa */}
              <div className="price-card-sticky">
                {/* Opción Destacada - e Plus */}
                <div className="price-option highlight">
                  <div className="price-option-header">
                    <h3 className="price-option-title">Acceso al curso</h3>
                    <div className="price-badges">
                      <span className="price-badge plus">e Plus</span>
                    </div>
                  </div>
                  
                  <div className="price-display">
                    <div className="price-radio">
                      <input type="radio" name="pricing-sticky" id="plus-option-sticky" defaultChecked />
                      <label htmlFor="plus-option-sticky"></label>
                    </div>
                    <div className="price-main">
                      <span className="price-currency">$</span>
                      <span className="price-amount">12</span>
                      <span className="price-cents">.49</span>
                      <span className="price-period">USD/mes</span>
                    </div>
                  </div>
                  
                  <div className="price-discount">
                    <span className="discount-text">Accede a todos los cursos de eGrow Academy mientras mantengas tu suscripción.</span>
                  </div>
                  
                  <button className="price-cta primary" type="button">
                    Empezar con e Plus
                  </button>
                  
                  <div className="price-benefits">
                    <div className="benefit-item">
                      <span className="benefit-icon">✓</span>
                      <span className="benefit-text">Acceso ilimitado a todos los cursos de la plataforma</span>
                    </div>
                    <div className="benefit-item">
                      <span className="benefit-icon">✓</span>
                      <span className="benefit-text">Actualizaciones continuas y nuevo contenido</span>
                    </div>
                  </div>
                </div>
                
                {/* Opción Regular - Curso Individual */}
                <div className="price-option regular">
                  <div className="price-option-header">
                    <h3 className="price-option-title">Acceso individual</h3>
                  </div>
                  
                  <div className="price-display">
                    <div className="price-radio">
                      <input type="radio" name="pricing-sticky" id="regular-option-sticky" />
                      <label htmlFor="regular-option-sticky"></label>
                    </div>
                    <div className="price-main">
                      <span className="price-currency">$</span>
                      <span className="price-amount">4</span>
                      <span className="price-cents">.00</span>
                      <span className="price-period">USD</span>
                    </div>
                  </div>
                  
                  <div className="price-description">
                    <span className="description-text">Pago único para este curso. Acceso permanente al contenido del curso.</span>
                  </div>
                  
                  <button className="price-cta" type="button">
                    Comprar este curso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className={`main-content ${showStickyNavbar ? 'with-sticky-navbar' : ''}`}>
        {/* Hero Section - Diseño replicado */}
        <section className={`hero-section ${shouldShowBanner() ? 'with-promo' : ''}`} ref={heroSectionRef}>
          <div className="container">
            <div className="hero-card">
              <div className="hero-grid">
                <div className="hero-left">
                  <h1 className="hero-title-big">
                    Crea Mockups<br />
                    profesionales con IA<br />
                    sin experiencia previa<br />
                    en diseño
                  </h1>
                  <p className="hero-subtext">
                    Aprende a presentar ideas, productos y servicios de manera visual y profesional. Domina herramientas de IA como ChatGPT, Canva y Sora.
                  </p>
                  <button className="hero-cta" onClick={goToCourseContent}>
                    Iniciar Sesión para Comenzar
                  </button>
                </div>
                <div className="hero-right">
                  <div className="preview-box" onClick={handleVideoPreviewClick} style={{ cursor: 'pointer' }}>
                    {!showMainVideo ? (
                      <>
                        <img 
                          src="/images/19.png" 
                          alt="Vista previa del curso Mockups con IA"
                          className="preview-video"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="video-overlay">
                          <div className="play-btn">
                            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                              <path d="M0 2.4C0 1.07 1.34 0.16 2.5 0.83L18.5 11.43C19.66 12.1 19.66 13.9 18.5 14.57L2.5 23.17C1.34 23.84 0 22.93 0 21.6V2.4Z" fill="currentColor"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <VideoPlayer 
                        videoUrl={courseData.mainVideoUrl} 
                        title={courseData.title}
                        className="main-video-player"
                        startTime={videoCurrentTime}
                        onProgress={handleVideoProgress}
                      />
                    )}
                  </div>
                  {/* Stats a la derecha */}
                  <div className="hero-stats">
                    <div className="stars" aria-label="Calificación 4.9 de 5">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <span className="rating">4.9 <span className="muted">(523 valoraciones)</span></span>
                    <span className="dot" />
                    <span className="students" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="student-icon" style={{ display: 'inline-flex' }}>{renderUiIcon('estudiantes')}</span>
                      <span>3,421 estudiantes</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              {/* Main Content - Desktop */}
              <div className="main-content-area desktop-content">
                {/* Descripción del Curso (card + diseño minimal interno) */}
                <div className="course-overview-card">
                  <h2 className="desc-title">Descripción del Curso</h2>
                  <p className="desc-lead">
                    Aprende a presentar ideas, productos y servicios de manera visual y profesional sin experiencia previa en diseño. Domina herramientas de IA como ChatGPT, Canva y Sora para crear mockups modernos en formatos web, móvil, producto y redes sociales.
                  </p>
                  <div className="desc-separator" />
                  <div className="desc-body">
                    <p className="desc-paragraph">Descubrirás el poder de la IA para generar diseños profesionales sin necesidad de conocimientos técnicos avanzados.</p>
                    <p className="desc-paragraph">Aplicarás técnicas de diseño visual para crear mockups que impresionen a clientes, inversores y audiencias.</p>
                    <p className="desc-paragraph">Diseñarás presentaciones visuales para web, móvil, productos físicos y materiales de marketing.</p>
                    <p className="desc-paragraph">Aprenderás paso a paso con ejercicios prácticos, prompts probados y casos de estudio reales.</p>
                    <p className="desc-closure">Al terminar, tendrás un portafolio de mockups profesionales y las habilidades para crear presentaciones visuales impactantes.</p>
                  </div>
                </div>

                {/* Trigger para activar navbar sticky a partir de Objetivos */}
                <div ref={stickyTriggerRef} aria-hidden style={{ height: 1 }} />

                {/* What You'll Learn */}
                <div className="learning-objectives">
                  <div className="objectives-header">
                    <span className="section-badge">Objetivos</span>
                    <h2 className="objectives-title">Lo que vas a conseguir con este curso</h2>
                    <p className="section-lead">Enfocado en resultados reales: dominio técnico, flujo de trabajo claro y aplicabilidad inmediata.</p>
                  </div>

                  <div className="objectives-grid refined">
                    {courseData.whatYouWillLearn.map((objective, index) => (
                      <div key={index} className="objective-card">
                        <div className="objective-index">{index + 1}</div>
                        <p className="objective-text">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools and Technologies */}
                <div className="tools-section">
                  <h2>Herramientas y Tecnologías</h2>
                  <div className="tools-grid">
                      {courseData.tools.map((tool, index) => (
                      <div key={index} className="tool-item">
                          <span className="tool-icon" aria-hidden>{renderToolIcon(tool)}</span>
                          <span className="tool-name">{tool}</span>
                      </div>
                    ))}
                  </div>
              </div>

                {/* Contenido del Curso */}
                <div className="curriculum-section">
                  <h2>Contenido del Curso</h2>
                  <div className="curriculum-stats">
                    <div className="stat-item">
                      <span className="stat-number">{courseData.lessonsCount}</span>
                      <span className="stat-label">Lecciones</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{totalDuration}</span>
                      <span className="stat-label">Minutos</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{courseData.level}</span>
                      <span className="stat-label">Nivel</span>
                    </div>
                  </div>
                  <div className="lessons-list">
                    <div className="lessons-grid timeline">
                      {courseData.lessons.map((lesson, index) => (
                        <div key={lesson.id} className={`lesson-card ${isModuleCompleted(lesson.id) ? 'completed' : ''}`}>
                          <div className="lesson-header">
                            <div className="lesson-number">{index + 1}</div>
                            <div className="lesson-status">
                              {isModuleCompleted(lesson.id) ? '✓' : '○'}
                            </div>
                          </div>
                          <div className="lesson-content">
                            <h4 className="lesson-title">{lesson.title}</h4>
                            <p className="lesson-description">{lesson.description}</p>
                            <div className="lesson-meta">
                              <span className="lesson-type">{lesson.type}</span>
                              <span className="lesson-duration">{lesson.duration}min</span>
                            </div>
                            {lesson.videoUrl && (
                              <div className="lesson-video">
                                <VideoPlayer 
                                  videoUrl={lesson.videoUrl} 
                                  title={lesson.title}
                                  className="lesson-video-player"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Tu Instructor */}
                <div className="instructor-section presentation">
                  <h2 className="section-title">Tu Instructor</h2>
                  <div className="instructor-header">
                    <img src={courseData.instructor.image} alt={courseData.instructor.name} className="instructor-photo" />
                    <div className="header-main">
                      <div className="name-row">
                        <h3 className="instructor-name">{courseData.instructor.name}</h3>
                      </div>
                      <div className="instructor-role">{courseData.instructor.title}</div>
                      
                    </div>
                  </div>
                  <div className="instructor-description">
                    <p>{courseData.instructor.bio}</p>
                  </div>
                </div>

                {/* Prerrequisitos */}
                <div className="prerequisites-section">
                  <h2>Prerrequisitos</h2>
                  <ul className="prerequisites-list">
                    {courseData.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>

                {/* Reviews Section - Movido al contenido principal */}
                <div className="reviews-section-main" ref={reviewsRef}>
                  <h2 className="reviews-title">Opiniones</h2>
                  <p className="reviews-subtitle">Lo que dicen nuestros estudiantes</p>

                  <div className="reviews-stats-card">
                    <div className="stat"><span className="stat-icon">{renderUiIcon('estudiantes')}</span><span className="stat-value">3,421</span><span className="stat-label">Estudiantes</span></div>
                    <div className="stat"><span className="stat-icon">{renderUiIcon('opiniones')}</span><span className="stat-value">523</span><span className="stat-label">Opiniones</span></div>
                    <div className="stat"><span className="stat-icon">{renderUiIcon('valoraciones positivas')}</span><span className="stat-value stat-good">98%</span><span className="stat-label">Valoraciones positivas</span></div>
                  </div>

                  {/* Carrusel auto-avanzable con 2 tarjetas por slide */}
                  <div className="reviews-carousel">
                    <div className="reviews-track" ref={reviewsTrackRef}>
                      {/* Slide 1 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Creé mi primer mockup profesional en 2 horas. El curso es práctico, directo y con resultados inmediatos.</p>
                              <div className="testimonial-author">- María L.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Los prompts para IA me ahorraron semanas de trabajo. Ahora presento ideas como un diseñador profesional.</p>
                              <div className="testimonial-author">- Carlos M.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Slide 2 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">eGrow Academy explica todo paso a paso. Pasé de no saber nada de diseño a crear mockups para clientes.</p>
                              <div className="testimonial-author">- Ana R.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">La sección de Sora es increíble. Mis presentaciones ahora son videos profesionales que impresionan.</p>
                              <div className="testimonial-author">- Roberto S.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Slide 3 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Como emprendedor sin presupuesto para diseñador, este curso fue mi salvación. Mockups listos en minutos.</p>
                              <div className="testimonial-author">- Patricia G.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Los templates y recursos incluidos valen más que el precio del curso. Resultados profesionales garantizados.</p>
                              <div className="testimonial-author">- Miguel F.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="reviews-dots" aria-label="Paginación de testimonios">
                      {[0,1,2].map((i) => (
                        <button
                          key={i}
                          className={`dot ${currentReviewSlide === i ? 'active' : ''}`}
                          onClick={() => setCurrentReviewSlide(i)}
                          aria-label={`Ir al slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Desktop Only */}
              <div className="content-sidebar">
                {/* Price Card (scrollable) */}
                <div className="price-card-scrollable">
                  <div className="price-card">
                    {/* Opción Destacada - e Plus */}
                    <div className="price-option highlight">
                      <div className="price-option-header">
                        <h3 className="price-option-title">Acceso al curso</h3>
                        <div className="price-badges">
                          <span className="price-badge plus">e Plus</span>
            </div>
          </div>
                      
                      <div className="price-display">
                        <div className="price-radio">
                          <input type="radio" name="pricing" id="plus-option" defaultChecked />
                          <label htmlFor="plus-option"></label>
                </div>
                        <div className="price-main">
                          <span className="price-currency">$</span>
                          <span className="price-amount">12</span>
                          <span className="price-cents">.49</span>
                          <span className="price-period">USD/mes</span>
                </div>
                </div>
                      
                      <div className="price-discount">
                        <span className="discount-text">Accede a todos los cursos de eGrow Academy mientras mantengas tu suscripción.</span>
              </div>
              
                      <button className="price-cta primary" type="button">
                        Empezar con e Plus
                      </button>
                      
                      <div className="price-benefits">
                        <div className="benefit-item">
                          <span className="benefit-icon">✓</span>
                          <span className="benefit-text">Acceso ilimitado a todos los cursos de la plataforma</span>
                        </div>
                        <div className="benefit-item">
                          <span className="benefit-icon">✓</span>
                          <span className="benefit-text">Actualizaciones continuas y nuevo contenido</span>
                        </div>
                      </div>
                          </div>
                    
                    {/* Opción Regular */}
                    <div className="price-option regular">
                      <div className="price-option-header">
                        <h3 className="price-option-title">Acceso individual</h3>
                        </div>
                      
                      <div className="price-display">
                        <div className="price-radio">
                          <input type="radio" name="pricing" id="regular-option" />
                          <label htmlFor="regular-option"></label>
                </div>
                        <div className="price-main">
                          <span className="price-currency">$</span>
                          <span className="price-amount">4</span>
                          <span className="price-cents">.00</span>
                          <span className="price-period">USD</span>
                </div>
              </div>
                      
                      <div className="price-description">
                        <span className="description-text">Pago único para este curso. Acceso permanente al contenido del curso.</span>
            </div>
                      
                      <button className="price-cta" type="button">
                        Comprar este curso
                      </button>
              </div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </section>


        {/* Featured Courses Section */}
        <section className="featured-courses-section">
          <div className="container">
            <div className="featured-courses-header">
              <h2>Cursos que también te pueden interesar</h2>
              <p>Expande tus conocimientos con estos cursos populares</p>
            </div>
            
            <div className="courses-grid">
              <div className="course-card" onClick={() => router.push('/curso/videos-profesionales-ia')}>
                <div className="course-image-wrapper">
                  <img src="/images/15.png" alt="Videos Profesionales con IA" className="course-image" />
                  <span className="course-badge eplus">e Plus</span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Videos Profesionales con IA</h3>
                  <p className="course-description">Crea videos de alta calidad usando herramientas de inteligencia artificial</p>
                  <div className="course-meta">
                    <span className="course-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('duracion')}</span>
                      <span>6 horas</span>
                    </span>
                    <span className="course-level" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('nivel')}</span>
                      <span>Intermedio</span>
                    </span>
                  </div>
                  <button className="course-btn">Ver Curso</button>
                </div>
              </div>
              
              <div className="course-card" onClick={() => router.push('/curso/guiones-videos-promocionales-ia')}>
                <div className="course-image-wrapper">
                  <img src="/images/20.png" alt="Guiones con IA" className="course-image" />
                  <span className="course-badge eplus">e Plus</span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Guiones con IA para Videos</h3>
                  <p className="course-description">Crea guiones persuasivos para videos y redes sociales con inteligencia artificial</p>
                  <div className="course-meta">
                    <span className="course-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('duracion')}</span>
                      <span>4 horas</span>
                    </span>
                    <span className="course-level" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('nivel')}</span>
                      <span>Intermedio</span>
                    </span>
                  </div>
                  <button className="course-btn">Ver Curso</button>
                </div>
              </div>
              
              <div className="course-card" onClick={() => router.push('/curso/monetiza-voz-ia-elevenlabs')}>
                <div className="course-image-wrapper">
                  <img src="/images/courses/monetiza-voz-ia.png" alt="Monetiza tu Voz con IA" className="course-image" />
                  <span className="course-badge eplus">e Plus</span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Monetiza tu Voz con IA</h3>
                  <p className="course-description">Aprende a monetizar tu voz utilizando inteligencia artificial con ElevenLabs</p>
                  <div className="course-meta">
                    <span className="course-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('duracion')}</span>
                      <span>8 horas</span>
                    </span>
                    <span className="course-level" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('nivel')}</span>
                      <span>Principiante</span>
                    </span>
                  </div>
                  <button className="course-btn">Ver Curso</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section (debajo de cursos relacionados) */}
        <section className="faq-section">
          <div className="container">
            <h2 className="faq-title">Preguntas frecuentes</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary className="faq-question">¿Qué incluye la Suscripción Premium de eGrow Academy?</summary>
                <div className="faq-answer">
                  Acceso a todos los cursos actuales y futuros mientras mantengas tu suscripción, actualizaciones permanentes, plantillas descargables, soporte prioritario por email y certificado digital al completar los cursos compatibles.
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">¿Cuándo empiezan y cuándo acaban los cursos?</summary>
                <div className="faq-answer">
                  Comienzan cuando tú quieras. Son 100% a tu ritmo, con acceso bajo demanda desde cualquier dispositivo. Puedes pausar y retomar sin perder tu progreso.
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">¿Obtengo certificado digital?</summary>
                <div className="faq-answer">
                  Sí. Al completar el contenido marcado como obligatorio en cada curso podrás descargar un certificado digital con tu nombre desde tu perfil.
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">¿Necesito experiencia previa en diseño?</summary>
                <div className="faq-answer">
                  No. Este curso está diseñado para principiantes absolutos. Solo necesitas manejo básico de internet y ganas de aprender.
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">¿Puedo usar comercialmente los mockups que cree?</summary>
                <div className="faq-answer">
                  Sí, todos los mockups que crees durante el curso son de tu propiedad y puedes usarlos para proyectos personales o comerciales.
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">¿Cómo obtengo soporte si me trabo?</summary>
                <div className="faq-answer">
                  Desde tu cuenta puedes abrir un ticket de soporte o escribirnos a soporte@egrow-academy.com. También encontrarás guías rápidas y preguntas frecuentes dentro de cada módulo.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <div className="container">
            <div className="pricing-header">
              <h2 className="pricing-title">Elige tu Plan de Suscripción</h2>
              <p className="pricing-subtitle">Desbloquea todo el potencial de eGrow Academy con acceso ilimitado a nuestros cursos especializados</p>
            </div>
            
            <div className="pricing-grid">
              {/* Plan Gratuito */}
              <div className="pricing-card">
                <div className="pricing-card-content">
                  <div className="pricing-header-card">
                    <h3 className="pricing-plan-name">Plan Gratuito</h3>
                    <div className="pricing-plan-price">
                      $0
                      <span className="pricing-interval">/mes</span>
                    </div>
                  </div>

                  <ul className="pricing-features">
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Acceso a cursos públicos gratuitos</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Sistema básico de rachas</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Comunidad básica</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Soporte por email estándar</span>
                    </li>
                    <li className="pricing-feature not-included">
                      <span className="pricing-feature-icon not-included-icon">✕</span>
                      <span className="pricing-feature-text not-included-text">Acceso a cursos especializados premium</span>
                    </li>
                    <li className="pricing-feature not-included">
                      <span className="pricing-feature-icon not-included-icon">✕</span>
                      <span className="pricing-feature-text not-included-text">Certificados de finalización</span>
                    </li>
                    <li className="pricing-feature not-included">
                      <span className="pricing-feature-icon not-included-icon">✕</span>
                      <span className="pricing-feature-text not-included-text">Badge visible en navbar</span>
                    </li>
                    <li className="pricing-feature not-included">
                      <span className="pricing-feature-icon not-included-icon">✕</span>
                      <span className="pricing-feature-text not-included-text">Personalización de badges y rachas</span>
                    </li>
                  </ul>

                  <button className="pricing-button secondary">
                    Registrarse Gratis
                  </button>
                </div>
              </div>

              {/* Plan Mensual */}
              <div className="pricing-card popular">
                <div className="pricing-popular-badge">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {/* icon placeholder */}
                    <span style={{ width: 18, height: 18, display: 'inline-block' }} />
                    <span>Más Popular</span>
                  </span>
                </div>
                
                <div className="pricing-card-content">
                  <div className="pricing-header-card">
                    <h3 className="pricing-plan-name">Plan Mensual</h3>
                    <div className="pricing-plan-price">
                      $12.49
                      <span className="pricing-interval">/mes</span>
                    </div>
                  </div>

                  <ul className="pricing-features">
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Acceso a todos los cursos especializados</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Contenido actualizado mensualmente</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Certificados de finalización</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Sistema completo de rachas</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Badge visible en navbar</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Personalización de badges y rachas</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Soporte técnico prioritario</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Acceso a la comunidad exclusiva</span>
                    </li>
                  </ul>

                  <button className="pricing-button primary">
                    Suscribirse por $12.49
                  </button>
                </div>
              </div>

              {/* Plan Anual */}
              <div className="pricing-card popular yearly-popular">
                <div className="pricing-popular-badge yearly-badge">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {/* icon placeholder */}
                    <span style={{ width: 18, height: 18, display: 'inline-block' }} />
                    <span>Ahorra Más</span>
                  </span>
                </div>
                
                <div className="pricing-card-content">
                  <div className="pricing-header-card">
                    <h3 className="pricing-plan-name">Plan Anual</h3>
                    <div className="pricing-plan-price">
                      $149.99
                      <span className="pricing-interval">/año</span>
                    </div>
                    <p className="pricing-monthly-price">
                      $12.50/mes facturado anualmente
                    </p>
                  </div>

                  <ul className="pricing-features">
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Todo lo del plan mensual</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">2 meses gratis</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Personalización completa de badges y rachas</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Badge visible en barra de navegación</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Acceso anticipado a nuevos cursos</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Mentorías grupales mensuales</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Recursos premium adicionales</span>
                    </li>
                    <li className="pricing-feature">
                      <span className="pricing-feature-icon">✓</span>
                      <span className="pricing-feature-text">Garantía de satisfacción de 30 días</span>
                    </li>
                  </ul>

                  <button className="pricing-button primary">
                    Suscribirse por $149.99
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}