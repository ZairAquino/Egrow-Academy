'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';
import AchievementNotification from '@/components/ui/AchievementNotification';

export default function ContenidoMonetizaVozIAPage() {
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  
  // Estados para notificaciones de logros
  const [showModuleNotification, setShowModuleNotification] = useState(false);
  const [showCourseNotification, setShowCourseNotification] = useState(false);
  const [achievementData, setAchievementData] = useState({
    type: 'module' as 'module' | 'course',
    title: '',
    message: '',
    stats: {
      completed: 0,
      total: 0,
      percentage: 0
    }
  });
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    progress,
    isLoading,
    progressPercentage,
    saveProgress,
    markLessonComplete,
    setCurrentLesson
  } = useCourseProgress('monetiza-voz-ia-elevenlabs', isEnrolled);

  const courseData = {
    id: 'monetiza-voz-ia-elevenlabs',
    title: 'Monetiza tu Voz con IA: ElevenLabs',
    description: 'Aprende a monetizar tu voz utilizando inteligencia artificial con ElevenLabs para anuncios, cursos y podcasts.',
    lessons: [
      // MÓDULO 1 - Fundamentos y contexto
      {
        id: 'cme32go3u0001e5jk05eq8352',
        moduleId: 1,
        title: '1.1 Origen de ElevenLabs (story breve)',
        duration: '25 min',
        type: 'video',
        description: 'Conoce la historia y origen de ElevenLabs, cómo surgió y por qué se ha convertido en líder de síntesis de voz con IA',
        videoUrl: 'https://youtu.be/A8DsAaICUss',
        content: `
          <h2>1.1 Origen de ElevenLabs (story breve)</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;"><strong>En esta lección:</strong> Descubre la fascinante historia detrás de ElevenLabs y cómo se convirtió en la empresa líder mundial en síntesis de voz con IA.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🚀 Los inicios (2022)</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.7;">ElevenLabs fue fundada en 2022 por <strong>Piotr Dabkowski</strong> y <strong>Mati Staniszewski</strong>, dos ex-ingenieros de Google con una visión clara: democratizar la creación de contenido de audio mediante inteligencia artificial.</p>
            
            <h4 style="color: #1e293b; margin: 1.5rem 0 1rem 0;">El problema que identificaron:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Las voces sintéticas sonaban robóticas y poco naturales</li>
              <li style="margin: 0.5rem 0;">• La clonación de voz requería horas de grabación</li>
              <li style="margin: 0.5rem 0;">• Las soluciones existentes eran complejas y costosas</li>
              <li style="margin: 0.5rem 0;">• No había multiidioma de calidad profesional</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">💡 La innovación clave</h3>
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 1rem 0; color: #1e40af; line-height: 1.7;"><strong>Breakthrough tecnológico:</strong> Desarrollaron un modelo de IA capaz de clonar voces con apenas <strong>1 minuto de audio</strong> y generar speech que es prácticamente indistinguible de una voz humana real.</p>
            
            <h4 style="color: #1e40af; margin: 1.5rem 0 1rem 0;">Lo que los diferencia:</h4>
            <ul style="margin: 0; color: #1e40af; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• <strong>Velocidad:</strong> Clonación en minutos vs. horas</li>
              <li style="margin: 0.5rem 0;">• <strong>Calidad:</strong> Indistinguible de voz humana</li>
              <li style="margin: 0.5rem 0;">• <strong>Simplicidad:</strong> Interfaz intuitiva sin curva técnica</li>
              <li style="margin: 0.5rem 0;">• <strong>Multiidioma:</strong> Soporte nativo para 29+ idiomas</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">📈 Crecimiento exponencial</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0;">Timeline de hitos:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.75rem 0;"><strong>2022:</strong> Lanzamiento público - 10,000 usuarios en el primer mes</li>
              <li style="margin: 0.75rem 0;"><strong>2023:</strong> Serie A de $19M - Alcanza 1 millón de usuarios</li>
              <li style="margin: 0.75rem 0;"><strong>2024:</strong> Valoración de $1.1 billones - Más de 5 millones de usuarios</li>
              <li style="margin: 0.75rem 0;"><strong>Actualidad:</strong> Líder mundial en síntesis de voz IA</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🌟 ¿Por qué eligieron este nombre?</h3>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46; line-height: 1.7;"><strong>"ElevenLabs"</strong> hace referencia al concepto de <em>"turning it up to eleven"</em> (llevarlo al nivel 11), una expresión que significa superar todos los límites establecidos. Exactamente lo que hicieron con la síntesis de voz.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🎯 Su impacto actual</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.7;">Hoy ElevenLabs es usado por:</p>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• <strong>Creadores de contenido:</strong> YouTubers, podcasters, TikTokers</li>
              <li style="margin: 0.5rem 0;">• <strong>Empresas:</strong> Netflix, Spotify, The Washington Post</li>
              <li style="margin: 0.5rem 0;">• <strong>Desarrolladores:</strong> Miles de apps integran su API</li>
              <li style="margin: 0.5rem 0;">• <strong>Emprendedores:</strong> Agencias, freelancers, consultores</li>
            </ul>
          </div>

          <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #eab308;">
            <h4 style="color: #a16207; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>💰</span> Oportunidad de negocio
            </h4>
            <p style="margin: 0; color: #a16207; line-height: 1.6;">Esta historia de éxito representa una oportunidad única: estamos en los primeros años de una revolución tecnológica. Los que aprendan a monetizar esta herramienta <strong>ahora</strong> tendrán ventaja competitiva durante años.</p>
          </div>
        `
      },
      {
        id: 'cme32goam0003e5jk3mkyp4ee',
        moduleId: 1,
        title: '1.2 Alcances y límites (ética y uso responsable)',
        duration: '30 min',
        type: 'video',
        description: 'Comprende las capacidades y limitaciones de la tecnología, así como las mejores prácticas éticas para su uso responsable',
        videoUrl: 'https://youtu.be/rxAa5zYjYbs',
        content: `
          <h2>1.2 Alcances y límites (ética y uso responsable)</h2>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #ef4444;">
            <h4 style="color: #b91c1c; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚠️</span> Importante
            </h4>
            <p style="margin: 0; color: #b91c1c; line-height: 1.6;">Con gran poder viene gran responsabilidad. Esta lección te enseña los límites éticos y legales para usar ElevenLabs de manera responsable y profesional.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🎯 Lo que aprenderás en el video:</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• <strong>Capacidades reales</strong> vs. expectativas de ElevenLabs</li>
              <li style="margin: 0.5rem 0;">• <strong>Limitaciones técnicas</strong> que debes conocer</li>
              <li style="margin: 0.5rem 0;">• <strong>Principios éticos</strong> fundamentales</li>
              <li style="margin: 0.5rem 0;">• <strong>Casos prohibidos</strong> y consecuencias legales</li>
              <li style="margin: 0.5rem 0;">• <strong>Mejores prácticas</strong> para uso comercial</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">📋 Reglas de oro:</h3>
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #10b981;">
            <ul style="margin: 0; color: #065f46; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✅ <strong>Siempre</strong> obtén consentimiento para clonar voces</li>
              <li style="margin: 0.5rem 0;">✅ <strong>Incluye disclaimers</strong> cuando uses IA de voz</li>
              <li style="margin: 0.5rem 0;">✅ <strong>Documenta permisos</strong> y contratos</li>
              <li style="margin: 0.5rem 0;">❌ <strong>Nunca</strong> uses voces sin autorización</li>
              <li style="margin: 0.5rem 0;">❌ <strong>Evita</strong> crear contenido engañoso</li>
            </ul>
          </div>

          <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #eab308;">
            <h4 style="color: #a16207; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>💼</span> Para tu negocio
            </h4>
            <p style="margin: 0; color: #a16207; line-height: 1.6;">Entender estos límites te permitirá ofrecer servicios profesionales y confiables, diferenciándote de quienes no siguen las buenas prácticas.</p>
          </div>
        `
      },
      {
        id: 'cme32goey0005e5jkpt31edta',
        moduleId: 1,
        title: '1.3 Panorama TTS (comparativa rápida)',
        duration: '25 min',
        type: 'video',
        description: 'Analiza el mercado de Text-to-Speech comparando ElevenLabs con otras soluciones disponibles',
        videoUrl: 'https://youtu.be/UriJThTDRdU',
        content: `
          <h2>1.3 Panorama TTS (comparativa rápida)</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;"><strong>En esta lección:</strong> Conoce las principales alternativas en el mercado TTS y por qué ElevenLabs está dominando el sector.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🥊 Las principales competencias:</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• <strong>Amazon Polly</strong> - El gigante corporativo</li>
              <li style="margin: 0.5rem 0;">• <strong>Google Cloud TTS</strong> - Integración con ecosistema Google</li>
              <li style="margin: 0.5rem 0;">• <strong>Microsoft Azure</strong> - Fuerza en el sector empresarial</li>
              <li style="margin: 0.5rem 0;">• <strong>Murf, Synthesia</strong> - Los challengers creativos</li>
              <li style="margin: 0.5rem 0;">• <strong>OpenAI TTS</strong> - El nuevo jugador</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🎯 Lo que verás en la comparativa:</h3>
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #3b82f6;">
            <ul style="margin: 0; color: #1e40af; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🎭 <strong>Calidad de voz</strong> - Pruebas de naturalidad</li>
              <li style="margin: 0.5rem 0;">⚡ <strong>Velocidad</strong> - Tiempos de clonación y generación</li>
              <li style="margin: 0.5rem 0;">💰 <strong>Precios</strong> - Análisis costo-beneficio real</li>
              <li style="margin: 0.5rem 0;">🔧 <strong>Facilidad de uso</strong> - Curva de aprendizaje</li>
              <li style="margin: 0.5rem 0;">🌍 <strong>Multiidioma</strong> - Soporte y calidad por idioma</li>
            </ul>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🏆</span> Spoiler
            </h4>
            <p style="margin: 0; color: #065f46; line-height: 1.6;">ElevenLabs no solo compite... está <strong>redefiniendo</strong> lo que esperamos de la síntesis de voz. Descubre por qué en el video.</p>
          </div>
        `
      },

      // MÓDULO 2 - Taller práctico de ElevenLabs
      {
        id: 'cme32lcta0001e5fgd5kgyuq0',
        moduleId: 2,
        title: '2.1 Introducción al flujo',
        duration: '25 min',
        type: 'video',
        description: 'Visión general del proceso completo que dominarás: desde configuración hasta producción final',
        videoUrl: 'https://youtu.be/hkLArzza4Tg',
        content: `
          <h2>2.1 Introducción al flujo</h2>
          
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af; line-height: 1.6;"><strong>¡Bienvenido al Módulo 2!</strong> Aquí es donde pasamos de la teoría a la práctica. Aprenderás el flujo completo de trabajo con ElevenLabs.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🔄 El flujo completo (5 pasos):</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ol style="margin: 0; color: #475569; line-height: 1.7; padding-left: 1.5rem;">
              <li style="margin: 0.75rem 0;"><strong>Preparación del texto</strong> - Optimización para TTS</li>
              <li style="margin: 0.75rem 0;"><strong>Selección y configuración</strong> - Voz y parámetros</li>
              <li style="margin: 0.75rem 0;"><strong>Generación</strong> - Proceso de síntesis</li>
              <li style="margin: 0.75rem 0;"><strong>Refinamiento</strong> - Ajustes y mejoras</li>
              <li style="margin: 0.75rem 0;"><strong>Postproducción</strong> - Toques finales profesionales</li>
            </ol>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🎯 Lo que dominarás:</h3>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #10b981;">
            <ul style="margin: 0; color: #065f46; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">⚡ <strong>Eficiencia</strong> - Workflow optimizado para producción</li>
              <li style="margin: 0.5rem 0;">🎛️ <strong>Configuraciones</strong> - Parámetros para diferentes casos</li>
              <li style="margin: 0.5rem 0;">🔧 <strong>Herramientas</strong> - Stack tecnológico recomendado</li>
              <li style="margin: 0.5rem 0;">📊 <strong>Control de calidad</strong> - Estándares profesionales</li>
            </ul>
          </div>

          <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #eab308;">
            <h4 style="color: #a16207; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>💡</span> Consejo pro
            </h4>
            <p style="margin: 0; color: #a16207; line-height: 1.6;">Un flujo bien estructurado te permitirá <strong>escalar tu negocio</strong> y entregar proyectos de manera consistente y profesional.</p>
          </div>
        `
      },
      {
        id: 'cme32ld000003e5fgq9w1ydfu',
        moduleId: 2,
        title: '2.2 Text-to-Speech (TTS) base',
        duration: '35 min',
        type: 'video',
        description: 'Aprende a convertir texto en voz natural y profesional, con práctica guiada paso a paso',
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-2-2',
        content: `Contenido de la lección 2.2 sobre TTS base...`
      },
      {
        id: 'cme32ld4f0005e5fgde8rgcq0',
        moduleId: 2,
        title: '2.3 Mejora, cambio y traducción de voz',
        duration: '40 min',
        type: 'video',
        description: 'Personalización avanzada: modifica características de voz y traduce contenido a múltiples idiomas',
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-2-3',
        content: `Contenido de la lección 2.3 sobre mejora y traducción...`
      },
      {
        id: 'cme32ld8u0007e5fgx1xvewoa',
        moduleId: 2,
        title: '2.4 Postproducción (toques pro)',
        duration: '20 min',
        type: 'video',
        description: 'Técnicas de postproducción avanzada para transformar tu audio en contenido con calidad broadcast',
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-2-4',
        content: `Contenido de la lección 2.4 sobre postproducción profesional...`
      },
      
      // MÓDULO 3 - Casos reales y modelo de negocio
      {
        id: 'cme32r9vf0001e5oomp7hne2b',
        moduleId: 3,
        title: '3.1 Casos de la vida real',
        duration: '40 min',
        type: 'video',
        description: 'Transforma conceptos teóricos en prácticas reales que puedes implementar en tu día a día o negocio',
        videoUrl: 'https://youtu.be/9Hg--CjVKpc',
        content: `
          <h2>3.1 Casos de la vida real</h2>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46; line-height: 1.6;"><strong>¡Llegó el momento de la verdad!</strong> En esta lección verás casos reales de personas que ya están monetizando ElevenLabs exitosamente.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">💼 Casos reales que verás:</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🎙️ <strong>Podcaster</strong> - Expansión multiidioma sin regrabar</li>
              <li style="margin: 0.5rem 0;">📱 <strong>Creador de TikTok</strong> - Contenido viral automatizado</li>
              <li style="margin: 0.5rem 0;">🏢 <strong>Agencia de marketing</strong> - Reducción 80% costos de locución</li>
              <li style="margin: 0.5rem 0;">👩‍🏫 <strong>Educadora online</strong> - Cursos accesibles para discapacidad visual</li>
              <li style="margin: 0.5rem 0;">🚀 <strong>Startup</strong> - IVR personalizado que convierte más</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🎯 Qué aprenderás de cada caso:</h3>
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #3b82f6;">
            <ul style="margin: 0; color: #1e40af; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">💡 <strong>El problema</strong> que identificaron</li>
              <li style="margin: 0.5rem 0;">🔧 <strong>La solución</strong> con ElevenLabs que implementaron</li>
              <li style="margin: 0.5rem 0;">💰 <strong>Los números</strong> - Ingresos y ahorros reales</li>
              <li style="margin: 0.5rem 0;">📈 <strong>El impacto</strong> en su negocio</li>
              <li style="margin: 0.5rem 0;">🔄 <strong>Cómo replicar</strong> su estrategia</li>
            </ul>
          </div>

          <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #eab308;">
            <h4 style="color: #a16207; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🚀</span> Tu oportunidad
            </h4>
            <p style="margin: 0; color: #a16207; line-height: 1.6;">Estos casos te darán <strong>ideas concretas</strong> y <strong>validación</strong> de que sí es posible generar ingresos reales con IA de voz. ¡Es tu turno!</p>
          </div>
        `
      },
      {
        id: 'cme32ra2o0003e5ooh7f4rnci',
        moduleId: 3,
        title: '3.2 ElevenLabs como negocio',
        duration: '35 min',
        type: 'video',
        description: 'Convierte tu conocimiento de ElevenLabs en un negocio rentable con ofertas específicas y precios competitivos',
        videoUrl: 'https://youtu.be/PxiDelrUerY',
        content: `
          <h2>3.2 ElevenLabs como negocio</h2>
          
          <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #eab308;">
            <p style="margin: 0; color: #a16207; line-height: 1.6;"><strong>💰 Es hora de monetizar:</strong> Transforma tu conocimiento de ElevenLabs en un negocio rentable con estrategias probadas.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🎯 Servicios principales que aprenderás a ofrecer:</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🎙️ <strong>Doblaje exprés</strong> - 24-48h vs. 2-4 semanas tradicional</li>
              <li style="margin: 0.5rem 0;">🌍 <strong>Podcast multiidioma</strong> - Expande audiencia 300%</li>
              <li style="margin: 0.5rem 0;">📞 <strong>IVR personalizado</strong> - Sistemas telefónicos con tu voz</li>
              <li style="margin: 0.5rem 0;">📚 <strong>Cursos narrados</strong> - Producción masiva de contenido</li>
              <li style="margin: 0.5rem 0;">📱 <strong>Contenido para redes</strong> - TikTok, Reels automatizados</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">💵 Estructura de precios que verás:</h3>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #10b981;">
            <ul style="margin: 0; color: #065f46; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🥉 <strong>Básico:</strong> $25-50 por minuto de audio</li>
              <li style="margin: 0.5rem 0;">🥈 <strong>Profesional:</strong> $200-400 por episodio/proyecto</li>
              <li style="margin: 0.5rem 0;">🥇 <strong>Premium:</strong> $800-1,500 setup + mantenimiento</li>
              <li style="margin: 0.5rem 0;">📊 <strong>Márgenes:</strong> 300-500% sobre costos</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">📋 Lo que incluye tu toolkit de negocio:</h3>
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #3b82f6;">
            <ul style="margin: 0; color: #1e40af; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">📄 <strong>Contratos</strong> - Templates legales listos</li>
              <li style="margin: 0.5rem 0;">💰 <strong>Calculadora de precios</strong> - Para cotizar rápido</li>
              <li style="margin: 0.5rem 0;">🌐 <strong>Página de ventas</strong> - Template probado</li>
              <li style="margin: 0.5rem 0;">⚖️ <strong>Aspectos legales</strong> - Uso responsable</li>
            </ul>
          </div>

          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #ef4444;">
            <h4 style="color: #b91c1c; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🚀</span> Ventaja competitiva
            </h4>
            <p style="margin: 0; color: #b91c1c; line-height: 1.6;">Estás entre los <strong>primeros</strong> en dominar esta tecnología. Los que actúen ahora tendrán ventaja durante años.</p>
          </div>
        `
      },
      {
        id: 'cme32ra740005e5oo1x58gr72',
        moduleId: 3,
        title: '3.3 Conclusión y siguientes pasos',
        duration: '15 min',
        type: 'video',
        description: 'Recapitulación completa y tu plan de acción para monetizar la IA de voz en los próximos 30 días',
        videoUrl: 'https://youtu.be/ifec-fhjmgs',
        content: `
          <h2>3.3 Conclusión y siguientes pasos</h2>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46; line-height: 1.6;"><strong>🎉 ¡Felicidades!</strong> Has completado un viaje transformador desde los fundamentos hasta la creación de un negocio rentable con IA de voz.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">✅ Lo que has dominado:</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🏗️ <strong>Módulo 1:</strong> Fundamentos, ética y panorama competitivo</li>
              <li style="margin: 0.5rem 0;">🔧 <strong>Módulo 2:</strong> Flujo de trabajo profesional y técnicas avanzadas</li>
              <li style="margin: 0.5rem 0;">💼 <strong>Módulo 3:</strong> Casos reales y estructura de negocio rentable</li>
            </ul>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🎯 Tu plan de acción (próximos 30 días):</h3>
          <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #3b82f6;">
            <div style="margin: 0; color: #1e40af; line-height: 1.7;">
              <p style="margin: 0 0 1rem 0;"><strong>Semana 1-2:</strong> Validación y primeros ejemplos</p>
              <p style="margin: 0 0 1rem 0;"><strong>Semana 3:</strong> Construcción de oferta y precios</p>
              <p style="margin: 0 0 1rem 0;"><strong>Semana 4:</strong> Lanzamiento y primeros clientes</p>
            </div>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">🛠️ Recursos que tienes disponibles:</h3>
          <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid #eab308;">
            <ul style="margin: 0; color: #a16207; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">📋 <strong>Templates</strong> - Contratos, precios, políticas</li>
              <li style="margin: 0.5rem 0;">🔄 <strong>Workflows</strong> - Procesos optimizados documentados</li>
              <li style="margin: 0.5rem 0;">💡 <strong>Casos de estudio</strong> - Ejemplos reales para replicar</li>
              <li style="margin: 0.5rem 0;">⚖️ <strong>Marco legal</strong> - Uso responsable y ético</li>
            </ul>
          </div>

          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #ef4444;">
            <h4 style="color: #b91c1c; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚡</span> Tu momento es AHORA
            </h4>
            <p style="margin: 0; color: #b91c1c; line-height: 1.6;">La IA de voz está en su momento de <strong>adopción temprana</strong>. Los que dominen esta tecnología en los próximos meses tendrán <strong>ventaja competitiva durante años</strong>.</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; text-align: center;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0;">🚀 Tu próxima acción:</h4>
            <p style="margin: 0; color: #475569; line-height: 1.6; font-weight: 600;">Implementa tu primer caso de uso en las próximas <strong>48 horas</strong></p>
          </div>
        `
      }
    ]
  };

  // Agrupa las lecciones por módulo
  const moduleData = [
    {
      id: 1,
      title: 'Fundamentos y contexto',
      description: 'Entender de dónde viene ElevenLabs, en qué destaca y dónde usarlo con responsabilidad.',
      lessons: courseData.lessons.filter(lesson => lesson.moduleId === 1)
    },
    {
      id: 2,
      title: 'Taller práctico de ElevenLabs',
      description: 'Dominar las funciones esenciales y montar un flujo de trabajo completo.',
      lessons: courseData.lessons.filter(lesson => lesson.moduleId === 2)
    },
    {
      id: 3,
      title: 'Casos reales y modelo de negocio',
      description: 'Bajar a tierra (vida diaria y empresa) y convertirlo en oferta vendible.',
      lessons: courseData.lessons.filter(lesson => lesson.moduleId === 3)
    }
  ];

  // Estados para el progreso
  const currentLesson = progress?.completedLessons || [];
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [lessonContent, setLessonContent] = useState('');

  // Verificar inscripción al cargar
  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      setIsCheckingEnrollment(false);
    }
  }, [user]);

  const checkEnrollment = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setIsEnrolled(data.isEnrolled);
        
        if (!data.isEnrolled) {
          // Auto-inscribir si tiene acceso premium
          await enrollUser();
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  const enrollUser = async () => {
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: courseData.id }),
        credentials: 'include'
      });

      if (response.ok) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error('Error enrolling user:', error);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const selectLesson = (lesson: typeof courseData.lessons[0]) => {
    setSelectedLessonId(lesson.id);
    setLessonContent(lesson.content);
    setCurrentLesson(lesson.id);
  };

  const handleMarkComplete = async (lessonId: string) => {
    if (!isEnrolled) return;
    
    setIsSaving(true);
    try {
      await markLessonComplete(lessonId);
      
      // Verificar logros de módulo/curso
      checkAchievements(lessonId);
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const checkAchievements = (completedLessonId: string) => {
    const lesson = courseData.lessons.find(l => l.id === completedLessonId);
    if (!lesson) return;

    const moduleId = lesson.moduleId;
    const moduleLessons = courseData.lessons.filter(l => l.moduleId === moduleId);
    const completedModuleLessons = moduleLessons.filter(l => 
      currentLesson.includes(l.id) || l.id === completedLessonId
    );

    // Verificar logro de módulo
    if (completedModuleLessons.length === moduleLessons.length) {
      const moduleInfo = moduleData.find(m => m.id === moduleId);
      if (moduleInfo) {
        setAchievementData({
          type: 'module',
          title: `¡Módulo ${moduleId} Completado!`,
          message: `Has completado "${moduleInfo.title}"`,
          stats: {
            completed: completedModuleLessons.length,
            total: moduleLessons.length,
            percentage: 100
          }
        });
        setShowModuleNotification(true);
      }
    }

    // Verificar logro de curso completo
    const totalCompleted = currentLesson.length + 1; // +1 por la lección actual
    if (totalCompleted === courseData.lessons.length) {
      setAchievementData({
        type: 'course',
        title: '🎉 ¡Curso Completado!',
        message: 'Has completado todo el curso de Monetización con IA de Voz',
        stats: {
          completed: totalCompleted,
          total: courseData.lessons.length,
          percentage: 100
        }
      });
      setShowCourseNotification(true);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return currentLesson.includes(lessonId);
  };

  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(l => l.moduleId === moduleId);
    const completed = moduleLessons.filter(l => isLessonCompleted(l.id)).length;
    return {
      completed,
      total: moduleLessons.length,
      percentage: Math.round((completed / moduleLessons.length) * 100)
    };
  };

  // Mostrar loading mientras se verifica inscripción
  if (isCheckingEnrollment || isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando contenido del curso...</p>
      </div>
    );
  }

  // Si no está inscrito, redirigir
  if (!isEnrolled) {
    return (
      <div className="access-denied">
        <Navbar />
        <div className="container">
          <h1>Acceso Denegado</h1>
          <p>Necesitas estar inscrito en este curso para ver el contenido.</p>
          <button onClick={() => router.push('/curso/monetiza-voz-ia-elevenlabs')}>
            Volver al curso
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="main-content">
        <section className="course-header pt-14 md:pt-[95px]">
          <div className="container">
            <div className="course-header-content">
              <div className="course-breadcrumb">
                <div className="breadcrumb-container">
                  <a href="/" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🏠</span>
                    <span className="breadcrumb-text">Inicio</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/courses" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Cursos</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/curso/monetiza-voz-ia-elevenlabs" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎤</span>
                    <span className="breadcrumb-text">Monetiza tu Voz con IA</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item active">
                    <span className="breadcrumb-icon">📖</span>
                    <span className="breadcrumb-text">Contenido</span>
                  </span>
                </div>
              </div>
              
              <div className="header-main">
                <div className="header-content">
                  <h1 className="course-title">{courseData.title}</h1>
                  
                  <div className="header-actions">
                    <button 
                      className="btn btn-exit-course btn-save-exit"
                      onClick={() => router.push('/curso/monetiza-voz-ia-elevenlabs')}
                    >
                      🏠 Salir del Curso
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              <div className="main-content-area">
                <div className="current-lesson">
                  {selectedLessonId ? (
                    (() => {
                      const lesson = courseData.lessons.find(l => l.id === selectedLessonId);
                      if (!lesson) return null;

                      return (
                        <>
                          <div className="lesson-header">
                            <h2>{lesson.title}</h2>
                            <div className="lesson-meta">
                              <span className="lesson-type">{lesson.type}</span>
                              <span className="lesson-duration">{lesson.duration}</span>
                            </div>
                          </div>
                          
                          {lesson.videoUrl && (
                            <div className="video-container">
                              <VideoPlayer
                                videoUrl={lesson.videoUrl}
                                title={lesson.title}
                                className="lesson-video"
                              />
                            </div>
                          )}
                          
                          <div 
                            className="lesson-content"
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                          />
                          
                          <div className="lesson-actions">
                            <div className="lesson-buttons">
                              {!isLessonCompleted(lesson.id) && (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleMarkComplete(lesson.id)}
                                  disabled={isSaving}
                                >
                                  {isSaving ? '💾 Guardando...' : '✅ Completar Lección'}
                                </button>
                              )}
                              
                              {isLessonCompleted(lesson.id) && (
                                <div className="lesson-completed">
                                  <span>✅ Lección completada</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="welcome-content">
                      <h2>¡Bienvenido al curso!</h2>
                      <p>Selecciona una lección del menú lateral para comenzar tu aprendizaje.</p>
                      <div className="course-stats">
                        <div className="stat">
                          <h3>{courseData.lessons.length}</h3>
                          <p>Lecciones totales</p>
                        </div>
                        <div className="stat">
                          <h3>{moduleData.length}</h3>
                          <p>Módulos</p>
                        </div>
                        <div className="stat">
                          <h3>{Math.round(progressPercentage)}%</h3>
                          <p>Progreso</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="content-sidebar">
                <div className="lessons-navigation">
                  <div className="navigation-header">
                    <h3>Contenido del Curso</h3>
                    <div className="progress-indicator">
                      <span className="progress-text">
                        {currentLesson.length} de {courseData.lessons.length} completadas
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="course-guidance">
                    <p className="guidance-text">
                      💡 <strong>Navegación Libre:</strong> Puedes navegar entre todas las lecciones. Para completar el curso, debes marcar como completadas todas las lecciones de todos los módulos.
                    </p>
                  </div>
                  
                  <div className="lessons-list">
                    {moduleData.map((module) => {
                      const moduleProgress = getModuleProgress(module.id);
                      const isExpanded = expandedModules.has(module.id);
                      
                      return (
                        <div key={module.id} className="module-group">
                          <div 
                            className={`module-header ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleModule(module.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="module-title">
                              <span className="module-icon">
                                {moduleProgress.completed === moduleProgress.total ? '✅' : '📚'}
                              </span>
                              <span>MÓDULO {module.id}</span>
                              <span className="expand-icon">
                                {isExpanded ? '▼' : '▶'}
                              </span>
                            </div>
                            <div className="module-progress">
                              <span className="progress-text">
                                {moduleProgress.completed}/{moduleProgress.total}
                              </span>
                              <div className="progress-bar-mini">
                                <div 
                                  className="progress-fill-mini" 
                                  style={{ width: `${moduleProgress.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="module-lessons">
                              {module.lessons.map((lesson) => (
                                <div 
                                  key={lesson.id} 
                                  className={`lesson-item ${selectedLessonId === lesson.id ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}
                                  onClick={() => selectLesson(lesson)}
                                >
                                  <div className="lesson-number">{module.id}.{module.lessons.findIndex(l => l.id === lesson.id) + 1}</div>
                                  <div className="lesson-content">
                                    <h4>{lesson.title}</h4>
                                    <div className="lesson-meta">
                                      <span className="lesson-type">{lesson.type}</span>
                                      <span className="lesson-duration">{lesson.duration}</span>
                                    </div>
                                  </div>
                                  <div className="lesson-status">
                                    {isLessonCompleted(lesson.id) ? '✅' : selectedLessonId === lesson.id ? '▶️' : '⭕'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Notificaciones de logros */}
      {showModuleNotification && (
        <AchievementNotification
          type={achievementData.type}
          title={achievementData.title}
          message={achievementData.message}
          stats={achievementData.stats}
          onClose={() => setShowModuleNotification(false)}
        />
      )}
      
      {showCourseNotification && (
        <AchievementNotification
          type={achievementData.type}
          title={achievementData.title}
          message={achievementData.message}
          stats={achievementData.stats}
          onClose={() => setShowCourseNotification(false)}
        />
      )}

      <Footer />

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: #f8fafc;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
          color: #6b7280;
        }

        .access-denied {
          text-align: center;
          padding: 4rem 1rem;
        }

        .main-content {
          min-height: 100vh;
        }

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
          position: relative;
          overflow: hidden;
        }

        .course-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          z-index: 1;
        }

        .course-header-content {
          position: relative;
          z-index: 2;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-breadcrumb {
          margin-bottom: 2rem;
        }

        .breadcrumb-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .breadcrumb-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .breadcrumb-item.active {
          color: white;
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
        }

        .breadcrumb-icon {
          font-size: 1rem;
        }

        .breadcrumb-text {
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          margin: 0 0.25rem;
        }

        .header-main {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
          text-align: left;
          width: 100%;
        }

        .course-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-align: left;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
        }

        .btn-exit-course {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: 2px solid #dc2626;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-exit-course:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-color: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-exit-course:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .course-content {
          padding: 3rem 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .current-lesson {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .lesson-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f3f4f6;
        }

        .lesson-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .lesson-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .lesson-type {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .lesson-content {
          line-height: 1.7;
          color: #374151;
        }

        .lesson-content h2 {
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
        }

        .lesson-content h3 {
          color: #1f2937;
          margin: 1.25rem 0 0.75rem 0;
        }

        .lesson-content ul, .lesson-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .lesson-content li {
          margin: 0.5rem 0;
        }

        .lesson-content pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .lesson-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .lesson-actions {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f3f4f6;
        }

        .lesson-buttons {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        .lessons-navigation {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
        }

        .navigation-header {
          margin-bottom: 1.5rem;
        }

        .lessons-navigation h3 {
          margin: 0 0 0.75rem 0;
          color: #1f2937;
        }

        .progress-indicator {
          margin-bottom: 1rem;
        }

        .progress-text {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .course-guidance {
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
        }

        .guidance-text {
          margin: 0;
          font-size: 0.8rem;
          color: #1e40af;
          line-height: 1.5;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .module-group {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .module-header {
          background: #f9fafb;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .module-header:hover {
          background: #f3f4f6;
        }

        .module-header.expanded {
          background: #eff6ff;
          border-bottom: 1px solid #e5e7eb;
        }

        .module-header.completed {
          background: #ecfdf5;
          border-color: #d1fae5;
        }

        .module-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.8rem;
          color: #374151;
        }

        .module-icon {
          font-size: 1rem;
        }

        .expand-icon {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-left: 0.5rem;
          transition: transform 0.2s ease;
        }

        .module-header.expanded .expand-icon {
          transform: rotate(180deg);
        }

        .module-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .progress-bar-mini {
          width: 40px;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill-mini {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .module-lessons {
          background: white;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .module-header.expanded + .module-lessons {
          max-height: 500px;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lesson-item:last-child {
          border-bottom: none;
        }

        .lesson-item:hover {
          background: #f9fafb;
        }

        .lesson-item.active {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
        }

        .lesson-item.completed {
          background: #f0fdf4;
        }

        .lesson-item.locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lesson-item.locked:hover {
          background: transparent;
        }

        .lesson-number {
          background: #e5e7eb;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          min-width: 2.5rem;
          text-align: center;
        }

        .lesson-item.active .lesson-number {
          background: #3b82f6;
          color: white;
        }

        .lesson-item.completed .lesson-number {
          background: #10b981;
          color: white;
        }

        .lesson-item .lesson-content {
          flex: 1;
        }

        .lesson-item h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.85rem;
          font-weight: 500;
          color: #1f2937;
          line-height: 1.3;
        }

        .lesson-item .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: #6b7280;
        }

        .lesson-item .lesson-meta .lesson-type {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .lesson-status {
          font-size: 1rem;
        }

        .complete-course-section {
          margin-top: 1.5rem;
          padding: 1rem;
          text-align: center;
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          border-radius: 8px;
        }

        .completion-message {
          font-weight: 600;
          color: #065f46;
          margin-bottom: 0.75rem;
        }

        .btn-complete-course {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-complete-course:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .lessons-navigation {
            position: static;
          }

          .course-title {
            font-size: 1.8rem;
          }

          .current-lesson {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb-container {
            gap: 0.25rem;
          }

          .breadcrumb-item {
            padding: 0.375rem 0.5rem;
            font-size: 0.85rem;
          }

          .breadcrumb-text {
            display: none;
          }

          .lesson-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }

          .lesson-buttons .btn {
            width: 100%;
            justify-content: center;
          }
        }

        .progress-bar-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.3s ease;
        }

        .module-toggle {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .lessons-list {
          background: white;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f3f4f6;
        }

        .lesson-item:last-child {
          border-bottom: none;
        }

        .lesson-item:hover {
          background: #f9fafb;
        }

        .lesson-item.active {
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
        }

        .lesson-item.completed {
          background: #f0fdf4;
        }

        .lesson-status {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #10b981;
          flex-shrink: 0;
        }

        .lesson-info {
          flex: 1;
        }

        .lesson-info h5 {
          margin: 0 0 0.25rem 0;
          color: #1f2937;
          font-size: 0.85rem;
          font-weight: 500;
          line-height: 1.3;
        }

        .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: #6b7280;
        }

        .lesson-type {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.375rem;
          background: #f3f4f6;
          border-radius: 4px;
          font-weight: 500;
        }

        .lesson-type.video {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .lesson-type.lab {
          background: #dcfce7;
          color: #166534;
        }

        .lesson-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          min-height: 600px;
        }

        .lesson-viewer {
          padding: 2rem;
        }

        .lesson-header-content h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .lesson-header-content p {
          margin: 0 0 2rem 0;
          color: #6b7280;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .video-container {
          margin: 2rem 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .lesson-content-html {
          line-height: 1.7;
          color: #374151;
        }

        .lesson-content-html h2 {
          color: #1f2937;
          margin: 2rem 0 1rem 0;
          font-size: 1.5rem;
        }

        .lesson-content-html h3 {
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
          font-size: 1.25rem;
        }

        .lesson-actions {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .complete-lesson-btn {
          background: linear-gradient(135deg, #10b981, #065f46);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .complete-lesson-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .complete-lesson-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lesson-completed {
          display: flex;
          align-items: center;
          color: #10b981;
          font-weight: 600;
        }

        .welcome-content {
          padding: 3rem 2rem;
          text-align: center;
        }

        .welcome-content h2 {
          margin: 0 0 1rem 0;
          color: #1f2937;
          font-size: 2rem;
        }

        .welcome-content p {
          margin: 0 0 2rem 0;
          color: #6b7280;
          font-size: 1.1rem;
        }

        .course-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .stat {
          text-align: center;
        }

        .stat h3 {
          margin: 0;
          color: #3b82f6;
          font-size: 2rem;
          font-weight: 700;
        }

        .stat p {
          margin: 0.5rem 0 0 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .course-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .course-sidebar {
            position: static;
            order: 2;
          }

          .lesson-content {
            order: 1;
          }

          .lesson-viewer {
            padding: 1.5rem;
          }

          .welcome-content {
            padding: 2rem 1.5rem;
          }

          .course-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}