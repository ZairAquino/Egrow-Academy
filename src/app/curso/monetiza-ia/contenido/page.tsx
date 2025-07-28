'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import UserProfile from '@/components/auth/UserProfile';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';

export default function ContenidoMonetizaIAPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    progress,
    isLoading,
    progressPercentage,
    saveProgress,
    markLessonComplete,
    setCurrentLesson
  } = useCourseProgress('monetiza-ia', isEnrolled);

  const courseData = {
    id: 'monetiza-ia',
    title: 'Monetiza con la IA',
    description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.',
    lessons: [
      {
        id: 1,
        title: 'M0 - AI Money‑Toolkit',
        duration: '12 min',
        type: 'video',
        description: 'Intro | Herramientas - Checklist de apps y presets listos para facturar',
        videoUrl: 'https://www.youtube.com/watch?v=fOXqNPy_nDs',
        content: `
          <h2>M0 - AI Money‑Toolkit</h2>
          <h3>Intro | Herramientas</h3>
          <p>Checklist de apps y presets listos para facturar</p>
          
          <p>Bienvenido al toolkit definitivo para monetizar con IA. En este módulo descubrirás las herramientas esenciales que necesitas para empezar a generar ingresos inmediatamente.</p>
          
          <h3>Herramientas Esenciales para Facturar con IA:</h3>
          <ul>
            <li><strong>ChatGPT/Claude:</strong> Para generación de contenido y automatización</li>
            <li><strong>Canva + IA:</strong> Diseños profesionales en minutos</li>
            <li><strong>Notion AI:</strong> Organización y productividad</li>
            <li><strong>Stripe:</strong> Procesamiento de pagos</li>
            <li><strong>Gumroad:</strong> Venta de productos digitales</li>
            <li><strong>ConvertKit:</strong> Email marketing automatizado</li>
          </ul>
          
          <h3>Presets Listos para Usar:</h3>
          <p>Descarga plantillas y configuraciones pre-optimizadas que puedes implementar hoy mismo para empezar a generar ingresos.</p>
          
          <h3>Recursos de esta lección:</h3>
          <ul>
            <li><a href="#" class="resource-link">📋 Checklist completo de herramientas</a></li>
            <li><a href="#" class="resource-link">⚙️ Configuraciones pre-optimizadas</a></li>
            <li><a href="#" class="resource-link">🎯 Guía de implementación paso a paso</a></li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'M1 - Venta sin Fricción',
        duration: '18 min',
        type: 'video',
        description: 'Intro Ventas - Script de oferta listo para DM / llamada',
        videoUrl: 'https://www.youtube.com/watch?v=9J4due6xNmQ',
        content: `
          <h2>M1 - Venta sin Fricción</h2>
          <h3>Intro Ventas</h3>
          <p>Script de oferta listo para DM / llamada</p>
          
          <p>Aprende a vender sin fricción usando scripts probados y optimizados con IA para convertir prospectos en clientes pagando.</p>
          
          <h3>Estructura del Script de Venta:</h3>
          <ol>
            <li><strong>Apertura:</strong> Conecta con el problema específico</li>
            <li><strong>Agitación:</strong> Intensifica la urgencia del problema</li>
            <li><strong>Solución:</strong> Presenta tu oferta como la única alternativa</li>
            <li><strong>Prueba social:</strong> Testimonios y casos de éxito</li>
            <li><strong>Cierre:</strong> Call to action claro y directo</li>
          </ol>
          
          <h3>Scripts Optimizados:</h3>
          <ul>
            <li><strong>DM de Instagram/LinkedIn:</strong> 3 mensajes que convierten</li>
            <li><strong>Email de ventas:</strong> Secuencia de 5 emails</li>
            <li><strong>Llamada de ventas:</strong> Guión de 15 minutos</li>
          </ul>
          
          <h3>Personalización con IA:</h3>
          <p>Usa prompts específicos para adaptar cada script a tu nicho y audiencia, maximizando las conversiones.</p>
        `
      },
      {
        id: 3,
        title: 'M1.1 - Ayuda que Cierra',
        duration: '22 min',
        type: 'video',
        description: 'Vender & Ayudar - Mensaje Problema → Ayuda → Oferta (copiar‑pegar)',
        content: `
          <h2>M1.1 - Ayuda que Cierra</h2>
          <h3>Vender & Ayudar</h3>
          <p>Mensaje Problema → Ayuda → Oferta (copiar‑pegar)</p>
          
          <p>Domina el arte de vender ayudando. Convierte cada interacción en una oportunidad de venta natural y sin presión.</p>
          
          <h3>Flujo Problema → Ayuda → Oferta:</h3>
          <ol>
            <li><strong>Identificar el problema:</strong> Escucha activa y empatía</li>
            <li><strong>Ofrecer ayuda genuina:</strong> Valor inmediato y gratuito</li>
            <li><strong>Transición natural:</strong> De ayuda gratuita a solución premium</li>
          </ol>
          
          <h3>Plantillas Copy-Paste:</h3>
          <pre><code># Mensaje Tipo 1: Identificación de Problema
"Veo que estás luchando con [problema específico]. 
Esto es súper común en [industria/nicho]. 
¿Te gustaría que te comparta una estrategia 
que ha funcionado para clientes similares?"

# Mensaje Tipo 2: Ayuda Inmediata  
"Te envío un recurso gratuito que puede ayudarte 
con [problema]. Sin compromisos. Si te sirve, 
genial. Si tienes preguntas, aquí estoy."

# Mensaje Tipo 3: Transición a Oferta
"Me alegra que el recurso te haya servido. 
Si quieres resultados más rápidos y específicos 
para tu situación, tengo algo que puede interesarte..."</code></pre>
          
          <h3>Casos de Uso Específicos:</h3>
          <ul>
            <li><strong>Redes sociales:</strong> Comentarios que generan DMs</li>
            <li><strong>Email marketing:</strong> Secuencias de valor</li>
            <li><strong>Networking:</strong> Conversaciones que convierten</li>
          </ul>
        `
      },
      {
        id: 4,
        title: 'M2 - Soporte que Retiene',
        duration: '25 min',
        type: 'video',
        description: 'Servicio al Cliente - Plantilla post‑venta "fan for life"',
        videoUrl: 'https://www.youtube.com/watch?v=V02uxR3TMYo',
        content: `
          <h2>M2 - Soporte que Retiene</h2>
          <h3>Servicio al Cliente</h3>
          <p>Plantilla post‑venta "fan for life"</p>
          
          <p>Transforma clientes de una sola compra en fanáticos de por vida que compran repetidamente y te refieren constantemente.</p>
          
          <h3>Sistema de Retención "Fan for Life":</h3>
          <ol>
            <li><strong>Onboarding VIP:</strong> Primera impresión que sorprende</li>
            <li><strong>Check-ins proactivos:</strong> Seguimiento antes de que pregunten</li>
            <li><strong>Valor continuo:</strong> Recursos exclusivos post-compra</li>
            <li><strong>Comunidad:</strong> Conexión con otros clientes</li>
            <li><strong>Upgrades naturales:</strong> Evolución de servicios</li>
          </ol>
          
          <h3>Plantillas de Comunicación:</h3>
          <pre><code># Email de Bienvenida (Día 0)
Asunto: "🎉 ¡Bienvenido a la familia! Tu acceso está listo"

Hola [Nombre],
¡Qué emoción tenerte aquí! 
No es solo una compra, es el inicio de una transformación.

# Check-in Día 7
Asunto: "¿Cómo van tus primeros resultados?"

Hola [Nombre],
Una semana después de tu compra, quería saber:
- ¿Has implementado los primeros pasos?
- ¿Hay algo en lo que pueda ayudarte?

# Valor Continuo (Mensual)
Asunto: "🎁 Recurso exclusivo para ti"

[Nombre], como cliente VIP tienes acceso a este 
recurso que acabo de crear...</code></pre>
          
          <h3>Métricas de Retención:</h3>
          <ul>
            <li><strong>Tasa de uso del producto:</strong> 80%+ en primeros 30 días</li>
            <li><strong>Tasa de renovación:</strong> 90%+ clientes recurrentes</li>
            <li><strong>Net Promoter Score:</strong> 9+ de 10 recomendarían</li>
            <li><strong>Lifetime Value:</strong> 5x+ valor de primera compra</li>
          </ul>
        `
      },
      {
        id: 5,
        title: 'M2.1 - Diferénciate & Cobra Más',
        duration: '20 min',
        type: 'video',
        description: 'Diferénciate - One‑liner de posicionamiento ganador',
        content: `
          <h2>M2.1 - Diferénciate & Cobra Más</h2>
          <h3>Diferénciate</h3>
          <p>One‑liner de posicionamiento ganador</p>
          
          <p>Crea un posicionamiento único que te permita cobrar precios premium y eliminar la competencia directa.</p>
          
          <h3>Fórmula del One-Liner Ganador:</h3>
          <p><strong>[Resultado específico] para [audiencia específica] en [tiempo específico] sin [objeción principal]</strong></p>
          
          <h3>Ejemplos de One-Liners Poderosos:</h3>
          <ul>
            <li><strong>Consultor IA:</strong> "Aumento de ingresos del 40% para consultores en 90 días sin conocimientos técnicos"</li>
            <li><strong>Content Creator:</strong> "1M de vistas garantizadas para emprendedores en 6 meses sin mostrar la cara"</li>
            <li><strong>Coach:</strong> "Primeros $10K online para profesionales en 120 días sin audiencia previa"</li>
          </ul>
          
          <h3>Proceso de Diferenciación:</h3>
          <ol>
            <li><strong>Análisis de competencia:</strong> ¿Qué prometen todos?</li>
            <li><strong>Identificar gaps:</strong> ¿Qué nadie está prometiendo?</li>
            <li><strong>Validar con mercado:</strong> ¿Es esto lo que realmente quieren?</li>
            <li><strong>Crear proof points:</strong> ¿Cómo demuestro que es posible?</li>
          </ol>
          
          <h3>Estrategias de Precio Premium:</h3>
          <ul>
            <li><strong>Bundling inteligente:</strong> Combina servicios de alto valor</li>
            <li><strong>Garantías audaces:</strong> Reduce el riesgo percibido</li>
            <li><strong>Exclusividad:</strong> Limita disponibilidad o acceso</li>
            <li><strong>Resultados documentados:</strong> Case studies detallados</li>
          </ul>
        `
      },
      {
        id: 6,
        title: 'M3 - IA Amplify Engine',
        duration: '28 min',
        type: 'video',
        description: 'Marketing con IA - Flujo Prompt → Copy → Publica',
        content: `
          <h2>M3 - IA Amplify Engine</h2>
          <h3>Marketing con IA</h3>
          <p>Flujo Prompt → Copy → Publica</p>
          
          <p>Automatiza tu marketing con IA para generar contenido de calidad de manera consistente y escalable.</p>
          
          <h3>El Motor de Amplificación IA:</h3>
          <ol>
            <li><strong>Prompt Engineering:</strong> Comandos que generan oro</li>
            <li><strong>Copy Generation:</strong> Contenido que convierte</li>
            <li><strong>Multi-Platform Publishing:</strong> Distribución masiva</li>
          </ol>
          
          <h3>Prompts de Alto Rendimiento:</h3>
          <pre><code># Prompt para Posts Virales
"Crea un post para [plataforma] sobre [tema] que:
- Use el framework PAS (Problema-Agitación-Solución)
- Incluya hook emocional en primeras 7 palabras
- Termine con pregunta que genere engagement
- Tono: [casual/profesional/inspiracional]
- Audiencia: [descripción específica]"

# Prompt para Email Marketing
"Escribe un email de [tipo] para [audiencia] que:
- Subject line con 40% open rate
- Historia personal conectada al CTA
- Maximum 150 palabras
- CTA específico y urgente"</code></pre>
          
          <h3>Flujo de Automatización:</h3>
          <ul>
            <li><strong>Investigación automatizada:</strong> Tendencias y temas relevantes</li>
            <li><strong>Generación en lote:</strong> 30 posts en 30 minutos</li>
            <li><strong>Adaptación multi-formato:</strong> Post → Email → Video script</li>
            <li><strong>Programación inteligente:</strong> Horarios óptimos por plataforma</li>
          </ul>
          
          <h3>Métricas y Optimización:</h3>
          <p>Trackea engagement, clicks y conversiones para iterar prompts y mejorar resultados continuamente.</p>
        `
      },
      {
        id: 7,
        title: 'M3.1 - Mirror & Monetize',
        duration: '35 min',
        type: 'lab',
        description: 'Aplicarlo a uno mismo - Caso demo propio (antes / después)',
        content: `
          <h2>M3.1 - Mirror & Monetize</h2>
          <h3>Aplicarlo a uno mismo</h3>
          <p>Caso demo propio (antes / después)</p>
          
          <p>Implementa todo lo aprendido en tu propio negocio y documenta la transformación para crear un caso de estudio poderoso.</p>
          
          <h3>Proyecto de Transformación Personal:</h3>
          <ol>
            <li><strong>Auditoría inicial:</strong> Situación actual documentada</li>
            <li><strong>Implementación sistemática:</strong> Cada módulo aplicado</li>
            <li><strong>Medición de resultados:</strong> KPIs antes/después</li>
            <li><strong>Documentación del proceso:</strong> Video diario de progreso</li>
          </ol>
          
          <h3>Framework de Implementación:</h3>
          <pre><code># Semana 1: Setup y Baseline
- Instalar herramientas del M0
- Documentar métricas actuales (ingresos, audiencia, conversiones)
- Crear sistemas de medición

# Semana 2-3: Optimización de Ventas (M1 + M1.1)
- Implementar scripts de venta
- Testing A/B de mensajes
- Optimizar proceso de conversión

# Semana 4-5: Retención y Diferenciación (M2 + M2.1)
- Lanzar sistema de retención
- Refinar posicionamiento
- Ajustar precios

# Semana 6-8: Amplificación con IA (M3)
- Automatizar marketing
- Escalar contenido
- Optimizar distribución</code></pre>
          
          <h3>Documentación del Case Study:</h3>
          <ul>
            <li><strong>Video diario:</strong> 2-3 minutos de progreso</li>
            <li><strong>Screenshots de métricas:</strong> Evidencia cuantificable</li>
            <li><strong>Reflexiones escritas:</strong> Qué funcionó, qué no</li>
            <li><strong>Lecciones aprendidas:</strong> Insights únicos</li>
          </ul>
          
          <h3>Monetización del Case Study:</h3>
          <p>Tu transformación documentada se convierte en tu mejor material de marketing y prueba social para futuras ventas.</p>
        `
      },
      {
        id: 8,
        title: 'M4 - Escala, Repite, Monetiza',
        duration: '45 min',
        type: 'project',
        description: 'Final - Plan de iteración + métrica clave',
        videoUrl: 'https://www.youtube.com/watch?v=Gln-qdxlBFM',
        content: `
          <h2>M4 - Escala, Repite, Monetiza</h2>
          <h3>Final</h3>
          <p>Plan de iteración + métrica clave</p>
          
          <p>Crea un sistema escalable que te permita multiplicar resultados y generar ingresos recurrentes de forma sistemática.</p>
          
          <h3>Plan de Escalamiento Sistemático:</h3>
          <ol>
            <li><strong>Identificar cuellos de botella:</strong> ¿Qué limita el crecimiento?</li>
            <li><strong>Automatizar procesos repetitivos:</strong> IA + herramientas</li>
            <li><strong>Crear sistemas de delegación:</strong> Team building</li>
            <li><strong>Desarrollar fuentes de ingreso pasivo:</strong> Productos escalables</li>
          </ol>
          
          <h3>Métrica Clave de Escalamiento:</h3>
          <p><strong>Revenue Per Hour (RPH):</strong> Ingresos generados por hora trabajada</p>
          
          <pre><code># Cálculo de RPH
RPH = Ingresos Mensuales ÷ Horas Trabajadas

Objetivo de Escalamiento:
Mes 1: $50/hora
Mes 3: $100/hora  
Mes 6: $200/hora
Mes 12: $500/hora

Estrategias para aumentar RPH:
1. Aumentar precios (mejor posicionamiento)
2. Reducir tiempo por cliente (automatización)
3. Crear productos escalables (1 → muchos)
4. Implementar upsells automáticos</code></pre>
          
          <h3>Sistema de Iteración Continua:</h3>
          <ul>
            <li><strong>Review semanal:</strong> ¿Qué funcionó? ¿Qué mejorar?</li>
            <li><strong>Testing mensual:</strong> Nuevas estrategias y herramientas</li>
            <li><strong>Pivots trimestrales:</strong> Ajustes de dirección si es necesario</li>
            <li><strong>Auditoría anual:</strong> Evaluación completa del sistema</li>
          </ul>
          
          <h3>Plan de Monetización a 12 Meses:</h3>
          <ul>
            <li><strong>Mes 1-3:</strong> Optimizar sistema actual (M0-M3)</li>
            <li><strong>Mes 4-6:</strong> Escalar y automatizar</li>
            <li><strong>Mes 7-9:</strong> Diversificar fuentes de ingreso</li>
            <li><strong>Mes 10-12:</strong> Crear activos de ingreso pasivo</li>
          </ul>
          
          <h3>Recursos de Soporte Continuo:</h3>
          <p>Acceso a actualizaciones, nuevas herramientas y comunidad para mantener el momentum de crecimiento.</p>
        `
      }
    ]
  };

  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/monetiza-ia/contenido');
    }
  }, [user]);

  const checkEnrollment = async () => {
    try {
      console.log('🔍 [DEBUG] Verificando inscripción para curso:', courseData.id);
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`);
      console.log('🔍 [DEBUG] Respuesta del servidor:', { status: response.status, ok: response.ok });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 [DEBUG] Datos de inscripción:', data);
        
        if (!data.isEnrolled) {
          console.log('🔍 [DEBUG] Usuario no inscrito, inscribiendo automáticamente...');
          // Intentar inscribir automáticamente
          const enrollResponse = await fetch('/api/courses/enroll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId: courseData.id }),
            credentials: 'include',
          });
          
          if (enrollResponse.ok) {
            console.log('✅ [DEBUG] Usuario inscrito automáticamente');
            setIsEnrolled(true);
          } else {
            console.error('❌ [DEBUG] Error en inscripción automática');
            // Si falla la inscripción automática, redirigir a página del curso
            router.push('/curso/monetiza-ia');
            return;
          }
        } else {
          setIsEnrolled(data.isEnrolled);
        }
      } else {
        const errorData = await response.json();
        console.error('🔍 [DEBUG] Error en respuesta:', errorData);
        
        // Si el error es de autenticación, redirigir al login
        if (response.status === 401) {
          console.log('🔍 [DEBUG] Error 401 - Redirigiendo al login');
          router.push('/login?redirect=/curso/monetiza-ia/contenido');
          return;
        }
        
        // Para otros errores, redirigir a página del curso
        router.push('/curso/monetiza-ia');
      }
    } catch (error) {
      console.error('Error verificando inscripción:', error);
      // En caso de error de red o similar, intentar inscripción directa
      console.log('🔍 [DEBUG] Error de conexión, intentando inscripción directa...');
      
      try {
        const enrollResponse = await fetch('/api/courses/enroll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId: courseData.id }),
          credentials: 'include',
        });
        
        if (enrollResponse.ok) {
          console.log('✅ [DEBUG] Usuario inscrito exitosamente tras error de conexión');
          setIsEnrolled(true);
        } else {
          console.error('❌ [DEBUG] Error en inscripción tras error de conexión');
          router.push('/curso/monetiza-ia');
        }
      } catch (enrollError) {
        console.error('❌ [DEBUG] Error crítico:', enrollError);
        router.push('/curso/monetiza-ia');
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleManualLessonChange = async (newLessonIndex: number) => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    await saveProgress(
      progress.currentLesson,
      progress.completedLessons,
      currentLesson?.id,
      currentLesson?.title,
      'access',
      1
    );
    setCurrentLesson(newLessonIndex);
  };

  const handleReturnToCourse = async () => {
    setIsSaving(true);
    try {
      const currentLesson = courseData.lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      router.push('/curso/monetiza-ia');
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setIsSaving(false);
    }
  };

  const handlePreviousLesson = async () => {
    if (progress.currentLesson > 0) {
      const currentLesson = courseData.lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      setCurrentLesson(progress.currentLesson - 1);
    }
  };

  const handleMarkLessonComplete = async (lessonId: number) => {
    // Si el curso ya está completado, no permitir marcar lecciones como completadas
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Estás en modo de revisión.');
      return;
    }

    const currentLessonIndex = courseData.lessons.findIndex(lesson => lesson.id === lessonId);
    const currentLesson = courseData.lessons[currentLessonIndex];
    
    const newCompletedLessons = progress.completedLessons.includes(lessonId) 
      ? progress.completedLessons 
      : [...progress.completedLessons, lessonId];
    
    markLessonComplete(lessonId);
    
    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id,
      currentLesson.title,
      'complete',
      5
    );
    
    if (currentLessonIndex < courseData.lessons.length - 1) {
      setTimeout(() => {
        setCurrentLesson(currentLessonIndex + 1);
      }, 100);
    }
  };

  const handleCompleteCourse = async () => {
    if (!isEnrolled) return;
    
    // Si el curso ya está completado, mostrar mensaje
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Puedes revisar el contenido cuando quieras.');
      return;
    }
    
    // Verificar si todas las lecciones están completadas
    const allLessonsCompleted = courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
    
    if (!allLessonsCompleted) {
      alert('Debes completar todas las lecciones antes de poder terminar el curso.');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/courses/complete-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          courseSlug: 'monetiza-ia'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Redirigir a la página de inicio del curso
        router.push('/curso/monetiza-ia');
      } else {
        const error = await response.json();
        console.error('❌ Error al completar curso:', error);
        alert('Error al completar el curso. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('❌ Error al completar curso:', error);
      alert('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    // Si está inscrito, puede acceder a todas las lecciones
    if (isEnrolled) return true;
    
    // Si no está inscrito, solo puede acceder a la primera lección
    return lessonIndex === 0;
  };

  const isCourseCompleted = () => {
    return progress.status === 'COMPLETED' || progress.progressPercentage === 100;
  };

  const getLessonStatus = (lessonIndex: number, lessonId: number) => {
    if (isLessonCompleted(lessonId)) {
      // Si el curso está completado, mostrar estado de revisión
      if (isCourseCompleted()) {
        return '📖';
      }
      return '✅';
    } else if (lessonIndex === progress.currentLesson) {
      return '▶️';
    } else if (isLessonAccessible(lessonIndex)) {
      return '📖';
    } else {
      return '🔒';
    }
  };

  const areAllLessonsCompleted = () => {
    return courseData.lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };

  if (!user || isLoading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/monetiza-ia')}>
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <UserProfile className="user-profile-fixed" />
      
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <section className="course-header">
          <div className="container">
            <div className="course-header-content">
              <div className="course-breadcrumb">
                <div className="breadcrumb-container">
                  <a href="/" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🏠</span>
                    <span className="breadcrumb-text">Inicio</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/cursos-gratuitos" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Cursos Gratuitos</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/curso/monetiza-ia" className="breadcrumb-item">
                    <span className="breadcrumb-icon">💰</span>
                    <span className="breadcrumb-text">Monetiza con IA</span>
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
                      onClick={handleReturnToCourse}
                      disabled={isSaving}
                    >
                      {isSaving ? '💾 Guardando...' : '🏠 Salir'}
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
                  <div className="lesson-header">
                    <h2>Lección {progress.currentLesson + 1}: {courseData.lessons[progress.currentLesson].title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-type">{courseData.lessons[progress.currentLesson].type}</span>
                      <span className="lesson-duration">{courseData.lessons[progress.currentLesson].duration}</span>
                    </div>
                  </div>
                  
                  <div className="lesson-content">
                    {/* Video de la lección */}
                    {courseData.lessons[progress.currentLesson].videoUrl && (
                      <div className="lesson-video">
                        <VideoPlayer
                          videoUrl={courseData.lessons[progress.currentLesson].videoUrl!}
                          title={courseData.lessons[progress.currentLesson].title}
                          onComplete={() => {
                            // Opcional: marcar como completada cuando termine el video
                            console.log('Video completado');
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Contenido de la lección */}
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: courseData.lessons[progress.currentLesson].content 
                      }} 
                    />
                  </div>
                  
                  <div className="lesson-actions">
                    <div className="lesson-buttons">
                      <button 
                        className="btn btn-primary"
                        onClick={handlePreviousLesson}
                        disabled={progress.currentLesson === 0}
                      >
                        ← Lección Anterior
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleMarkLessonComplete(courseData.lessons[progress.currentLesson].id)}
                      >
                        ✅ Marcar como completada
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-sidebar">
                <div className="lessons-navigation">
                  <div className="navigation-header">
                    <h3>Lecciones del Curso</h3>
                    <div className="progress-indicator">
                      <span className="progress-text">
                        {progress.completedLessons.length} de {courseData.lessons.length} completadas
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(progress.completedLessons.length / courseData.lessons.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {isEnrolled && (
                    <div className="course-guidance">
                      <p className="guidance-text">
                        💡 <strong>Recomendación:</strong> Sigue el orden de las lecciones para una mejor experiencia de aprendizaje.
                      </p>
                    </div>
                  )}
                  <div className="lessons-list">
                    {courseData.lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`lesson-item ${index === progress.currentLesson ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${!isLessonAccessible(index) ? 'locked' : ''}`}
                        onClick={() => {
                          if (isLessonAccessible(index)) {
                            handleManualLessonChange(index);
                          }
                        }}
                      >
                        <div className="lesson-number">{index + 1}</div>
                        <div className="lesson-content">
                          <h4>{lesson.title}</h4>
                          <div className="lesson-meta">
                            <span className="lesson-type">{lesson.type}</span>
                            <span className="lesson-duration">{lesson.duration}</span>
                          </div>
                        </div>
                        <div className="lesson-status">
                          {getLessonStatus(index, lesson.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Botón Terminar Curso */}
                  <div className="complete-course-section">
                    {isCourseCompleted() ? (
                      <div className="course-completed-message">
                        <div className="completion-badge">
                          <span className="completion-icon">🏆</span>
                          <span className="completion-text">¡Curso Completado!</span>
                        </div>
                        <p className="completion-info">
                          Has completado exitosamente este curso. Puedes revisar el contenido cuando quieras.
                        </p>
                        <div className="completion-stats">
                          <span>📊 Progreso: 100%</span>
                          <span>✅ Lecciones: {courseData.lessons.length}/{courseData.lessons.length}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button 
                          className={`btn btn-complete-course ${!areAllLessonsCompleted() ? 'disabled' : ''}`}
                          onClick={handleCompleteCourse}
                          disabled={isSaving || !areAllLessonsCompleted()}
                        >
                          {isSaving ? '🔄 Procesando...' : '🏆 Terminar Curso'}
                        </button>
                        <p className="complete-course-info">
                          {areAllLessonsCompleted() 
                            ? '¡Felicidades! Has completado todas las lecciones. Puedes terminar el curso.'
                            : `Completa todas las lecciones (${progress.completedLessons.length}/${courseData.lessons.length}) para poder terminar el curso`
                          }
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .enrollment-required {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }

        .course-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem 0;
        }

        .course-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .course-breadcrumb {
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .breadcrumb-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
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
          line-height: 1.4;
        }

        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .lesson-item:hover {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .lesson-item.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .lesson-item.locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lesson-item.locked:hover {
          background: #f9fafb;
          border-color: #e5e7eb;
        }

        .lesson-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
        }

        .lesson-item.active .lesson-number {
          background: #3b82f6;
          color: white;
        }

        .lesson-item.completed .lesson-number {
          background: #22c55e;
          color: white;
        }

        .lesson-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #1f2937;
        }

        .lesson-content .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .lesson-status {
          margin-left: auto;
          font-size: 1.2rem;
        }

        .complete-course-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }

        .btn-complete-course {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-complete-course:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .btn-complete-course:disabled,
        .btn-complete-course.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          background: linear-gradient(135deg, #9ca3af, #6b7280);
        }

        .btn-complete-course:disabled:hover,
        .btn-complete-course.disabled:hover {
          background: linear-gradient(135deg, #9ca3af, #6b7280);
          transform: none;
          box-shadow: none;
        }

        .complete-course-info {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .course-completed-message {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border-radius: 12px;
          border: 2px solid #22c55e;
        }

        .completion-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .completion-icon {
          font-size: 2rem;
        }

        .completion-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #16a34a;
        }

        .completion-info {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .completion-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
          
          .course-title {
            font-size: 2rem;
          }

          .lesson-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .lesson-buttons .btn {
            width: 100%;
            justify-content: center;
          }

          .header-main {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-content {
            align-items: center;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-exit-course {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
