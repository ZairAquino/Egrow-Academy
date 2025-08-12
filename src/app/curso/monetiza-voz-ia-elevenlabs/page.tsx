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
import { IconStar, IconTrophy } from '@tabler/icons-react';


// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function MonetizaVozIAElevenLabsPage() {
  console.log('🔍 [DEBUG] Componente MonetizaVozIAElevenLabsPage cargado');
  
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);
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

  // Función para alternar la expansión de lecciones
  const toggleLesson = (index: number) => {
    setExpandedLessons(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Función para inscribir e ir al contenido del curso
  const goToCourseContent = async () => {
  console.log('[MONETIZA-VOZ-PAGE] Botón clickeado - Estado de autenticación:', { 
      user: !!user, 
      status, 
      userEmail: user?.email,
      userId: user?.id,
      hasPremiumAccess
    });
    
    // Verificar si el usuario está autenticado
    if (status === 'loading' || subscriptionLoading) {
      console.log('⏳ [MONETIZA-VOZ-PAGE] Estado de autenticación cargando, esperando...');
      return;
    }
    
    if (!user || status === 'unauthenticated') {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/monetiza-voz-ia-elevenlabs/contenido`;
      console.log(`[MONETIZA-VOZ-PAGE] Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    if (!hasPremiumAccess) {
      // Si el usuario no tiene acceso premium, redirigir a suscripción
      console.log(`[MONETIZA-VOZ-PAGE] Usuario no tiene acceso premium - Redirigiendo a suscripción`);
      router.push('/subscription');
      return;
    }
    
    // Si el usuario está logueado y tiene premium, inscribirlo automáticamente y redirigir
    console.log(`[MONETIZA-VOZ-PAGE] Usuario logueado con premium (${user.email}) - Inscribiendo y redirigiendo...`);
    
    try {
      console.log('🔄 [MONETIZA-VOZ-PAGE] Iniciando inscripción automática...');
      
      // Inscribir automáticamente al usuario
      const enrollResponse = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: courseData.id }),
        credentials: 'include',
      });
      
      console.log('📡 [MONETIZA-VOZ-PAGE] Respuesta de inscripción:', { 
        status: enrollResponse.status, 
        ok: enrollResponse.ok 
      });
      
      if (enrollResponse.ok) {
        const enrollData = await enrollResponse.json();
        console.log('[MONETIZA-VOZ-PAGE] Usuario inscrito automáticamente:', enrollData);
      } else {
        const errorData = await enrollResponse.text();
        console.error('⚠️ [MONETIZA-VOZ-PAGE] Error al inscribir:', { 
          status: enrollResponse.status, 
          error: errorData 
        });
      }
    } catch (error) {
      console.error('❌ [MONETIZA-VOZ-PAGE] Error en inscripción automática:', error);
    }
    
    // Redirigir al contenido del curso independientemente del resultado de la inscripción
    const contentUrl = '/curso/monetiza-voz-ia-elevenlabs/contenido';
    console.log(`🔄 [MONETIZA-VOZ-PAGE] Redirigiendo a: ${contentUrl}`);
    
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
    id: 'monetiza-voz-ia-elevenlabs',
    title: 'Monetiza tu Voz con IA: ElevenLabs para anuncios, cursos y podcasts (sin curva técnica)',
    description: 'Aprende a monetizar tu voz utilizando inteligencia artificial con ElevenLabs. Crea anuncios profesionales, cursos narrados y podcasts de alta calidad sin conocimientos técnicos. Desde la configuración básica hasta estrategias avanzadas de monetización.',
    mainVideoUrl: 'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf204HLGPQbPfwompytjDs9F6n0B7Hx4aShOGI',
    duration: '8 horas',
    level: 'Principiante',
    difficulty: 'Principiante',
    categoryText: 'Premium • Certificado digital incluido',
    category: 'IA para Emprender',
    price: 'Premium - $97',
    language: 'Español',
    image: '/images/courses/monetiza-voz-ia.png',
    lessonsCount: 10,
    instructor: {
      name: 'Zair Aquino',
      title: 'CEO de eGrow y especialista en IA',
      image: '/images/Zair.jpeg',
      bio: 'Experto en herramientas de IA para generación de contenido y monetización digital con más de 5 años de experiencia en ElevenLabs y tecnologías de voz.'
    },
    prerequisites: [
      'No se requieren conocimientos técnicos previos.',
      'Tener una computadora con acceso a internet.',
      'Micrófono básico para grabar muestras de voz.',
      'Ganas de aprender y monetizar tu voz con IA.'
    ],
    whatYouWillLearn: [
      'Configuración completa de ElevenLabs desde cero',
      'Creación de voces personalizadas de alta calidad',
      'Producción de anuncios comerciales profesionales',
      'Narración automatizada de cursos online',
      'Creación de podcasts sin hablar en vivo',
      'Estrategias de monetización con voz artificial',
      'Optimización de calidad y naturalidad del audio',
      'Escalabilidad de negocios con tecnología de voz'
    ],
    tools: [
      'ElevenLabs Pro',
      'Herramientas de edición de video'
    ],
    lessons: [
      {
        id: 1,
        title: 'MÓDULO 1: Fundamentos y contexto',
        description: 'Entender de dónde viene ElevenLabs, en qué destaca y dónde usarlo con responsabilidad.',
        duration: 80,
        type: 'Video',
        lessonsCount: 3,
        subLessons: [
          {
            id: '1.1',
            title: 'Origen de ElevenLabs (story breve)',
            description: 'Fundada en 2022 por Mati Staniszewski y Piotr Dobkowski; la inspiración vino de crecer con doblajes monótonos y querer voces sintéticas realistas. "Eleven" alude al 11 (divisibilidad), Apollo 11 y turn it up to 11.',
            content: 'Momentum: modelo propio, locuciones naturales; en dos años alcanzó ~$100M ARR. Por qué importa: 30+ idiomas, velocidad, coste bajo por palabra, accesibilidad, ronda Serie B de ~$80M.',
            deliverable: 'mini-pitch (3 frases) de cómo usarás ElevenLabs en tu proyecto.',
            duration: 25,
            type: 'Video'
          },
          {
            id: '1.2',
            title: 'Alcances y límites (ética y uso responsable)',
            description: 'Alcances: clonación de voz para identidad de marca; doblaje exprés multilingüe; asistentes con emoción; storytelling inmersivo.',
            content: 'Límites: deepfakes/fraude; derechos de autor/contratos; costo de tiempo real; emociones extremas aún imperfectas. Cierre clave: "Amplifica tu mensaje, no reemplaces tu humanidad."',
            deliverable: 'política breve de uso ético para tu marca (plantilla incluida).',
            duration: 30,
            type: 'Video'
          },
          {
            id: '1.3',
            title: 'Panorama TTS (comparativa rápida)',
            description: 'Quién es quién: Amazon Polly (precio), Google TTS Neural (versatilidad), ElevenLabs (realismo/emoción).',
            content: 'Calidad: A = correcto/robótico; B = entonación natural; C = timbre/respiración realistas. Facilidad: AWS (IAM); Google (UI sencilla); ElevenLabs (dashboard no-code + SDK). Coste (neural aprox. / 1M chars): A ~$16 (std $4), B ~$12–17, C más premium por realismo/turbo.',
            deliverable: 'Casos recomendados: IVR masivo → Polly; micro-learning → Google; audiolibros/podcasts premium → ElevenLabs.',
            duration: 25,
            type: 'Video'
          }
        ]
      },
      {
        id: 2,
        title: 'MÓDULO 2: Taller práctico de ElevenLabs',
        description: 'Dominar las funciones esenciales y montar un flujo de trabajo completo.',
        duration: 120,
        type: 'Lab',
        lessonsCount: 4,
        subLessons: [
          {
            id: '2.1',
            title: 'Introducción al flujo',
            description: 'Qué funciones veremos antes de profundizar (visión general).',
            content: 'Visión general completa del flujo de trabajo con ElevenLabs, desde la configuración inicial hasta la producción final.',
            deliverable: 'flujo de 5 pasos para tu proyecto (plantilla).',
            duration: 25,
            type: 'Video'
          },
          {
            id: '2.2',
            title: 'Text-to-Speech (TTS) base',
            description: 'Genera voz desde texto y añádela a un video promocional.',
            content: 'Práctica guiada: guion de 60–90s + export MP3/WAV + montaje en editor.',
            deliverable: 'video corto con VO TTS terminado.',
            duration: 35,
            type: 'Práctica'
          },
          {
            id: '2.3',
            title: 'Mejora, cambio y traducción de voz',
            description: 'Cambiar timbre, ajustar emoción y traducir tu VO.',
            content: 'Práctica guiada: versión ES → EN/PR del mismo spot.',
            deliverable: '2 variantes multilenguaje.',
            duration: 40,
            type: 'Práctica'
          },
          {
            id: '2.4',
            title: 'Postproducción (toques pro)',
            description: 'Efectos y acabado para que suene "broadcast-ready".',
            content: 'Técnicas profesionales de postproducción de audio para lograr calidad de transmisión comercial.',
            deliverable: 'audio con calidad broadcast lista para usar.',
            duration: 20,
            type: 'Video'
          }
        ]
      },
      {
        id: 3,
        title: 'MÓDULO 3: Casos reales y modelo de negocio',
        description: 'Bajar a tierra (vida diaria y empresa) y convertirlo en oferta vendible.',
        duration: 90,
        type: 'Project',
        lessonsCount: 3,
        subLessons: [
          {
            id: '3.1',
            title: 'Casos de la vida real',
            description: 'Grabación en casa (mejorar voz), traducción de audios, audiolibros, accesibilidad, contenidos cortos.',
            content: 'Práticas concretas aplicadas a situaciones reales: mejora de grabaciones caseras, traducción de contenido existente, creación de audiolibros, soluciones de accesibilidad y contenido para redes sociales.',
            deliverable: 'caso aplicado a tu nicho (1 video o 1 audio terminado).',
            duration: 40,
            type: 'Práctica'
          },
          {
            id: '3.2',
            title: 'ElevenLabs como negocio',
            description: 'Ofertas: doblaje exprés, "podcast en 3 idiomas", IVR con marca, packs para cursos. Costeo básico y tiempos de entrega.',
            content: 'Estructura de ofertas comerciales, costeo por minuto generado, tiempos de entrega, cláusulas de uso de voz y consentimiento. Monetización efectiva de servicios con ElevenLabs.',
            deliverable: 'una página de oferta + tabla de precios inicial.',
            duration: 35,
            type: 'Negocio'
          },
          {
            id: '3.3',
            title: 'Conclusión y siguientes pasos',
            description: 'Cierre del curso, checklist final y plan de acción para implementar lo aprendido.',
            content: 'Resumen de conceptos clave, checklist de implementación y plan de siguientes pasos para monetizar efectivamente tu voz con IA.',
            deliverable: 'plan de acción personalizado y checklist completo.',
            duration: 15,
            type: 'Video'
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

  // Función para verificar toda la estructura del grid y contenedores
  const inspectGridStructure = () => {
    console.log('🔍 [INSPECCIÓN GRID] Verificando estructura completa...');
    
    // Verificar el contenedor principal del grid
    const contentLayout = document.querySelector('.content-layout');
    if (contentLayout) {
      const computedStyle = window.getComputedStyle(contentLayout);
      console.log('🔍 [INSPECCIÓN GRID] .content-layout:', {
        display: computedStyle.display,
        gridTemplateColumns: computedStyle.gridTemplateColumns,
        position: computedStyle.position,
        overflow: computedStyle.overflow,
        height: computedStyle.height,
        minHeight: computedStyle.minHeight,
        className: contentLayout.className,
        children: contentLayout.children.length
      });
      
      // Verificar todos los hijos del grid
      Array.from(contentLayout.children).forEach((child, index) => {
        const childStyle = window.getComputedStyle(child);
        console.log(`🔍 [INSPECCIÓN GRID] Hijo ${index}:`, {
          tagName: child.tagName,
          className: child.className,
          id: child.id,
          display: childStyle.display,
          position: childStyle.position,
          overflow: childStyle.overflow,
          height: childStyle.height,
          minHeight: childStyle.minHeight,
          gridColumn: childStyle.gridColumn,
          gridRow: childStyle.gridRow
        });
      });
    } else {
      console.log('❌ [INSPECCIÓN GRID] No se encontró .content-layout');
    }
    
    // Verificar el sidebar específicamente
    const contentSidebar = document.querySelector('.content-sidebar');
    if (contentSidebar) {
      const computedStyle = window.getComputedStyle(contentSidebar);
      console.log('🔍 [INSPECCIÓN GRID] .content-sidebar:', {
        display: computedStyle.display,
        position: computedStyle.position,
        overflow: computedStyle.overflow,
        height: computedStyle.height,
        minHeight: computedStyle.minHeight,
        top: computedStyle.top,
        left: computedStyle.left,
        right: computedStyle.right,
        bottom: computedStyle.bottom,
        transform: computedStyle.transform,
        className: contentSidebar.className,
        children: contentSidebar.children.length,
        parentElement: contentSidebar.parentElement?.className
      });
      
      // Verificar todos los hijos del sidebar
      Array.from(contentSidebar.children).forEach((child, index) => {
        const childStyle = window.getComputedStyle(child);
        console.log(`🔍 [INSPECCIÓN GRID] Sidebar hijo ${index}:`, {
          tagName: child.tagName,
          className: child.className,
          id: child.id,
          display: childStyle.display,
          position: childStyle.position,
          overflow: childStyle.overflow,
          height: childStyle.height,
          minHeight: childStyle.minHeight,
          top: childStyle.top,
          left: childStyle.left,
          right: childStyle.right,
          bottom: childStyle.bottom,
          transform: childStyle.transform
        });
      });
    } else {
      console.log('❌ [INSPECCIÓN GRID] No se encontró .content-sidebar');
    }
    
    // Verificar si hay contenedores con overflow hidden
    const allElements = document.querySelectorAll('*');
    const overflowHiddenElements = Array.from(allElements).filter(el => {
      const style = window.getComputedStyle(el);
      return style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden';
    });
    
    console.log('🔍 [INSPECCIÓN GRID] Elementos con overflow hidden:', overflowHiddenElements.map(el => ({
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      overflow: window.getComputedStyle(el).overflow,
      overflowX: window.getComputedStyle(el).overflowX,
      overflowY: window.getComputedStyle(el).overflowY
    })));
    
    // Verificar si hay contenedores con position fixed o sticky
    const fixedStickyElements = Array.from(allElements).filter(el => {
      const style = window.getComputedStyle(el);
      return style.position === 'fixed' || style.position === 'sticky';
    });
    
    console.log('🔍 [INSPECCIÓN GRID] Elementos con position fixed/sticky:', fixedStickyElements.map(el => ({
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      position: window.getComputedStyle(el).position,
      top: window.getComputedStyle(el).top,
      left: window.getComputedStyle(el).left,
      right: window.getComputedStyle(el).right,
      bottom: window.getComputedStyle(el).bottom
    })));
  };

  // Función para verificar CSS global que afecte el grid
  const checkGridCSSRules = () => {
    console.log('🔍 [INSPECCIÓN CSS GRID] Verificando CSS global del grid...');
    
    const allStylesheets = Array.from(document.styleSheets);
    allStylesheets.forEach((stylesheet, index) => {
      try {
        const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
        rules.forEach((rule, ruleIndex) => {
          if (rule instanceof CSSStyleRule && rule.selectorText && (
            rule.selectorText.includes('content-layout') ||
            rule.selectorText.includes('content-sidebar') ||
            rule.selectorText.includes('main-content-area') ||
            rule.selectorText.includes('grid') ||
            rule.selectorText.includes('sidebar')
          )) {
            console.log('🚨 [ALERTA] Regla CSS del grid encontrada:', {
              stylesheet: index,
              rule: ruleIndex,
              selector: rule.selectorText,
              cssText: rule.cssText
            });
          }
        });
      } catch (e) {
        console.log('⚠️ [INFO] No se puede acceder a las reglas del stylesheet', index, e);
      }
    });
  };

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

    // Logs de diagnóstico para la tarjeta de precios
    const logPriceCardStyles = () => {
      const priceCard = document.querySelector('.price-card-scrollable');
      const priceCardInner = document.querySelector('.price-card');
      
      if (priceCard) {
        const computedStyle = window.getComputedStyle(priceCard);
        const inlineStyle = (priceCard as HTMLElement).getAttribute('style');
        console.log('🔍 [DIAGNÓSTICO] Estilos de .price-card-scrollable:', {
          position: computedStyle.position,
          top: computedStyle.top,
          left: computedStyle.left,
          right: computedStyle.right,
          bottom: computedStyle.bottom,
          transform: computedStyle.transform,
          zIndex: computedStyle.zIndex,
          className: priceCard.className,
          id: priceCard.id,
          inlineStyle: inlineStyle
        });
      } else {
        console.log('❌ [DIAGNÓSTICO] No se encontró .price-card-scrollable');
      }
      
      if (priceCardInner) {
        const computedStyle = window.getComputedStyle(priceCardInner);
        const inlineStyle = priceCardInner.getAttribute('style');
        console.log('🔍 [DIAGNÓSTICO] Estilos de .price-card:', {
          position: computedStyle.position,
          top: computedStyle.top,
          left: computedStyle.left,
          right: computedStyle.right,
          bottom: computedStyle.bottom,
          transform: computedStyle.transform,
          zIndex: computedStyle.zIndex,
          className: priceCardInner.className,
          inlineStyle: inlineStyle
        });
      } else {
        console.log('❌ [DIAGNÓSTICO] No se encontró .price-card');
      }
    };

    // Función para monitorear cambios en los estilos
    const monitorPriceCardChanges = () => {
      const priceCard = document.querySelector('.price-card-scrollable') as HTMLElement;
      if (priceCard) {
        // Crear un observer para detectar cambios en los atributos
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
              console.log('🚨 [ALERTA] Se detectó cambio en el atributo style:', {
                target: mutation.target,
                oldValue: mutation.oldValue,
                newValue: (mutation.target as HTMLElement).getAttribute('style')
              });
            }
          });
        });

        observer.observe(priceCard, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ['style', 'class']
        });

        console.log('✅ [MONITOREO] Observer configurado para .price-card-scrollable');
        return observer;
      }
      return null;
    };

    // Función para verificar todos los estilos CSS aplicados
    const checkAllCSSRules = () => {
      console.log('🔍 [DIAGNÓSTICO] Verificando todas las reglas CSS...');
      
      // Verificar estilos inline
      const priceCard = document.querySelector('.price-card-scrollable') as HTMLElement;
      if (priceCard) {
        console.log('🔍 [DIAGNÓSTICO] Estilos inline:', priceCard.getAttribute('style'));
        console.log('🔍 [DIAGNÓSTICO] Clases CSS:', priceCard.className);
      }
      
      // Verificar si hay estilos globales que coincidan
      const allStylesheets = Array.from(document.styleSheets);
      allStylesheets.forEach((stylesheet, index) => {
        try {
          const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
          rules.forEach((rule, ruleIndex) => {
            if (rule instanceof CSSStyleRule && rule.selectorText && rule.selectorText.includes('price-card')) {
              console.log('🚨 [ALERTA] Regla CSS global encontrada:', {
                stylesheet: index,
                rule: ruleIndex,
                selector: rule.selectorText,
                cssText: rule.cssText
              });
            }
          });
        } catch (e) {
          console.log('⚠️ [INFO] No se puede acceder a las reglas del stylesheet', index, e);
        }
      });
    };

    // Función para forzar estilos con !important usando JavaScript
    const forcePriceCardStyles = () => {
      const priceCard = document.querySelector('.price-card-scrollable') as HTMLElement;
      const priceCardInner = document.querySelector('.price-card') as HTMLElement;
      
      if (priceCard) {
        // Forzar estilos usando setProperty con !important
        priceCard.style.setProperty('position', 'relative', 'important');
        priceCard.style.setProperty('top', 'auto', 'important');
        priceCard.style.setProperty('left', 'auto', 'important');
        priceCard.style.setProperty('right', 'auto', 'important');
        priceCard.style.setProperty('bottom', 'auto', 'important');
        priceCard.style.setProperty('transform', 'none', 'important');
        priceCard.style.setProperty('will-change', 'auto', 'important');
        priceCard.style.setProperty('z-index', '20', 'important');
        priceCard.style.setProperty('float', 'none', 'important');
        priceCard.style.setProperty('clear', 'none', 'important');
        priceCard.style.setProperty('display', 'block', 'important');
        priceCard.style.setProperty('inset', 'auto', 'important');
        
        console.log('✅ [FORZADO] Estilos aplicados a .price-card-scrollable usando setProperty');
      }
      
      if (priceCardInner) {
        // Forzar estilos usando setProperty con !important
        priceCardInner.style.setProperty('position', 'relative', 'important');
        priceCardInner.style.setProperty('top', 'auto', 'important');
        priceCardInner.style.setProperty('left', 'auto', 'important');
        priceCardInner.style.setProperty('right', 'auto', 'important');
        priceCardInner.style.setProperty('bottom', 'auto', 'important');
        priceCardInner.style.setProperty('transform', 'none', 'important');
        priceCardInner.style.setProperty('will-change', 'auto', 'important');
        priceCardInner.style.setProperty('z-index', '20', 'important');
        priceCardInner.style.setProperty('float', 'none', 'important');
        priceCardInner.style.setProperty('clear', 'none', 'important');
        priceCardInner.style.setProperty('display', 'block', 'important');
        priceCardInner.style.setProperty('inset', 'auto', 'important');
        
        console.log('✅ [FORZADO] Estilos aplicados a .price-card usando setProperty');
      }
    };

    // Listener de scroll para mantener estilos forzados
    const handleScroll = () => {
      // Reforzar estilos cada cierto tiempo durante el scroll
      forcePriceCardStyles();
    };


    // Agregar listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    

    // Ejecutar diagnóstico después de que el DOM esté listo
    console.log('🔍 [DEBUG] Configurando setTimeout principal...');
    setTimeout(() => {
      console.log('🔍 [DEBUG] Iniciando diagnóstico completo...');
      
      logPriceCardStyles();
      console.log('✅ [DEBUG] logPriceCardStyles completado');
      
      checkAllCSSRules();
      console.log('✅ [DEBUG] checkAllCSSRules completado');
      
      console.log('🔍 [DEBUG] Ejecutando inspectGridStructure...');
      inspectGridStructure(); // Agregar inspección del grid
      console.log('✅ [DEBUG] inspectGridStructure completado');
      
      console.log('🔍 [DEBUG] Ejecutando checkGridCSSRules...');
      checkGridCSSRules(); // Agregar verificación de CSS del grid
      console.log('✅ [DEBUG] checkGridCSSRules completado');
      
      const observer = monitorPriceCardChanges();
      console.log('✅ [DEBUG] monitorPriceCardChanges completado');
      
      // Guardar el observer para limpiarlo después
      if (observer) {
        (window as any).priceCardObserver = observer;
      }
      
      // Forzar estilos después de un pequeño delay
      setTimeout(() => {
        console.log('🔍 [DEBUG] Ejecutando forcePriceCardStyles...');
        forcePriceCardStyles();
        console.log('✅ [DEBUG] forcePriceCardStyles completado');
      }, 500);
    }, 1000);

    // Ejecutar inspección del grid inmediatamente también
    console.log('🔍 [DEBUG] Ejecutando inspección inmediata del grid...');
    setTimeout(() => {
      console.log('🔍 [DEBUG] Ejecutando inspectGridStructure inmediato...');
      inspectGridStructure();
      console.log('🔍 [DEBUG] Ejecutando checkGridCSSRules inmediato...');
      checkGridCSSRules();
    }, 100);

    // Ejecutar también después de que el componente se monte completamente
    console.log('🔍 [DEBUG] Configurando ejecución post-mount...');
    setTimeout(() => {
      console.log('🔍 [DEBUG] Ejecutando inspección post-mount...');
      inspectGridStructure();
      checkGridCSSRules();
    }, 2000);

    // Ejecutar diagnóstico después de que el DOM esté listo
    console.log('🔍 [DEBUG] Configurando setTimeout principal...');
    setTimeout(() => {
      console.log('🔍 [DEBUG] Iniciando diagnóstico completo...');
      
      logPriceCardStyles();
      console.log('✅ [DEBUG] logPriceCardStyles completado');
      
      checkAllCSSRules();
      console.log('✅ [DEBUG] checkAllCSSRules completado');
      
      console.log('🔍 [DEBUG] Ejecutando inspectGridStructure...');
      inspectGridStructure(); // Agregar inspección del grid
      console.log('✅ [DEBUG] inspectGridStructure completado');
      
      console.log('🔍 [DEBUG] Ejecutando checkGridCSSRules...');
      checkGridCSSRules(); // Agregar verificación de CSS del grid
      console.log('✅ [DEBUG] checkGridCSSRules completado');
      
      const observer = monitorPriceCardChanges();
      console.log('✅ [DEBUG] monitorPriceCardChanges completado');
      
      // Guardar el observer para limpiarlo después
      if (observer) {
        (window as any).priceCardObserver = observer;
      }
      
      // Forzar estilos después de un pequeño delay
      setTimeout(() => {
        console.log('🔍 [DEBUG] Ejecutando forcePriceCardStyles...');
        forcePriceCardStyles();
        console.log('✅ [DEBUG] forcePriceCardStyles completado');
      }, 500);
    }, 1000);

    // Logs adicionales para detectar JavaScript que modifique estilos
    console.log('🔍 [DIAGNÓSTICO] Verificando funciones globales...');
    
    // Verificar si hay funciones que modifiquen estilos
    const originalSetAttribute = Element.prototype.setAttribute;
    const originalStyleSetProperty = CSSStyleDeclaration.prototype.setProperty;
    
    Element.prototype.setAttribute = function(name, value) {
      if (name === 'style' && this.classList.contains('price-card-scrollable')) {
        console.log('🚨 [ALERTA] setAttribute llamado en price-card-scrollable:', {
          element: this,
          name: name,
          value: value,
          stack: new Error().stack
        });
      }
      return originalSetAttribute.call(this, name, value);
    };
    
    CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
      if (this.parentRule && (this.parentRule as any).selectorText && (this.parentRule as any).selectorText.includes('price-card')) {
        console.log('🚨 [ALERTA] setProperty llamado en CSS de price-card:', {
          property: property,
          value: value,
          priority: priority,
          stack: new Error().stack
        });
      }
      return originalStyleSetProperty.call(this, property, value, priority);
    };
    
    console.log('✅ [MONITOREO] Hooks instalados para detectar cambios de estilos');

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', logPriceCardStyles);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, status]);

  // YouTube API para controlar animación del video
  useEffect(() => {
    // Cargar YouTube API
    const loadYouTubeAPI = () => {
      if (typeof window !== 'undefined' && !(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      }
    };

    // Función global para YouTube API
    (window as any).onYouTubeIframeAPIReady = () => {
      const player = new (window as any).YT.Player('youtube-iframe', {
        events: {
          'onStateChange': (event: any) => {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                videoPlayer.classList.add('playing');
              } else if (event.data === (window as any).YT.PlayerState.PAUSED || 
                         event.data === (window as any).YT.PlayerState.ENDED) {
                videoPlayer.classList.remove('playing');
              }
            }
          }
        }
      });
    };

    loadYouTubeAPI();
  }, []);

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
      1: ['voz1.1', 'voz1.2', 'voz1.3'],
      2: ['voz2.1', 'voz2.2', 'voz2.3', 'voz2.4'],
      3: ['voz3.1', 'voz3.2', 'voz3.3']
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
  console.log('🔍 [DEBUG] Estados finales antes del render:', {
    user: !!user,
    status,
    isUserAuthenticated,
    completedLessonsLength: completedLessons.length,
    currentLesson,
    progressPercentage,
    isLoading,
    hasPremiumAccess
  });
  console.log('🔍 [DEBUG] Condición del botón (isUserAuthenticated && completedLessons.length > 0):', isUserAuthenticated && completedLessons.length > 0);
  
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
                  src="/images/courses/curso_elevenlabs.png" 
                  alt="Curso ElevenLabs"
                />
                <div className="sticky-play-icon">
                  <svg width="12" height="14" viewBox="0 0 20 24" fill="none">
                    <path d="M0 2.4C0 1.07 1.34 0.16 2.5 0.83L18.5 11.43C19.66 12.1 19.66 13.9 18.5 14.57L2.5 23.17C1.34 23.84 0 22.93 0 21.6V2.4Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="sticky-course-title">
                <h3>Monetiza tu Voz con IA</h3>
                <div className="sticky-course-rating">
                  <span className="stars">★★★★★</span>
                  <span>4.8 (450)</span>
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
                    Convierte tu voz en<br />
                    ingresos con IA —<br />
                    Domina ElevenLabs<br />
                    sin experiencia previa
                  </h1>
                  <p className="hero-subtext">
                    Crea audios profesionales en minutos, sin equipo costoso ni
                    conocimientos técnicos, y empieza a venderlos en anuncios,...
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
                          src="/images/courses/curso_elevenlabs.png" 
                          alt="Vista previa del curso Monetiza tu Voz con IA"
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
                    <div className="stars" aria-label="Calificación 4.8 de 5">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <span className="rating">4.8 <span className="muted">(450 valoraciones)</span></span>
                    <span className="dot" />
                    <span className="students" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="student-icon" style={{ display: 'inline-flex' }}>{renderUiIcon('estudiantes')}</span>
                      <span>2,863 estudiantes</span>
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
                    Convierte tu voz en una fuente de ingresos con la inteligencia artificial más realista del mundo. En este curso práctico, aprenderás a dominar ElevenLabs, la tecnología líder en clonación y creación de voz, para producir audios que venden, conectan y emocionan… sin curva técnica.
                  </p>
                  <div className="desc-separator" />
                  <div className="desc-body">
                    <p className="desc-paragraph">Descubrirás el poder de tu voz y cómo amplificarla con IA para anuncios, cursos, podcasts y doblajes multilenguaje.</p>
                    <p className="desc-paragraph">Aplicarás técnicas profesionales para generar, traducir y mejorar locuciones que suenan listas para radio o TV.</p>
                    <p className="desc-paragraph">Diseñarás ofertas rentables para vender tu servicio de voz y llegar a clientes en cualquier parte del mundo.</p>
                    <p className="desc-paragraph">Aprenderás paso a paso con ejercicios reales, plantillas y un enfoque ético para proteger tu identidad vocal y la de tus clientes.</p>
                    <p className="desc-closure">Al terminar, no solo dominarás ElevenLabs: tendrás tu portafolio listo y tu plan para empezar a monetizar al día siguiente.</p>
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
                    <div className="stat"><span className="stat-icon">{renderUiIcon('estudiantes')}</span><span className="stat-value">2,863</span><span className="stat-label">Estudiantes</span></div>
                    <div className="stat"><span className="stat-icon">{renderUiIcon('opiniones')}</span><span className="stat-value">450</span><span className="stat-label">Opiniones</span></div>
                    <div className="stat"><span className="stat-icon">{renderUiIcon('valoraciones positivas')}</span><span className="stat-value stat-good">99%</span><span className="stat-label">Valoraciones positivas</span></div>
                  </div>

                  {/* Carrusel auto-avanzable con 2 tarjetas por slide */}
                  <div className="reviews-carousel">
                    <div className="reviews-track" ref={reviewsTrackRef}>
                      {/* Slide 1 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Implementé mi primer anuncio con voz en 24 horas. El flujo es claro, sin relleno y con ejemplos que realmente funcionan.</p>
                              <div className="testimonial-author">- Laura M.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">El módulo de negocio me ayudó a empaquetar mi oferta. En una semana cerré mi primer cliente para spots de radio.</p>
                              <div className="testimonial-author">- Diego P.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Slide 2 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Zair Aquino explica directo al grano. Con su guía monté un pipeline para cursos narrados con ElevenLabs en dos tardes.</p>
                              <div className="testimonial-author">- José L.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Zair Aquino no se guarda nada: tips de grabación, presets y cómo cobrar. Salí con un plan de precios listo.</p>
                              <div className="testimonial-author">- Sandra T.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Slide 3 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Pasé mis cursos a 3 idiomas en una tarde. El capítulo de traducción y mejora de voz es oro puro.</p>
                              <div className="testimonial-author">- Valeria G.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">No soy locutor y mis audios suenan profesionales. Las plantillas y checklists me ahorraron horas.</p>
                              <div className="testimonial-author">- Marco R.</div>
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
              
              <div className="course-card" onClick={() => router.push('/curso/vibe-coding-claude-cursor')}>
                <div className="course-image-wrapper">
                  <img src="/images/16.png" alt="Vibe Coding con Claude & Cursor" className="course-image" />
                  <span className="course-badge eplus">e Plus</span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Vibe Coding con Claude & Cursor</h3>
                  <p className="course-description">Aprende a programar con IA usando Claude y Cursor de manera eficiente</p>
                  <div className="course-meta">
                    <span className="course-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('duracion')}</span>
                      <span>5 horas</span>
                    </span>
                    <span className="course-level" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('nivel')}</span>
                      <span>Intermedio</span>
                    </span>
                  </div>
                  <button className="course-btn">Ver Curso</button>
                </div>
              </div>
              
              <div className="course-card" onClick={() => router.push('/curso/vibe-coding-claude-cursor')}>
                <div className="course-image-wrapper">
                  <img src="/images/17.png" alt="Vibe Coding con Claude Code" className="course-image" />
                  <span className="course-badge eplus">e Plus</span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Vibe Coding con Claude Code</h3>
                  <p className="course-description">Aprende a programar de forma eficiente utilizando Claude Code y herramientas de IA</p>
                  <div className="course-meta">
                    <span className="course-duration" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('duracion')}</span>
                      <span>5 horas</span>
                    </span>
                    <span className="course-level" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span className="icon" style={{ display: 'inline-flex' }}>{renderUiIcon('nivel')}</span>
                      <span>Intermedio</span>
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
                <summary className="faq-question">¿Necesito experiencia previa o equipo especial?</summary>
                <div className="faq-answer">
                  No. Los cursos están pensados para principiantes. Solo requieres una computadora con internet. Recomendamos auriculares y micrófono básico para mejores resultados.
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">¿Puedo usar comercialmente las voces generadas con ElevenLabs?</summary>
                <div className="faq-answer">
                  Sí, siempre que cuentes con la licencia adecuada y permisos de uso de voz cuando corresponda. En el curso incluimos una guía práctica de buenas prácticas y ética.
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
                    <IconStar size={18} />
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
                    <IconTrophy size={18} />
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
