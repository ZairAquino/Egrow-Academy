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
// Íconos removidos temporalmente para evitar errores de build


// Lazy load components
const CompaniesMarquee = dynamic(() => import('@/components/ui/CompaniesMarquee'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function VideosProfesionalesIAPage() {
  console.log('🔍 [DEBUG] Componente VideosProfesionalesIAPage cargado');
  
  
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
  console.log('[VIDEOS-PROFESIONALES-PAGE] Botón clickeado - Estado de autenticación:', { 
      user: !!user, 
      status, 
      userEmail: user?.email,
      userId: user?.id,
      hasPremiumAccess
    });
    
    // Verificar si el usuario está autenticado
    if (status === 'loading' || subscriptionLoading) {
      console.log('⏳ [VIDEOS-PROFESIONALES-PAGE] Estado de autenticación cargando, esperando...');
      return;
    }
    
    if (!user || status === 'unauthenticated') {
      // Si el usuario no está logueado, redirigir al login con redirect
      const loginUrl = `/login?redirect=/curso/videos-profesionales-ia/contenido`;
      console.log(`[VIDEOS-PROFESIONALES-PAGE] Usuario no logueado - Redirigiendo a login: ${loginUrl}`);
      
      if (typeof window !== 'undefined') {
        window.location.href = loginUrl;
      }
      return;
    }
    
    if (!hasPremiumAccess) {
      // Si el usuario no tiene acceso premium, redirigir a suscripción
      console.log(`[VIDEOS-PROFESIONALES-PAGE] Usuario no tiene acceso premium - Redirigiendo a suscripción`);
      router.push('/subscription');
      return;
    }
    
    // Si el usuario está logueado y tiene premium, inscribirlo automáticamente y redirigir
    console.log(`[VIDEOS-PROFESIONALES-PAGE] Usuario logueado con premium (${user.email}) - Inscribiendo y redirigiendo...`);
    
    try {
      console.log('🔄 [VIDEOS-PROFESIONALES-PAGE] Iniciando inscripción automática...');
      
      // Inscribir automáticamente al usuario
      const enrollResponse = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: courseData.id }),
        credentials: 'include',
      });
      
      console.log('📡 [VIDEOS-PROFESIONALES-PAGE] Respuesta de inscripción:', { 
        status: enrollResponse.status, 
        ok: enrollResponse.ok 
      });
      
      if (enrollResponse.ok) {
        const enrollData = await enrollResponse.json();
        console.log('[VIDEOS-PROFESIONALES-PAGE] Usuario inscrito automáticamente:', enrollData);
      } else {
        const errorData = await enrollResponse.text();
        console.error('⚠️ [VIDEOS-PROFESIONALES-PAGE] Error al inscribir:', { 
          status: enrollResponse.status, 
          error: errorData 
        });
      }
    } catch (error) {
      console.error('❌ [VIDEOS-PROFESIONALES-PAGE] Error en inscripción automática:', error);
    }
    
    // Redirigir al contenido del curso independientemente del resultado de la inscripción
    const contentUrl = '/curso/videos-profesionales-ia/contenido';
    console.log(`🔄 [VIDEOS-PROFESIONALES-PAGE] Redirigiendo a: ${contentUrl}`);
    
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
    id: 'videos-profesionales-ia',
    title: 'Aprende a crear videos profesionales con IA',
    description: 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.',
    mainVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration: '18h 30min',
    level: 'Intermedio',
    difficulty: 'Intermedio',
    categoryText: 'Premium • Certificado digital incluido',
    category: 'Marketing Digital',
    price: 'Premium - $97',
    language: 'Español',
    image: '/images/15.png',
    lessonsCount: 21,
    instructor: {
      name: 'eGrow Academy',
      title: 'Especialista en Contenido Audiovisual - eGrow Academy',
      image: '/images/Zair.jpeg',
      bio: 'Experto en creación de contenido audiovisual con IA y optimización para plataformas digitales con más de 5 años de experiencia en el sector.'
    },
    prerequisites: [
      'Conocimientos básicos de internet y tecnología',
      'Cuenta de Google (para acceder a herramientas de IA)',
      'Disposición para aprender nuevas herramientas',
      'Interés en creación de contenido audiovisual'
    ],
    whatYouWillLearn: [
      'Configuración y uso de herramientas de IA para video',
      'Creación de guiones y storyboards con IA',
      'Generación de contenido audiovisual profesional',
      'Edición y post-producción con inteligencia artificial',
      'Optimización de videos para diferentes plataformas',
      'Automatización de procesos de creación de contenido',
      'Implementación de estrategias de marketing audiovisual',
      'Mejores prácticas y casos de uso avanzados'
    ],
    tools: [
      'Runway ML',
      'Synthesia',
      'Lumen5',
      'InVideo',
      'Pictory',
      'Herramientas de edición con IA'
    ],
    lessons: [
      {
        id: 1,
        title: 'MÓDULO 1: Fundamentos del Video con IA',
        description: 'Comprende los fundamentos de la creación de videos con inteligencia artificial y desarrolla una estrategia de contenido audiovisual',
        duration: 45,
        type: 'Teoría',
        lessonsCount: 4,
        subLessons: [
          {
            id: '1.1',
            title: 'Introducción: El poder de los videos con IA',
            description: 'Descubre cómo la inteligencia artificial está revolucionando la creación de contenido audiovisual',
            content: 'La inteligencia artificial ha democratizado la creación de videos profesionales, permitiendo a cualquier persona producir contenido de alta calidad sin necesidad de equipos costosos o conocimientos técnicos avanzados.',
            deliverable: 'Concepto de video profesional con IA para tu proyecto.',
            duration: 12,
            type: 'Video'
          },
          {
            id: '1.2',
            title: 'Panorama de herramientas de IA para video',
            description: 'Conoce las principales herramientas de inteligencia artificial disponibles para creación de videos',
            content: 'Exploración completa de las herramientas líderes en el mercado: Runway ML, Synthesia, Lumen5, InVideo y Pictory. Comparativa de características, precios y casos de uso ideales.',
            deliverable: 'Matriz comparativa de herramientas para tu nicho específico.',
            duration: 18,
            type: 'Video'
          },
          {
            id: '1.3',
            title: 'Estrategia de contenido audiovisual',
            description: 'Desarrolla una estrategia efectiva para crear contenido audiovisual con IA',
            content: 'Planificación de contenido, definición de audiencia objetivo, creación de calendarios editoriales y medición de resultados con herramientas de IA.',
            deliverable: 'Estrategia de contenido personalizada para 30 días.',
            duration: 15,
            type: 'Video'
          }
        ]
      },
      {
        id: 2,
        title: 'MÓDULO 2: Herramientas de IA para Video',
        description: 'Explora las mejores herramientas de IA para creación de contenido audiovisual y aprende a configurarlas',
        duration: 60,
        type: 'Teoría',
        lessonsCount: 5,
        subLessons: [
          {
            id: '2.1',
            title: 'Configuración de Runway ML',
            description: 'Aprende a configurar y usar Runway ML para generación de videos con IA',
            content: 'Configuración completa de cuenta, navegación por la interfaz, parámetros básicos y creación de tu primer video con Runway ML.',
            deliverable: 'Video de 30 segundos generado con Runway ML.',
            duration: 15,
            type: 'Práctica'
          },
          {
            id: '2.2',
            title: 'Dominio de Synthesia',
            description: 'Crea videos con avatares digitales usando Synthesia',
            content: 'Selección de avatares, personalización de voces, creación de guiones efectivos y producción de videos con presentadores virtuales.',
            deliverable: 'Video promocional con avatar digital.',
            duration: 12,
            type: 'Práctica'
          },
          {
            id: '2.3',
            title: 'Automatización con Lumen5',
            description: 'Convierte contenido escrito en videos automáticamente con Lumen5',
            content: 'Importación de texto, selección automática de medios, personalización de plantillas y optimización para diferentes plataformas.',
            deliverable: 'Video automatizado a partir de artículo de blog.',
            duration: 10,
            type: 'Práctica'
          },
          {
            id: '2.4',
            title: 'Edición avanzada con InVideo',
            description: 'Crea videos profesionales con las funciones avanzadas de InVideo',
            content: 'Plantillas profesionales, efectos especiales, transiciones inteligentes y exportación optimizada para múltiples plataformas.',
            deliverable: 'Video publicitario de 60 segundos.',
            duration: 13,
            type: 'Práctica'
          },
          {
            id: '2.5',
            title: 'Optimización con Pictory',
            description: 'Optimiza y personaliza videos usando las funciones de Pictory',
            content: 'Análisis automático de contenido, generación de resúmenes visuales, creación de highlights y optimización de engagement.',
            deliverable: 'Video optimizado para redes sociales.',
            duration: 10,
            type: 'Práctica'
          }
        ]
      },
      {
        id: 3,
        title: 'MÓDULO 3: Generación de Contenido con IA',
        description: 'Aprende a generar guiones, storyboards y contenido audiovisual utilizando inteligencia artificial',
        duration: 75,
        type: 'Teoría',
        lessonsCount: 6,
        subLessons: [
          {
            id: '3.1',
            title: 'Creación de guiones con IA',
            description: 'Utiliza herramientas de IA para generar guiones efectivos y atractivos',
            content: 'Técnicas de prompting para guiones, estructura narrativa, hooks efectivos y calls-to-action persuasivos usando ChatGPT y herramientas especializadas.',
            deliverable: 'Guión completo para video de 3 minutos.',
            duration: 15,
            type: 'Práctica'
          },
          {
            id: '3.2',
            title: 'Storyboards automáticos',
            description: 'Genera storyboards visuales automáticamente con herramientas de IA',
            content: 'Conversión de guiones a storyboards, generación de imágenes conceptuales, secuenciación visual y planificación de tomas.',
            deliverable: 'Storyboard completo con 12 escenas.',
            duration: 12,
            type: 'Práctica'
          },
          {
            id: '3.3',
            title: 'Generación de voces sintéticas',
            description: 'Crea locuciones profesionales usando síntesis de voz con IA',
            content: 'Selección de voces, ajuste de entonación y velocidad, sincronización con video y postproducción de audio.',
            deliverable: 'Locución profesional para tu video.',
            duration: 10,
            type: 'Práctica'
          },
          {
            id: '3.4',
            title: 'Música y efectos con IA',
            description: 'Genera bandas sonoras y efectos de sonido usando inteligencia artificial',
            content: 'Composición automática de música, selección de géneros apropiados, efectos de sonido temáticos y mezcla profesional.',
            deliverable: 'Banda sonora completa de 3 minutos.',
            duration: 13,
            type: 'Práctica'
          },
          {
            id: '3.5',
            title: 'Automatización de subtítulos',
            description: 'Genera subtítulos automáticos y optimízalos para accesibilidad',
            content: 'Transcripción automática, traducción multiidioma, sincronización precisa y personalización visual de subtítulos.',
            deliverable: 'Video con subtítulos en 3 idiomas.',
            duration: 12,
            type: 'Práctica'
          },
          {
            id: '3.6',
            title: 'Integración de elementos visuales',
            description: 'Combina todos los elementos para crear videos cohesivos y profesionales',
            content: 'Composición final, balance de elementos, coherencia visual, timing perfecto y exportación optimizada.',
            deliverable: 'Video profesional completo de 5 minutos.',
            duration: 13,
            type: 'Proyecto'
          }
        ]
      },
      {
        id: 4,
        title: 'MÓDULO 4: Edición y Post-producción',
        description: 'Domina las técnicas de edición y post-producción con herramientas de IA para crear videos profesionales',
        duration: 90,
        type: 'Teoría',
        lessonsCount: 5,
        subLessons: [
          {
            id: '4.1',
            title: 'Color grading automático',
            description: 'Aplica corrección de color profesional usando IA',
            content: 'Análisis automático de color, aplicación de LUTs inteligentes, corrección de exposición y balance de blancos con herramientas de IA.',
            deliverable: 'Video con color grading profesional.',
            duration: 18,
            type: 'Práctica'
          },
          {
            id: '4.2',
            title: 'Efectos especiales con IA',
            description: 'Añade efectos especiales cinematográficos usando inteligencia artificial',
            content: 'Eliminación de fondos, efectos de partículas, simulación de clima, efectos de cámara y composición avanzada.',
            deliverable: 'Secuencia con 5 efectos especiales diferentes.',
            duration: 20,
            type: 'Práctica'
          },
          {
            id: '4.3',
            title: 'Estabilización y mejora automática',
            description: 'Mejora la calidad técnica de tus videos automáticamente',
            content: 'Estabilización inteligente, aumento de resolución, reducción de ruido, mejora de nitidez y restauración automática.',
            deliverable: 'Video mejorado técnicamente.',
            duration: 15,
            type: 'Práctica'
          },
          {
            id: '4.4',
            title: 'Transiciones inteligentes',
            description: 'Crea transiciones fluidas y profesionales con IA',
            content: 'Análisis de contenido para transiciones apropiadas, morphing inteligente, match cuts automáticos y flujo narrativo optimizado.',
            deliverable: 'Secuencia con 10 transiciones profesionales.',
            duration: 17,
            type: 'Práctica'
          },
          {
            id: '4.5',
            title: 'Renderizado y exportación optimizada',
            description: 'Optimiza la exportación de videos para diferentes plataformas y usos',
            content: 'Configuración de codecs, optimización para plataformas específicas, batch processing y control de calidad automatizado.',
            deliverable: 'Video exportado para 5 plataformas diferentes.',
            duration: 20,
            type: 'Práctica'
          }
        ]
      },
      {
        id: 5,
        title: 'MÓDULO 5: Optimización y Distribución',
        description: 'Optimiza tus videos para diferentes plataformas y aprende estrategias de distribución efectivas',
        duration: 60,
        type: 'Teoría',
        lessonsCount: 4,
        subLessons: [
          {
            id: '5.1',
            title: 'Optimización para plataformas sociales',
            description: 'Adapta tus videos para maximizar el rendimiento en cada plataforma social',
            content: 'Formatos específicos por plataforma, aspectos técnicos de YouTube, Instagram, TikTok, LinkedIn y Facebook. Algoritmos y mejores prácticas.',
            deliverable: 'Video optimizado para 5 plataformas sociales.',
            duration: 20,
            type: 'Práctica'
          },
          {
            id: '5.2',
            title: 'SEO y metadatos para videos',
            description: 'Optimiza la visibilidad de tus videos en motores de búsqueda',
            content: 'Investigación de keywords, optimización de títulos y descripciones, tags efectivos, thumbnails que convierten y estructuración de playlists.',
            deliverable: 'Estrategia SEO completa para tu canal.',
            duration: 15,
            type: 'Estrategia'
          },
          {
            id: '5.3',
            title: 'Analytics y métricas de rendimiento',
            description: 'Mide y analiza el rendimiento de tus videos para optimizar resultados',
            content: 'KPIs importantes, herramientas de analytics, interpretación de métricas, A/B testing y optimización basada en datos.',
            deliverable: 'Dashboard de métricas personalizado.',
            duration: 12,
            type: 'Análisis'
          },
          {
            id: '5.4',
            title: 'Estrategias de monetización',
            description: 'Aprende diferentes formas de monetizar tu contenido audiovisual',
            content: 'Modelos de monetización, programas de afiliados, sponsorships, venta de productos digitales y servicios de producción de video.',
            deliverable: 'Plan de monetización para 6 meses.',
            duration: 13,
            type: 'Negocio'
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
      1: ['vpc1.1', 'vpc1.2', 'vpc1.3'],
      2: ['vpc2.1', 'vpc2.2', 'vpc2.3', 'vpc2.4', 'vpc2.5'],
      3: ['vpc3.1', 'vpc3.2', 'vpc3.3', 'vpc3.4', 'vpc3.5', 'vpc3.6'],
      4: ['vpc4.1', 'vpc4.2', 'vpc4.3', 'vpc4.4', 'vpc4.5'],
      5: ['vpc5.1', 'vpc5.2', 'vpc5.3', 'vpc5.4']
    };
    return lessonsByModule[moduleId] || [];
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    const moduleLessons = getModuleLessons(moduleId);
    return moduleLessons.every(lessonId => completedLessons.includes(lessonId));
  };

  // Calcular módulos completados (hay 5 módulos en total)
  const getCompletedModulesCount = (): number => {
    let completedCount = 0;
    for (let moduleId = 1; moduleId <= 5; moduleId++) {
      if (isModuleCompleted(moduleId)) {
        completedCount++;
      }
    }
    return completedCount;
  };

  // Calcular porcentaje de progreso basado en módulos (5 módulos total)
  const getModuleProgressPercentage = (): number => {
    const completedModules = getCompletedModulesCount();
    return Math.round((completedModules / 5) * 100);
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
      <style jsx>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
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
                  src="/images/15.png" 
                  alt="Curso Videos Profesionales con IA"
                />
                <div className="sticky-play-icon">
                  <svg width="12" height="14" viewBox="0 0 20 24" fill="none">
                    <path d="M0 2.4C0 1.07 1.34 0.16 2.5 0.83L18.5 11.43C19.66 12.1 19.66 13.9 18.5 14.57L2.5 23.17C1.34 23.84 0 22.93 0 21.6V2.4Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="sticky-course-title">
                <h3>Videos Profesionales con IA</h3>
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
                    Crea videos profesionales<br />
                    con IA en minutos —<br />
                    Sin experiencia previa<br />
                    ni equipo costoso
                  </h1>
                  <p className="hero-subtext">
                    Domina las herramientas más potentes de inteligencia artificial
                    para crear contenido audiovisual impactante que genere...
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
                          src="/images/15.png" 
                          alt="Vista previa del curso Videos Profesionales con IA"
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
                    Transforma la manera en que creas contenido audiovisual con las herramientas de inteligencia artificial más potentes del mercado. En este curso intensivo, dominarás desde cero las técnicas y estrategias para producir videos profesionales que capten la atención, generen engagement y conviertan sin necesidad de equipo costoso ni años de experiencia.
                  </p>
                  <div className="desc-separator" />
                  <div className="desc-body">
                    <p className="desc-paragraph">Descubrirás el poder de herramientas como Runway ML, Synthesia, Lumen5 e InVideo para crear contenido que antes requería equipos enteros de producción.</p>
                    <p className="desc-paragraph">Aplicarás técnicas probadas de guionización, storyboarding y post-producción automatizada que te ahorrarán horas de trabajo manual.</p>
                    <p className="desc-paragraph">Desarrollarás una estrategia completa para diferentes plataformas y aprenderás a optimizar cada video para máximo impacto y alcance.</p>
                    <p className="desc-paragraph">Implementarás flujos de trabajo profesionales que te permitirán escalar tu producción de contenido sin comprometer la calidad.</p>
                    <p className="desc-closure">Al completar este curso, tendrás las habilidades y herramientas necesarias para crear videos profesionales que destaquen en cualquier plataforma y generen los resultados que buscas.</p>
                  </div>
                </div>

                {/* Trigger para activar navbar sticky a partir de Objetivos */}
                <div ref={stickyTriggerRef} aria-hidden style={{ height: 1 }} />

                {/* What You'll Learn */}
                <div className="learning-objectives">
                  <div className="objectives-header">
                    <span className="section-badge">Objetivos</span>
                    <h2 className="objectives-title">Lo que vas a conseguir con este curso</h2>
                    <p className="section-lead">Enfocado en resultados reales: dominio técnico, flujo de trabajo optimizado y aplicabilidad inmediata en el mercado actual.</p>
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
                              <p className="testimonial-text">Creé mi primer video profesional en menos de 2 horas. Las herramientas de IA realmente hacen toda la diferencia, el proceso es increíblemente intuitivo.</p>
                              <div className="testimonial-author">- María S.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">El módulo de Synthesia me cambió la perspectiva. Ahora puedo crear contenido para mis clientes sin aparecer en cámara y el resultado es espectacular.</p>
                              <div className="testimonial-author">- Carlos R.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Slide 2 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Las técnicas de post-producción con IA me ahorraron literalmente días de trabajo. Mis videos ahora tienen calidad cinematográfica.</p>
                              <div className="testimonial-author">- Ana L.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Excelente curso, muy práctico. El instructor explica todo paso a paso y los ejemplos son súper útiles para aplicar inmediatamente.</p>
                              <div className="testimonial-author">- Roberto M.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Slide 3 */}
                      <div className="review-slide">
                        <div className="review-grid2">
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">Multipliqué mi productividad por 10. Antes tardaba semanas en crear contenido, ahora lo hago en horas manteniendo calidad profesional.</p>
                              <div className="testimonial-author">- Lucía G.</div>
                            </div>
                          </div>
                          <div className="testimonial-card">
                            <div className="testimonial-body">
                              <p className="testimonial-text">La sección de optimización para plataformas es oro puro. Mis videos ahora tienen mucho más alcance y engagement en todas las redes.</p>
                              <div className="testimonial-author">- Fernando T.</div>
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
              <div className="course-card" onClick={() => router.push('/curso/monetiza-voz-ia-elevenlabs')}>
                <div className="course-image-wrapper">
                  <img src="/images/courses/monetiza-voz-ia.png" alt="Monetiza tu Voz con IA" className="course-image" />
                  <span className="course-badge eplus">e Plus</span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">Monetiza tu Voz con IA</h3>
                  <p className="course-description">Aprende a monetizar tu voz usando ElevenLabs para crear contenido de alta calidad</p>
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
                <summary className="faq-question">¿Necesito experiencia previa en edición de video?</summary>
                <div className="faq-answer">
                  No. El curso está diseñado para principiantes. Solo requieres una computadora con internet. Las herramientas de IA simplifican enormemente el proceso de creación.
                </div>
              </details>
              <details className="faq-item">
                <summary className="faq-question">¿Puedo usar comercialmente los videos creados con estas herramientas?</summary>
                <div className="faq-answer">
                  Sí, la mayoría de herramientas incluidas tienen licencias comerciales. En el curso incluimos una guía detallada sobre licencias y términos de uso para cada herramienta.
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