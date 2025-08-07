'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';
import AchievementNotification from '@/components/ui/AchievementNotification';

export default function ContenidoGuionesVideosPromocionalesIAPage() {
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1])); // Solo Módulo 1 expandido por defecto
  
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
  
  const {
    progress,
    isLoading,
    progressPercentage,
    saveProgress,
    markLessonComplete,
    setCurrentLesson
  } = useCourseProgress('guiones-videos-promocionales-ia', isEnrolled);

  const courseData = {
    id: 'guiones-videos-promocionales-ia',
    title: 'Guiones para videos promocionales con IA',
    description: 'Aprende a crear guiones efectivos para videos promocionales usando herramientas de IA como ChatGPT y Claude.',
    modules: [
      {
        id: 1,
        title: 'MÓDULO 1: FUNDAMENTOS DEL GUIÓN DIGITAL',
        duration: '70 min',
        description: 'Aprende los principios básicos de la redacción de guiones para contenido digital',
        lessons: [
          {
            id: 'gvp-mod1-les1',
            title: '1.1 ¿Qué es un guión digital?',
            duration: '15 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example1',
            content: `
              <h2>1.1 ¿Qué es un guión digital?</h2>
              
              <p>Es la hoja de ruta detallada de un video, que especifica diálogos, acciones, recursos visuales y sonoros. En el marketing digital, su función es guiar al equipo para mantener coherencia y asegurar que el mensaje cumpla el objetivo.</p>
              
              <h3>Descripción adicional:</h3>
              <p>Incluye indicaciones técnicas (planos, cortes, efectos) y narrativas (tono, ritmo, emoción). Un guión digital bien hecho reduce errores de producción y agiliza la edición.</p>
              
              <h3>Instrucción específica:</h3>
              <p><strong>Siempre iniciar con un objetivo claro</strong> (vender, educar, entretener) antes de escribir una sola línea.</p>
            `
          },
          {
            id: 'gvp-mod1-les2',
            title: '1.2 Estructura básica de un guión efectivo',
            duration: '18 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example2',
            content: `
              <h2>1.2 Estructura básica de un guión efectivo</h2>
              
              <h3>1. Hook (3-5 segundos iniciales)</h3>
              <p>Elementos que captan atención:</p>
              <ul>
                <li>Una pregunta intrigante</li>
                <li>Dato sorprendente</li>
                <li>Imagen llamativa</li>
              </ul>
              
              <h3>2. Desarrollo</h3>
              <p>Explicación clara, con ejemplos o beneficios. Debe mantener interés y estar alineado al objetivo.</p>
              
              <h3>3. Call-to-Action</h3>
              <p>Indicación directa de qué hacer: comprar, suscribirse, comentar.</p>
              
              <h3>Instrucción específica:</h3>
              <p>Usar frases cortas, evitar tecnicismos innecesarios y mantener coherencia entre guion y recursos visuales.</p>
            `
          },
          {
            id: 'gvp-mod1-les3',
            title: '1.3 Diferencias entre guiones para YouTube, TikTok e Instagram',
            duration: '37 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example3',
            content: `
              <h2>1.3 Diferencias entre guiones por plataforma</h2>
              
              <h3>🎬 YouTube</h3>
              <ul>
                <li>Guiones más largos</li>
                <li>Estructura narrativa profunda</li>
                <li>Mayor desarrollo de contenido</li>
              </ul>
              
              <h3>📱 TikTok</h3>
              <ul>
                <li>Guiones muy breves</li>
                <li>Impacto inmediato</li>
                <li>Tendencia visual predominante</li>
              </ul>
              
              <h3>📷 Instagram (Reels y Stories)</h3>
              <ul>
                <li>Interacción rápida</li>
                <li>Enfoque visual y emocional</li>
                <li>Formato vertical optimizado</li>
              </ul>
              
              <p><strong>Conclusión:</strong> Cada formato demanda distintos estilos de lenguaje, duración y ritmo.</p>

              <hr style="margin: 2rem 0; border: none; border-top: 2px solid #e2e8f0;">
              
              <h2>🎯 Actividad práctica 1: Análisis de guiones virales</h2>
              
              <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="margin-top: 0; color: #0c4a6e;">🎯 Objetivo:</h3>
                <p style="margin-bottom: 0;">Analizar la estructura de guiones virales para identificar elementos clave que los hacen efectivos.</p>
              </div>
              
              <h3>📝 Prompt sugerido para ChatGPT:</h3>
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <p style="margin: 0; font-weight: bold; color: #92400e;">"Actúa como analista de contenido. Muéstrame la estructura del siguiente guión viral e identifica: 1) el gancho inicial, 2) el desarrollo del mensaje y 3) el llamado a la acción. Aquí está el guión: [pega el texto del guión]."</p>
              </div>
              
              <h3>📋 Indicaciones paso a paso:</h3>
              <ol>
                <li><strong>Paso 1:</strong> Elige un video viral de TikTok, Instagram o YouTube Shorts</li>
                <li><strong>Paso 2:</strong> Transcribe el texto del video o copia el guión si está disponible</li>
                <li><strong>Paso 3:</strong> Pega ese guión en el prompt anterior usando ChatGPT</li>
                <li><strong>Paso 4:</strong> Analiza los elementos encontrados y toma notas</li>
              </ol>
              
              <h3>🔍 Elementos a identificar:</h3>
              <ul>
                <li><strong>Gancho inicial:</strong> ¿Qué capturó tu atención en los primeros 3-5 segundos?</li>
                <li><strong>Desarrollo del mensaje:</strong> ¿Cómo mantuvieron el interés?</li>
                <li><strong>Llamado a la acción:</strong> ¿Qué te pidieron hacer exactamente?</li>
              </ul>
              
              <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h3 style="margin-top: 0; color: #166534;">💡 Consejos para el análisis:</h3>
                <p style="margin-bottom: 0;">Busca patrones en videos de tu nicho y anota qué técnicas se repiten en los contenidos más exitosos.</p>
              </div>
            `
          }
        ]
      },
      {
        id: 2,
        title: 'MÓDULO 2: HERRAMIENTAS DE IA PARA GUIONES',
        duration: '65 min',
        description: 'Domina ChatGPT, Claude y otras herramientas de IA para crear guiones efectivos',
        lessons: [
          {
            id: 'gvp-mod2-les1',
            title: '2.1 Introducción a herramientas de IA',
            duration: '20 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example4',
            content: `
              <h2>2.1 Introducción a herramientas de IA</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Cada herramienta de IA tiene fortalezas específicas. Conoce cuál usar en cada situación para obtener los mejores resultados.</p>
              </div>

              <h3>🤖 ChatGPT</h3>
              <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <p><strong>Ideal para:</strong></p>
                <ul style="margin: 0.5rem 0;">
                  <li>Ideas y brainstorming de guiones</li>
                  <li>Guiones educativos y explicativos</li>
                  <li>Adaptaciones rápidas de contenido</li>
                  <li>Conversaciones y diálogos naturales</li>
                </ul>
              </div>

              <h3>🧠 Claude</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <p><strong>Útil para:</strong></p>
                <ul style="margin: 0.5rem 0;">
                  <li>Textos largos y detallados</li>
                  <li>Contenido contextual complejo</li>
                  <li>Narrativas más elaboradas</li>
                  <li>Análisis profundo de temas</li>
                </ul>
              </div>

              <h3>✍️ Copy.ai</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <p><strong>Potente para:</strong></p>
                <ul style="margin: 0.5rem 0;">
                  <li>Mensajes publicitarios</li>
                  <li>Microcopys persuasivos</li>
                  <li>Headlines y títulos llamativos</li>
                  <li>CTAs efectivos</li>
                </ul>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h4 style="margin-top: 0; color: #92400e;">⚡ Instrucción específica:</h4>
                <p style="margin-bottom: 0; color: #92400e;"><strong>Probar la misma solicitud en 2-3 herramientas</strong> para comparar resultados y elegir el más adecuado para tu necesidad específica.</p>
              </div>
            `
          },
          {
            id: 'gvp-mod2-les2',
            title: '2.2 Prompts efectivos para guiones',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example5',
            content: `
              <h2>2.2 Prompts efectivos para guiones</h2>
              
              <p>Un prompt claro indica: <strong>formato, duración, tono, público y objetivo</strong>.</p>

              <h3>📋 Estructura de un prompt efectivo:</h3>
              <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <ol style="margin: 0; color: #475569; line-height: 1.7;">
                  <li><strong>Formato:</strong> ¿Qué tipo de contenido? (Reel, video, post)</li>
                  <li><strong>Duración:</strong> Tiempo específico (20 seg, 1 min, etc.)</li>
                  <li><strong>Tema:</strong> De qué trata el contenido</li>
                  <li><strong>Público:</strong> A quién está dirigido</li>
                  <li><strong>Tono:</strong> Emocional, profesional, casual, etc.</li>
                  <li><strong>CTA:</strong> Qué acción quieres que tomen</li>
                </ol>
              </div>

              <h3>✨ Ejemplo de prompt estructurado:</h3>
              <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <p style="margin: 0; font-family: monospace; color: #166534;"><strong>"Escribe un guión de 20 segundos para un Reel sobre [tema], dirigido a [público], tono [emocional/profesional], con CTA al final".</strong></p>
              </div>

              <h3>💡 Descripción adicional:</h3>
              <p>Cuanto más detalle se dé en el prompt, más alineado será el resultado. Es mejor ser específico que general.</p>

              <h3>📝 Ejemplos prácticos de prompts:</h3>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <h4>Para un coach de fitness:</h4>
                <p style="font-family: monospace; background: #f8fafc; padding: 0.75rem; border-radius: 4px; margin: 0.5rem 0;">"Crea un guión de 30 segundos para Instagram Reel sobre rutina matutina, dirigido a mujeres de 25-40 años, tono motivacional y energético, que termine pidiendo que comenten su rutina actual"</p>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <h4>Para una marca de tecnología:</h4>
                <p style="font-family: monospace; background: #f8fafc; padding: 0.75rem; border-radius: 4px; margin: 0.5rem 0;">"Escribe un guión de 45 segundos para TikTok explicando las ventajas de nuestro software, dirigido a emprendedores jóvenes, tono profesional pero cercano, con CTA para descargar prueba gratuita"</p>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h4 style="margin-top: 0; color: #92400e;">💾 Instrucción específica:</h4>
                <p style="margin-bottom: 0; color: #92400e;"><strong>Guardar prompts que funcionen bien</strong> en un documento para reutilizarlos y adaptarlos a futuras necesidades.</p>
              </div>
            `
          },
          {
            id: 'gvp-mod2-les3',
            title: '2.3 Configuración y buenas prácticas',
            duration: '20 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example6',
            content: `
              <h2>2.3 Configuración y buenas prácticas</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Para obtener los mejores resultados con IA, es fundamental seguir estas prácticas probadas.</p>
              </div>

              <h3>🎯 Mejores prácticas para resultados óptimos:</h3>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #3b82f6; font-weight: 600;">1.</span> Usa descripciones claras y específicas
                </h4>
                <p style="margin: 0; color: #475569; line-height: 1.6;">
                  ❌ "Haz un video sobre marketing"<br>
                  ✅ "Crea un guión de 60 segundos para video explicativo sobre email marketing para pequeños negocios"
                </p>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #3b82f6; font-weight: 600;">2.</span> Ajusta el tono según la marca
                </h4>
                <ul style="margin: 0; color: #475569; line-height: 1.7;">
                  <li><strong>Formal:</strong> "Tono profesional y educativo"</li>
                  <li><strong>Casual:</strong> "Tono conversacional y amigable"</li>
                  <li><strong>Energético:</strong> "Tono motivacional y dinámico"</li>
                  <li><strong>Empático:</strong> "Tono comprensivo y cercano"</li>
                </ul>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #3b82f6; font-weight: 600;">3.</span> Limita la cantidad de palabras si es necesario
                </h4>
                <p style="margin: 0; color: #475569; line-height: 1.6;">
                  Especifica límites claros: "máximo 50 palabras", "entre 80-120 palabras", "exactamente 30 segundos de duración"
                </p>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #3b82f6; font-weight: 600;">4.</span> Reescribe si el primer resultado no te convence
                </h4>
                <p style="margin: 0; color: #475569; line-height: 1.6;">
                  No te quedes con la primera versión. Pide variaciones: "Dame 3 versiones diferentes" o "Hazlo más directo y persuasivo"
                </p>
              </div>

              <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1rem; margin: 1.5rem 0; border-left: 4px solid #0ea5e9;">
                <h4 style="color: #0c4a6e; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #0ea5e9;">💡</span> Tip profesional
                </h4>
                <p style="margin: 0; color: #0c4a6e; line-height: 1.6;">Prueba el mismo prompt en diferentes herramientas y combina las mejores partes de cada resultado para crear tu versión final.</p>
              </div>

              <hr style="margin: 2rem 0; border: none; border-top: 2px solid #e2e8f0;">
              
              <h2>🎯 Actividad práctica 2: Primer guión con IA</h2>
              
              <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="margin-top: 0; color: #0c4a6e;">🎯 Objetivo:</h3>
                <p style="margin-bottom: 0;">Crear tu primer guión personalizado usando IA, aplicando las técnicas aprendidas.</p>
              </div>
              
              <h3>📝 Prompt sugerido:</h3>
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <p style="margin: 0; font-weight: bold; color: #92400e;">"Escribe un guión de 30 segundos para un video donde me presento como [profesión o rol] y explico cómo puedo ayudar a [audiencia objetivo]. El tono debe ser cercano, claro y con un llamado a la acción final."</p>
              </div>
              
              <h3>📋 Indicaciones paso a paso:</h3>
              <ol>
                <li><strong>Paso 1:</strong> Elige si el guión será sobre ti o un producto específico</li>
                <li><strong>Paso 2:</strong> Personaliza el prompt con tu información real</li>
                <li><strong>Paso 3:</strong> Usa ChatGPT, Claude o Copy.ai para generar el guión</li>
                <li><strong>Paso 4:</strong> Haz ajustes si es necesario para que suene más auténtico</li>
              </ol>
              
              <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h3 style="margin-top: 0; color: #166534;">💡 Consejos para personalizar:</h3>
                <ul style="margin-bottom: 0; color: #166534;">
                  <li>Reemplaza [profesión o rol] con tu trabajo real</li>
                  <li>Define claramente tu [audiencia objetivo]</li>
                  <li>Ajusta el tono según tu personalidad</li>
                  <li>Prueba diferentes versiones hasta encontrar la perfecta</li>
                </ul>
              </div>
            `
          }
        ]
      },
      {
        id: 3,
        title: 'MÓDULO 3: GUIONES PARA VIDEOS PROMOCIONALES',
        duration: '75 min',
        description: 'Crea guiones persuasivos para videos promocionales y publicitarios usando AIDA',
        lessons: [
          {
            id: 'gvp-mod3-les1',
            title: '3.1 Estructura AIDA aplicada al guión',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example7',
            content: `
              <h2>3.1 Estructura AIDA aplicada al guión</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">La metodología AIDA (Atención, Interés, Deseo, Acción) es clave en la redacción persuasiva y fundamental para videos promocionales exitosos.</p>
              </div>

              <h3>🔥 A - Atención</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Objetivo:</strong> Gancho inicial visual o verbal que sorprenda o intrigue</p>
                <h4>Técnicas efectivas:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Pregunta provocadora:</strong> "¿Sabías que el 90% de los emprendedores comete este error?"</li>
                  <li><strong>Estadística impactante:</strong> "En solo 30 días, más de 10,000 personas han cambiado su vida con..."</li>
                  <li><strong>Imagen llamativa:</strong> Visual que rompa el patrón o genere curiosidad</li>
                  <li><strong>Afirmación sorprendente:</strong> "Todo lo que creías sobre X es falso"</li>
                </ul>
              </div>

              <h3>🎯 I - Interés</h3>
              <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Objetivo:</strong> Presentar el problema o necesidad del público objetivo</p>
                <h4>Cómo conectar emocionalmente:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li>Identifica el "dolor" específico de tu audiencia</li>
                  <li>Usa un lenguaje que resuene con sus experiencias</li>
                  <li>Menciona las frustraciones comunes</li>
                  <li>Haz que se sientan comprendidos y no solos</li>
                </ul>
                <div style="background: #f59e0b; color: white; padding: 0.75rem; border-radius: 4px; margin-top: 1rem;">
                  <strong>Ejemplo:</strong> "¿Te has sentido frustrado porque inviertes horas creando contenido y apenas obtienes engagement? No estás solo..."
                </div>
              </div>

              <h3>💖 D - Deseo</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Objetivo:</strong> Mostrar cómo tu producto/servicio resuelve ese problema</p>
                <h4>Elementos clave:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Beneficios diferenciales:</strong> Qué te hace único frente a la competencia</li>
                  <li><strong>Transformación emocional:</strong> Cómo se sentirán después de usar tu solución</li>
                  <li><strong>Resultados concretos:</strong> Qué lograrán específicamente</li>
                  <li><strong>Visión del futuro:</strong> Pinta un escenario ideal y alcanzable</li>
                </ul>
                <div style="background: #0ea5e9; color: white; padding: 0.75rem; border-radius: 4px; margin-top: 1rem;">
                  <strong>Ejemplo:</strong> "Imagina despertar cada mañana sabiendo que tu contenido genera leads automáticamente mientras duermes..."
                </div>
              </div>

              <h3>⚡ A - Acción</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Objetivo:</strong> Instrucción clara para que el espectador realice una acción específica</p>
                <h4>Componentes de un CTA efectivo:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Acción específica:</strong> Comprar, registrarse, seguir, descargar</li>
                  <li><strong>Urgencia:</strong> "Solo por tiempo limitado", "Últimas 24 horas"</li>
                  <li><strong>Incentivo:</strong> Descuento, bonus, contenido exclusivo</li>
                  <li><strong>Facilidad:</strong> "Con un solo click", "En menos de 2 minutos"</li>
                </ul>
                <div style="background: #22c55e; color: white; padding: 0.75rem; border-radius: 4px; margin-top: 1rem;">
                  <strong>Ejemplo:</strong> "Haz click en el enlace de la descripción AHORA y obtén acceso inmediato con 50% de descuento"
                </div>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h4 style="margin-top: 0; color: #92400e;">🎯 Instrucción específica:</h4>
                <p style="margin-bottom: 0; color: #92400e;"><strong>Personalizar cada paso de AIDA</strong> con ejemplos y datos relevantes para la audiencia específica, evitando frases genéricas. Cada elemento debe ser auténtico y específico para tu marca.</p>
              </div>
            `
          },
          {
            id: 'gvp-mod3-les2',
            title: '3.2 Adaptación al tipo de audiencia',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example8',
            content: `
              <h2>3.2 Adaptación al tipo de audiencia</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Antes de escribir cualquier guión, es fundamental realizar un perfil detallado del público objetivo. Un guión efectivo habla directamente a una persona específica, no a "todos".</p>
              </div>

              <h3>👥 Perfil demográfico y psicográfico</h3>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #8b5cf6; font-weight: 600;">1.</span> Edad y demografía
                </h4>
                <p style="margin: 0 0 0.75rem 0; color: #475569;">Determina el tono, referencias culturales y lenguaje:</p>
                <ul style="margin: 0; color: #475569; line-height: 1.6;">
                  <li><strong>Gen Z (16-24):</strong> Lenguaje directo, referencias actuales, humor irónico</li>
                  <li><strong>Millennials (25-40):</strong> Nostalgia, autenticidad, equilibrio vida-trabajo</li>
                  <li><strong>Gen X (41-55):</strong> Pragmático, orientado a resultados, menos jerga</li>
                  <li><strong>Baby Boomers (56+):</strong> Formal, basado en confianza, claridad</li>
                </ul>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #8b5cf6; font-weight: 600;">2.</span> Hábitos de consumo
                </h4>
                <p style="margin: 0 0 0.75rem 0; color: #475569;">Qué, cuándo y cómo consumen contenido:</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                  <div style="background: #f1f5f9; padding: 1rem; border-radius: 6px;">
                    <h5 style="margin: 0 0 0.5rem 0; color: #1e293b;">Plataformas preferidas</h5>
                    <ul style="margin: 0; font-size: 0.875rem; color: #475569;">
                      <li>TikTok: Gen Z, contenido viral</li>
                      <li>Instagram: Millennials, visual</li>
                      <li>Facebook: Gen X+, comunidad</li>
                      <li>LinkedIn: Profesionales</li>
                    </ul>
                  </div>
                  <div style="background: #f1f5f9; padding: 1rem; border-radius: 6px;">
                    <h5 style="margin: 0 0 0.5rem 0; color: #1e293b;">Horarios de consumo</h5>
                    <ul style="margin: 0; font-size: 0.875rem; color: #475569;">
                      <li>Mañana: Motivacional, educativo</li>
                      <li>Mediodía: Quick tips, humor</li>
                      <li>Tarde: Entretenimiento, lifestyle</li>
                      <li>Noche: Inspiracional, reflexivo</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #8b5cf6; font-weight: 600;">3.</span> Problemas y aspiraciones
                </h4>
                <p style="margin: 0 0 0.75rem 0; color: #475569;">El corazón de cualquier mensaje persuasivo:</p>
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 1rem; margin: 0.5rem 0;">
                  <h5 style="margin: 0 0 0.5rem 0; color: #dc2626;">💔 Dolores (Pain Points)</h5>
                  <p style="margin: 0; font-size: 0.875rem; color: #7f1d1d;">Falta de tiempo, inseguridad financiera, miedo al fracaso, frustración tecnológica</p>
                </div>
                <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; margin: 0.5rem 0;">
                  <h5 style="margin: 0 0 0.5rem 0; color: #16a34a;">✨ Aspiraciones (Dreams)</h5>
                  <p style="margin: 0; font-size: 0.875rem; color: #14532d;">Libertad financiera, reconocimiento, impacto positivo, equilibrio personal</p>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #8b5cf6; font-weight: 600;">4.</span> Estilo visual preferido
                </h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 0.75rem;">
                  <div style="text-align: center; padding: 0.75rem; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                    <strong style="color: #1f2937;">Minimalista</strong><br>
                    <span style="font-size: 0.75rem; color: #6b7280;">Colores neutros, tipografía simple, espacios en blanco</span>
                  </div>
                  <div style="text-align: center; padding: 0.75rem; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                    <strong style="color: #1f2937;">Colorido</strong><br>
                    <span style="font-size: 0.75rem; color: #6b7280;">Paleta vibrante, elementos gráficos, dinamismo visual</span>
                  </div>
                  <div style="text-align: center; padding: 0.75rem; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                    <strong style="color: #1f2937;">Formal</strong><br>
                    <span style="font-size: 0.75rem; color: #6b7280;">Corporativo, profesional, serio, confiable</span>
                  </div>
                  <div style="text-align: center; padding: 0.75rem; background: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                    <strong style="color: #1f2937;">Informal</strong><br>
                    <span style="font-size: 0.75rem; color: #6b7280;">Casual, amigable, accesible, cercano</span>
                  </div>
                </div>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h4 style="margin-top: 0; color: #92400e;">📋 Instrucción específica:</h4>
                <p style="margin-bottom: 0; color: #92400e;"><strong>Crear un "brief" de audiencia de al menos 5 puntos</strong> antes de redactar cualquier guión, y revisarlo junto al guión final para asegurar que todo el contenido responda a esos criterios específicos.</p>
              </div>

              <div style="background: #e0e7ff; border: 1px solid #a5b4fc; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h4 style="margin-top: 0; color: #3730a3;">🎯 Plantilla de Brief de Audiencia</h4>
                <ol style="margin-bottom: 0; color: #3730a3; line-height: 1.6;">
                  <li><strong>Demográfico:</strong> [Edad, género, ubicación, nivel socioeconómico]</li>
                  <li><strong>Comportamiento:</strong> [Plataformas, horarios, tipo de contenido preferido]</li>
                  <li><strong>Problema principal:</strong> [El dolor más urgente que necesita resolver]</li>
                  <li><strong>Aspiración clave:</strong> [Su sueño o meta más importante]</li>
                  <li><strong>Estilo de comunicación:</strong> [Formal/informal, técnico/simple, emotivo/racional]</li>
                </ol>
              </div>
            `
          },
          {
            id: 'gvp-mod3-les3',
            title: '3.3 Técnicas de persuasión',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example9',
            content: `
              <h2>3.3 Técnicas de persuasión</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Las técnicas de persuasión son herramientas psicológicas probadas que influyen en las decisiones de compra. Su uso ético puede transformar un guión informativo en uno que genere acción real.</p>
              </div>

              <h3>🏆 Prueba Social</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Principio:</strong> Las personas siguen el comportamiento de otros similares a ellos</p>
                <h4>Formas de implementarla:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                  <div>
                    <h5 style="color: #dc2626; margin: 0 0 0.5rem 0;">📢 Testimonios</h5>
                    <ul style="margin: 0; font-size: 0.875rem;">
                      <li>"María aumentó sus ventas 300%"</li>
                      <li>Video testimonial auténtico</li>
                      <li>Casos de éxito específicos</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style="color: #dc2626; margin: 0 0 0.5rem 0;">📊 Cifras</h5>
                    <ul style="margin: 0; font-size: 0.875rem;">
                      <li>"Más de 10,000 clientes satisfechos"</li>
                      <li>"98% de tasa de éxito"</li>
                      <li>"Elegido por 500+ empresas"</li>
                    </ul>
                  </div>
                </div>
                <div style="background: #dc2626; color: white; padding: 0.75rem; border-radius: 4px; margin-top: 1rem; font-size: 0.875rem;">
                  <strong>Ejemplo:</strong> "Únete a las 2,847 personas que ya han transformado su negocio con nuestro método. Como dice Ana Pérez: 'En 30 días logré lo que no había conseguido en 2 años.'"
                </div>
              </div>

              <h3>⏰ Escasez</h3>
              <div style="background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Principio:</strong> Lo limitado es más valioso y genera urgencia de acción</p>
                <h4>Tipos de escasez efectiva:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                  <div>
                    <h5 style="color: #f59e0b; margin: 0 0 0.5rem 0;">🕐 Tiempo limitado</h5>
                    <ul style="margin: 0; font-size: 0.875rem;">
                      <li>"Solo por 48 horas"</li>
                      <li>"Oferta expira mañana"</li>
                      <li>"Últimas horas del descuento"</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style="color: #f59e0b; margin: 0 0 0.5rem 0;">📦 Cantidad limitada</h5>
                    <ul style="margin: 0; font-size: 0.875rem;">
                      <li>"Últimas 5 unidades"</li>
                      <li>"Edición limitada a 100"</li>
                      <li>"Solo para los primeros 50"</li>
                    </ul>
                  </div>
                </div>
                <div style="background: #f59e0b; color: white; padding: 0.75rem; border-radius: 4px; margin-top: 1rem; font-size: 0.875rem;">
                  <strong>Ejemplo:</strong> "Este precio especial solo estará disponible para los primeros 24 compradores. ¡Ya van 18! No te quedes sin tu lugar."
                </div>
              </div>

              <h3>🎓 Autoridad</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Principio:</strong> Las personas confían en expertos y figuras de autoridad</p>
                <h4>Formas de demostrar autoridad:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                  <div>
                    <h5 style="color: #0ea5e9; margin: 0 0 0.5rem 0;">🏅 Credenciales</h5>
                    <ul style="margin: 0; font-size: 0.875rem;">
                      <li>"15 años de experiencia"</li>
                      <li>"Certificado por [institución]"</li>
                      <li>"Autor del bestseller X"</li>
                    </ul>
                  </div>
                  <div>
                    <h5 style="color: #0ea5e9; margin: 0 0 0.5rem 0;">🏆 Casos de éxito</h5>
                    <ul style="margin: 0; font-size: 0.875rem;">
                      <li>"Ayudé a 500+ empresas"</li>
                      <li>"Resultados comprobados"</li>
                      <li>"Método desarrollado en 10 años"</li>
                    </ul>
                  </div>
                </div>
                <div style="background: #0ea5e9; color: white; padding: 0.75rem; border-radius: 4px; margin-top: 1rem; font-size: 0.875rem;">
                  <strong>Ejemplo:</strong> "Soy Juan Martínez, llevo 12 años ayudando a emprendedores como tú. He trabajado con más de 1,000 negocios y mis clientes han generado +$50M en ventas."
                </div>
              </div>

              <h3>📖 Storytelling Emocional</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Principio:</strong> Las historias conectan emocionalmente y son más memorables que los datos</p>
                <h4>Estructura de historia persuasiva:</h4>
                <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 1rem; margin: 1rem 0;">
                  <ol style="margin: 0; color: #065f46; line-height: 1.6;">
                    <li><strong>Situación inicial:</strong> Personaje con el que la audiencia se identifica</li>
                    <li><strong>Problema/Conflicto:</strong> El obstáculo que enfrentaba (mismo que la audiencia)</li>
                    <li><strong>Solución/Descubrimiento:</strong> Cómo encontró tu producto/servicio</li>
                    <li><strong>Transformación:</strong> Los resultados específicos que obtuvo</li>
                    <li><strong>Nueva realidad:</strong> Su vida actual y cómo puede ser la del espectador</li>
                  </ol>
                </div>
                <div style="background: #22c55e; color: white; padding: 0.75rem; border-radius: 4px; margin-top: 1rem; font-size: 0.875rem;">
                  <strong>Ejemplo:</strong> "Hace 6 meses, Laura trabajaba 12 horas diarias por $800 al mes. Una noche, agotada, descubrió nuestro método. Hoy trabaja 4 horas y gana $3,000. Su hija ya no pregunta '¿cuándo vas a jugar conmigo, mami?'"
                </div>
              </div>

              <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1rem; margin: 1.5rem 0; border-left: 4px solid #0ea5e9;">
                <h4 style="color: #0c4a6e; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: #0ea5e9;">💡</span> Combinación poderosa
                </h4>
                <p style="margin: 0; color: #0c4a6e; line-height: 1.6;">Las técnicas más efectivas combinan 2-3 principios: "Testimonio + Escasez", "Autoridad + Historia", "Prueba social + Urgencia". Nunca abuses de todas a la vez.</p>
              </div>

              <hr style="margin: 2rem 0; border: none; border-top: 2px solid #e2e8f0;">
              
              <h2>🎯 Actividad práctica 3: Guión promocional de 60 segundos</h2>
              
              <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="margin-top: 0; color: #0c4a6e;">🎯 Objetivo:</h3>
                <p style="margin-bottom: 0;">Crear un guión promocional completo de 60 segundos aplicando la estructura AIDA y técnicas de persuasión.</p>
              </div>
              
              <h3>📝 Prompt sugerido:</h3>
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                <p style="margin: 0; font-weight: bold; color: #92400e;">"Redacta un guión para un video promocional de 60 segundos usando la estructura AIDA. El producto es: [nombre del producto]. Dirigido a: [audiencia]. El tono debe ser persuasivo, profesional y emocional."</p>
              </div>
              
              <h3>📋 Indicaciones paso a paso:</h3>
              <ol>
                <li><strong>Paso 1:</strong> Define un producto/servicio real o ficticio que quieras promocionar</li>
                <li><strong>Paso 2:</strong> Especifica tu público objetivo con detalles demográficos</li>
                <li><strong>Paso 3:</strong> Usa el prompt personalizado para generar tu guión base</li>
                <li><strong>Paso 4:</strong> Revisa que incluya AIDA completo y al menos 2 técnicas de persuasión</li>
              </ol>
              
              <div style="background: #ecfdf5; border: 1px solid #22c55e; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
                <h3 style="margin-top: 0; color: #166534;">📝 Checklist final:</h3>
                <ul style="margin-bottom: 0; color: #166534;">
                  <li>✅ <strong>Atención:</strong> Gancho claro en primeros 5 segundos</li>
                  <li>✅ <strong>Interés:</strong> Problema específico de la audiencia</li>
                  <li>✅ <strong>Deseo:</strong> Beneficios únicos y transformación emocional</li>
                  <li>✅ <strong>Acción:</strong> CTA específico con urgencia o incentivo</li>
                  <li>✅ <strong>Persuasión:</strong> Al menos 2 técnicas aplicadas (prueba social, escasez, autoridad o storytelling)</li>
                </ul>
              </div>
            `
          }
        ]
      },
      {
        id: 4,
        title: 'MÓDULO 4: PLATAFORMAS Y FORMATOS ESPECÍFICOS',
        duration: '70 min',
        description: 'Adapta tus guiones a diferentes plataformas y optimiza para algoritmos de redes sociales',
        lessons: [
          {
            id: 'gvp-mod4-les1',
            title: '4.1 Formatos específicos',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example10',
            content: `
              <h2>4.1 Formatos específicos</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Cada plataforma tiene características únicas que exigen adaptaciones específicas en ritmo, duración y estilo de guión.</p>
              </div>

              <h3>📱 Instagram Reels</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Características principales:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Duración:</strong> 15-90 segundos (óptimo: 30-60 segundos)</li>
                  <li><strong>Formato:</strong> Vertical (9:16)</li>
                  <li><strong>Enfoque:</strong> Impacto rápido y entretenimiento</li>
                </ul>
                
                <h4>Estrategias de guión para Reels:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Hook en 3 segundos:</strong> Pregunta, estadística o movimiento llamativo</li>
                  <li><strong>Transiciones dinámicas:</strong> Cambios de escena cada 3-5 segundos</li>
                  <li><strong>Música trending:</strong> Usar sonidos populares del momento</li>
                  <li><strong>Subtítulos obligatorios:</strong> El 85% ve sin sonido</li>
                  <li><strong>CTA visual:</strong> Texto en pantalla + voz</li>
                </ul>
                
                <h4>Template Reel (30 seg):</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">
                  <p><strong>[0-3 seg]</strong> Hook visual + texto sobreimpreso<br>
                  <strong>[3-8 seg]</strong> Problema/situación + transición<br>
                  <strong>[8-18 seg]</strong> Solución/contenido + 2-3 puntos clave<br>
                  <strong>[18-25 seg]</strong> Beneficio/resultado + prueba social<br>
                  <strong>[25-30 seg]</strong> CTA doble: voz + texto</p>
                </div>
              </div>

              <h3>📖 Instagram Stories</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Características principales:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Duración:</strong> 15 segundos por story</li>
                  <li><strong>Formato:</strong> Vertical (9:16)</li>
                  <li><strong>Ephemero:</strong> Desaparece en 24h</li>
                </ul>
                
                <h4>Estrategias de guión para Stories:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Secuencia narrativa:</strong> Dividir mensaje en varios stories</li>
                  <li><strong>Interactividad:</strong> Encuestas, preguntas, sliders</li>
                  <li><strong>Behind the scenes:</strong> Contenido más personal y espontáneo</li>
                  <li><strong>Swipe up/Link:</strong> Dirigir a contenido externo</li>
                  <li><strong>Urgencia:</strong> "Solo por 24h" crea FOMO</li>
                </ul>
                
                <h4>Serie Stories (5 partes):</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">
                  <p><strong>Story 1:</strong> Hook + promesa ("En los próximos 5 stories...")<br>
                  <strong>Story 2-4:</strong> Contenido dividido + "Desliza para continuar"<br>
                  <strong>Story 5:</strong> Resumen + CTA + link/swipe up</p>
                </div>
              </div>

              <h3>🎵 TikTok</h3>
              <div style="background: #fdf4ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Características principales:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Duración:</strong> 15 segundos a 10 minutos (óptimo: 15-60 seg)</li>
                  <li><strong>Formato:</strong> Vertical (9:16)</li>
                  <li><strong>Algoritmo:</strong> Premia engagement inmediato</li>
                </ul>
                
                <h4>Estrategias de guión para TikTok:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Creatividad máxima:</strong> Original, auténtico, no pulido</li>
                  <li><strong>Tendencias obligatorias:</strong> Sonidos, challenges, hashtags</li>
                  <li><strong>Storytelling visual:</strong> Mostrar, no solo decir</li>
                  <li><strong>Efectos y transiciones:</strong> Usar herramientas nativas</li>
                  <li><strong>Loop perfecto:</strong> Final conecta con inicio</li>
                </ul>
                
                <h4>Fórmula TikTok (15 seg):</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">
                  <p><strong>[0-1 seg]</strong> Hook extremo + movimiento<br>
                  <strong>[1-3 seg]</strong> Setup/contexto + música trending<br>
                  <strong>[3-10 seg]</strong> Desarrollo + efecto/transición<br>
                  <strong>[10-13 seg]</strong> Punchline/reveal + impacto visual<br>
                  <strong>[13-15 seg]</strong> Loop setup + CTA sutil</p>
                </div>
              </div>

              <h3>🎬 YouTube Shorts</h3>
              <div style="background: #fef7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Características principales:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Duración:</strong> Hasta 60 segundos</li>
                  <li><strong>Formato:</strong> Vertical (9:16)</li>
                  <li><strong>Integración:</strong> Con contenido largo del canal</li>
                </ul>
                
                <h4>Estrategias de guión para Shorts:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Teaser de contenido largo:</strong> "Versión completa en mi canal"</li>
                  <li><strong>Listicles rápidos:</strong> "5 tips en 60 segundos"</li>
                  <li><strong>Moments highlights:</strong> Mejores partes de videos largos</li>
                  <li><strong>Suscripción:</strong> CTA para suscribirse al canal</li>
                  <li><strong>Series conectadas:</strong> "Parte 1 de 3"</li>
                </ul>
              </div>

              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="color: #15803d; margin-top: 0;">📝 Checklist de Adaptación</h3>
                <h4>Antes de adaptar tu guión:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li>✅ <strong>Duración objetivo:</strong> ¿15, 30 o 60 segundos?</li>
                  <li>✅ <strong>Formato de pantalla:</strong> ¿Vertical u horizontal?</li>
                  <li>✅ <strong>Audiencia nativa:</strong> ¿Cómo consume en esta plataforma?</li>
                  <li>✅ <strong>Tendencias actuales:</strong> ¿Qué está funcionando esta semana?</li>
                  <li>✅ <strong>Features nativas:</strong> ¿Qué herramientas usar?</li>
                </ul>
                
                <p><strong>Regla de oro:</strong> No adaptes mecánicamente. Cada plataforma es un idioma diferente.</p>
              </div>
            `
          },
          {
            id: 'gvp-mod4-les2',
            title: '4.2 Optimización para algoritmos',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example11',
            content: `
              <h2>4.2 Optimización para algoritmos</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Los algoritmos de redes sociales priorizan contenido que genera engagement rápido y sostenido. Tu guión debe estar optimizado desde el primer segundo.</p>
              </div>

              <h3>⚡ Los 3 Segundos Críticos</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>¿Por qué son críticos?</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Retención temprana:</strong> El algoritmo mide si la gente se queda</li>
                  <li><strong>Velocidad de scroll:</strong> Competencia feroz por la atención</li>
                  <li><strong>Predictor de performance:</strong> Determina el alcance total</li>
                </ul>
                
                <h4>Hooks que funcionan:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>❌ Hook débil:</strong> "Hola, soy María y hoy les voy a enseñar..."</p>
                  <p><strong>✅ Hook fuerte:</strong> "Esta técnica me hizo ganar $10,000 en 30 días"</p>
                </div>
                
                <h4>5 Fórmulas de Hook infalibles:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Resultado específico:</strong> "Cómo pasé de 0 a 100K seguidores en 6 meses"</li>
                  <li><strong>Secreto revelado:</strong> "El secreto que las agencias no quieren que sepas"</li>
                  <li><strong>Error común:</strong> "El error #1 que cometen el 90% de emprendedores"</li>
                  <li><strong>Comparación extrema:</strong> "Mientras otros luchan, yo descubrí esto..."</li>
                  <li><strong>Pregunta provocativa:</strong> "¿Por qué nadie habla de esto?"</li>
                </ul>
              </div>

              <h3>🎬 Mantener la Atención: Técnicas Visuales</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Cambios de plano estratégicos:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Regla 3-5 segundos:</strong> Cambio visual cada 3-5 segundos mínimo</li>
                  <li><strong>Variedad de planos:</strong> Primer plano → Plano medio → Detalle</li>
                  <li><strong>Movimiento constante:</strong> Caminar, gesticular, cambiar posición</li>
                  <li><strong>Props y elementos:</strong> Objetos que aparecen/desaparecen</li>
                </ul>
                
                <h4>Elementos visuales que retienen:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Texto en pantalla:</strong> Resalta puntos clave</li>
                  <li><strong>Gráficos y números:</strong> Estadísticas visuales</li>
                  <li><strong>Before/After:</strong> Transformaciones evidentes</li>
                  <li><strong>Lista numerada:</strong> "Punto 1, Punto 2, Punto 3..."</li>
                  <li><strong>Transiciones nativas:</strong> Usa efectos de la plataforma</li>
                </ul>
                
                <h4>Template de retención:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">
                  <p><strong>[0-3 seg]</strong> Hook + movimiento + texto en pantalla<br>
                  <strong>[3-8 seg]</strong> Primer punto + cambio de plano + prop<br>
                  <strong>[8-13 seg]</strong> Segundo punto + transición + gráfico<br>
                  <strong>[13-18 seg]</strong> Tercer punto + movimiento + texto<br>
                  <strong>[18-25 seg]</strong> Resumen visual + antes/después<br>
                  <strong>[25-30 seg]</strong> CTA + último cambio visual</p>
                </div>
              </div>

              <h3>🔤 Palabras Clave y Subtítulos</h3>
              <div style="background: #fdf4ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>SEO para videos cortos:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Keywords en los primeros segundos:</strong> El algoritmo "escucha"</li>
                  <li><strong>Repetición natural:</strong> Menciona la keyword 2-3 veces</li>
                  <li><strong>Sinónimos y variaciones:</strong> Amplia el alcance semántico</li>
                  <li><strong>Trending topics:</strong> Integra temas del momento</li>
                </ul>
                
                <h4>Subtítulos optimizados:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Sincronización perfecta:</strong> Subtítulo = audio exacto</li>
                  <li><strong>Formato llamativo:</strong> Negritas, colores, tamaños</li>
                  <li><strong>Legibilidad móvil:</strong> Fuente grande, contraste alto</li>
                  <li><strong>Keywords destacadas:</strong> Marca palabras importantes</li>
                </ul>
                
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Ejemplo optimizado:</strong></p>
                  <p style="font-family: monospace; background: #f1f5f9; padding: 0.5rem; border-radius: 4px;">
                    "¿Quieres <strong>GANAR DINERO ONLINE</strong>? 💰<br>
                    Te enseño la <strong>ESTRATEGIA</strong> que uso para<br>
                    generar <strong>$5,000 AL MES</strong> 📈"
                  </p>
                </div>
              </div>

              <h3>📅 Horarios y Timing Estratégico</h3>
              <div style="background: #fef7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Mejores horarios por plataforma:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Instagram:</strong> 11am-1pm y 7pm-9pm</li>
                  <li><strong>TikTok:</strong> 9am-12pm y 7pm-9pm</li>
                  <li><strong>YouTube Shorts:</strong> 12pm-3pm y 7pm-10pm</li>
                  <li><strong>Facebook:</strong> 1pm-4pm</li>
                </ul>
                
                <h4>Variables a considerar:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Audiencia geográfica:</strong> Husos horarios principales</li>
                  <li><strong>Demografía:</strong> ¿Estudiantes? ¿Profesionales?</li>
                  <li><strong>Días de la semana:</strong> Martes-jueves mejor performance</li>
                  <li><strong>Estacionalidad:</strong> Épocas del año específicas</li>
                </ul>
              </div>

              <h3>📊 Métricas Clave para Optimizar</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Métricas de retención:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Watch time promedio:</strong> ¿Cuánto del video ven?</li>
                  <li><strong>Drop-off points:</strong> ¿Dónde se van?</li>
                  <li><strong>Replays:</strong> ¿Vuelven a ver partes?</li>
                  <li><strong>Comentarios por minuto:</strong> Engagement rate</li>
                </ul>
                
                <h4>Análisis de hooks:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">
                  <p><strong>Hook A:</strong> "Cómo ganar dinero online" → 45% retention<br>
                  <strong>Hook B:</strong> "Gané $5,000 en 30 días" → 78% retention<br>
                  <strong>Hook C:</strong> "El secreto que cambió mi vida" → 82% retention</p>
                  <p style="color: #dc2626;"><strong>Conclusión:</strong> Hooks con resultado específico + misterio funcionan mejor</p>
                </div>
                
                <h4>Instrucción específica para optimización:</h4>
                <div style="background: #fef3c7; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📈 Proceso de mejora continua:</strong></p>
                  <ol style="margin: 0.5rem 0;">
                    <li>Publica con Hook A y mide retención de 3 segundos</li>
                    <li>Si &lt;70% retención, prueba Hook B en siguiente video</li>
                    <li>Compara métricas de ambos hooks</li>
                    <li>Usa el hook ganador como base para variaciones</li>
                    <li>Repite proceso semanalmente</li>
                  </ol>
                  <p><strong>Meta:</strong> &gt;75% retención en primeros 3 segundos</p>
                </div>
              </div>
            `
          },
          {
            id: 'gvp-mod4-les3',
            title: '4.3 Uso de tendencias y hashtags',
            duration: '20 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example12',
            content: `
              <h2>4.3 Uso de tendencias y hashtags</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Las tendencias son el combustible del alcance orgánico. Pero usarlas mal puede arruinar tu mensaje. Te enseño cómo integrarlas estratégicamente.</p>
              </div>

              <h3>📈 Monitoreo de Tendencias</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Herramientas de monitoreo:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>TikTok Creative Center:</strong> Tendencias oficiales y métricas</li>
                  <li><strong>Instagram Reels Trends:</strong> En la sección "Reels" del creador</li>
                  <li><strong>Google Trends:</strong> Búsquedas populares y estacionales</li>
                  <li><strong>Hashtag analytics:</strong> Herramientas como Later o Sprout Social</li>
                  <li><strong>Competitors tracking:</strong> Qué está funcionando en tu nicho</li>
                </ul>
                
                <h4>Rutina semanal de monitoreo:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem;">
                  <p><strong>Lunes:</strong> Check general de trending sounds y hashtags<br>
                  <strong>Miércoles:</strong> Análisis de competencia y nicho específico<br>
                  <strong>Viernes:</strong> Planificación de contenido para próxima semana<br>
                  <strong>Domingo:</strong> Review de performance de trends usadas</p>
                </div>
                
                <div style="background: #fef3c7; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>⚠️ Instrucción específica:</strong></p>
                  <p>Dedica 30 minutos cada lunes a revisar las tendencias de tu industria. Crea un banco de trends adaptables para usar durante la semana. Las tendencias duran 3-7 días promedio.</p>
                </div>
              </div>

              <h3>🎵 Integración de Sonidos y Challenges</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Sonidos trending:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Original vs. Trending:</strong> Balance entre autenticidad y alcance</li>
                  <li><strong>Timing perfecto:</strong> Usar sounds en su pico de popularidad</li>
                  <li><strong>Adaptación inteligente:</strong> Modificar para que calce con tu mensaje</li>
                  <li><strong>Duración estratégica:</strong> Usar los segundos más reconocibles</li>
                </ul>
                
                <h4>Ejemplo de adaptación de challenge:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Trend original:</strong> "Tell me you're [X] without telling me you're [X]"</p>
                  <p><strong>Adaptación para marketing:</strong></p>
                  <p style="font-style: italic;">"Tell me you're a successful entrepreneur without telling me you're a successful entrepreneur..."</p>
                  <p style="font-style: italic;">*Muestra setup de oficina, múltiples pantallas, calendario lleno*</p>
                  <p><strong>CTA integrado:</strong> "¿Quieres este lifestyle? Link en bio 👆"</p>
                </div>
                
                <h4>Challenges que puedes crear:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Transformation challenge:</strong> Antes/después de usar tu producto</li>
                  <li><strong>Tip-sharing challenge:</strong> "Comparte tu mejor consejo de [tu nicho]"</li>
                  <li><strong>Behind-the-scenes:</strong> "Un día en la vida de..."</li>
                  <li><strong>Results challenge:</strong> "Muestra tus resultados con [tu método]"</li>
                </ul>
              </div>

              <h3>#️⃣ Estrategia de Hashtags</h3>
              <div style="background: #fdf4ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Fórmula 5-8 hashtags efectivos:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>2-3 hashtags virales:</strong> Alta popularidad, trending</li>
                  <li><strong>2-3 hashtags de nicho:</strong> Específicos de tu industria</li>
                  <li><strong>1-2 hashtags de marca:</strong> Tu hashtag único + ubicación</li>
                  <li><strong>1 hashtag de comunidad:</strong> Para engagement específico</li>
                </ul>
                
                <h4>Categorías de hashtags:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>🔥 Mega hashtags (1M+ posts):</strong></p>
                  <p style="font-family: monospace;">#entrepreneurship #digitalmarketing #success #motivation</p>
                  
                  <p><strong>🎯 Hashtags de nicho (100K-1M posts):</strong></p>
                  <p style="font-family: monospace;">#contentcreator #socialmediamarketing #onlinebusiness #marketingtips</p>
                  
                  <p><strong>💎 Long-tail hashtags (10K-100K posts):</strong></p>
                  <p style="font-family: monospace;">#marketingparaemprendedores #negociosonlinemexico #socialmediatips2024</p>
                  
                  <p><strong>🏷️ Hashtags de marca:</strong></p>
                  <p style="font-family: monospace;">#TuMarcaPersonal #NombreDeTuEmpresa #Mexico #CDMX</p>
                </div>
                
                <h4>Research de hashtags:</h4>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Paso 1:</strong> Busca hashtags que usan tus competidores exitosos</p>
                  <p><strong>Paso 2:</strong> Verifica volumen en herramientas como Hashtagify</p>
                  <p><strong>Paso 3:</strong> Prueba combinaciones durante 1 semana</p>
                  <p><strong>Paso 4:</strong> Mide alcance e impresiones por hashtag</p>
                  <p><strong>Paso 5:</strong> Optimiza set de hashtags basado en datos</p>
                </div>
              </div>

              <h3>⚡ Balance: Viral vs. Valor</h3>
              <div style="background: #fef7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Reglas de oro para no perder autenticidad:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Relevancia primero:</strong> Solo usa trends que aporten a tu mensaje</li>
                  <li><strong>Adaptación natural:</strong> No fuerces tendencias incompatibles</li>
                  <li><strong>Valor consistente:</strong> Cada trend debe educar o entretener</li>
                  <li><strong>Brand voice:</strong> Mantén tu personalidad en cada trend</li>
                </ul>
                
                <h4>Red flags de mal uso de trends:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li>❌ Usar trends solo porque son populares</li>
                  <li>❌ Forzar tu producto en cualquier trend</li>
                  <li>❌ Copiar exactamente sin adaptación</li>
                  <li>❌ Usar trends ya pasados de moda</li>
                  <li>❌ Saturar contenido con todos los trends disponibles</li>
                </ul>
                
                <div style="background: #dcfce7; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>✅ Ejemplo de uso correcto:</strong></p>
                  <p><strong>Trend:</strong> "Things I wish I knew at 20"</p>
                  <p><strong>Tu adaptación (Marketing):</strong> "Marketing mistakes I wish I knew at 20"</p>
                  <p><strong>Valor agregado:</strong> Tips específicos + tu experiencia personal</p>
                  <p><strong>CTA natural:</strong> "¿Qué consejo le darías a tu yo de 20 años?"</p>
                </div>
              </div>

              <h3>📱 Optimización por Plataforma</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Instagram hashtags:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Ubicación:</strong> Primer comentario (no en caption)</li>
                  <li><strong>Cantidad óptima:</strong> 5-8 hashtags máximo</li>
                  <li><strong>Mix estratégico:</strong> 30% viral + 70% nicho</li>
                  <li><strong>Stories hashtags:</strong> 1-2 hashtags máximo</li>
                </ul>
                
                <h4>TikTok hashtags:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Ubicación:</strong> En la descripción del video</li>
                  <li><strong>Cantidad óptima:</strong> 3-5 hashtags</li>
                  <li><strong>Prioridad:</strong> Trending > nicho > marca</li>
                  <li><strong>Research:</strong> Usar página "Discover" de TikTok</li>
                </ul>
                
                <h4>YouTube Shorts:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Ubicación:</strong> En título y descripción</li>
                  <li><strong>Formato:</strong> #hashtag integrado en texto natural</li>
                  <li><strong>SEO focus:</strong> Keywords > hashtags trending</li>
                  <li><strong>Cantidad:</strong> 2-3 hashtags máximo</li>
                </ul>
              </div>

              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin: 30px 0 20px 0;">
                <h2 style="margin: 0; font-size: 24px;">🎯 Actividad Práctica 4: Serie de 5 guiones para TikTok</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Crea una serie viral de guiones de 15 segundos aplicando todo lo aprendido</p>
              </div>

              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #007bff;">
                <h3 style="color: #007bff; margin-top: 0;">📝 Instrucciones del Proyecto</h3>
                
                <p><strong>Tu misión:</strong> Crear 5 guiones para TikTok de máximo 15 segundos cada uno, promocionando un tema o producto específico.</p>
                
                <h4>Pasos del proyecto:</h4>
                
                <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #0056b3; margin-top: 0;">1. Define tu tema de campaña (5 min)</h5>
                  <ul>
                    <li>Elige un producto/servicio específico</li>
                    <li>Define tu objetivo: ¿ventas, awareness, leads?</li>
                    <li>Identifica tu audiencia TikTok específica</li>
                  </ul>
                  <div style="background: #ffffff; padding: 10px; border-radius: 6px; margin: 10px 0;">
                    <p><strong>Ejemplo de tema:</strong> "5 formas de usar IA para crear contenido"</p>
                  </div>
                </div>

                <div style="background-color: #fff2e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #d63384; margin-top: 0;">2. Research de tendencias actuales (10 min)</h5>
                  <ul>
                    <li>Revisa TikTok Creative Center para trends actuales</li>
                    <li>Identifica 3-5 trends que puedes adaptar</li>
                    <li>Selecciona sonidos trending relevantes</li>
                    <li>Define tu mix de hashtags (3-5 por video)</li>
                  </ul>
                </div>

                <div style="background-color: #e7f5e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #198754; margin-top: 0;">3. Crea los 5 guiones (20 min)</h5>
                  <p>Cada guión debe incluir:</p>
                  <ul>
                    <li><strong>Hook potente:</strong> Primeros 3 segundos irresistibles</li>
                    <li><strong>Estructura clara:</strong> Setup → Desarrollo → Punchline</li>
                    <li><strong>Elementos visuales:</strong> Cambios de plano, props, texto</li>
                    <li><strong>CTA sutil:</strong> Llamada a la acción integrada</li>
                    <li><strong>Trend adaptation:</strong> Al menos 1 trend por guión</li>
                  </ul>
                </div>

                <div style="background-color: #f8f0ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #6f42c1; margin-top: 0;">4. Optimización técnica (10 min)</h5>
                  <ul>
                    <li>Formato vertical (9:16) obligatorio</li>
                    <li>Hashtags estratégicos por video</li>
                    <li>Música/sonido trending seleccionado</li>
                    <li>Momentos de mayor impacto identificados</li>
                  </ul>
                </div>
              </div>

              <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
                <h3 style="color: #155724; margin-top: 0;">📋 Template para cada guión</h3>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.6;">
                  <p><strong>GUIÓN #[1-5]</strong></p>
                  <p><strong>TEMA ESPECÍFICO:</strong> _____________________</p>
                  <p><strong>TREND USADO:</strong> ________________________</p>
                  <p><strong>SONIDO:</strong> ____________________________</p>
                  <br>
                  <p><strong>[0-3 seg] HOOK:</strong></p>
                  <p>Audio: _________________________________</p>
                  <p>Visual: ________________________________</p>
                  <p>Texto en pantalla: ____________________</p>
                  <br>
                  <p><strong>[3-10 seg] DESARROLLO:</strong></p>
                  <p>Punto clave: ___________________________</p>
                  <p>Cambio visual: _________________________</p>
                  <p>Elemento sorpresa: ____________________</p>
                  <br>
                  <p><strong>[10-15 seg] CIERRE:</strong></p>
                  <p>Punchline: ____________________________</p>
                  <p>CTA: __________________________________</p>
                  <p>Loop setup: ____________________________</p>
                  <br>
                  <p><strong>HASHTAGS:</strong> #___ #___ #___ #___ #___</p>
                </div>
              </div>

              <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin-top: 0;">🎬 Criterios de evaluación</h3>
                <p><strong>Tu serie será exitosa si cumple:</strong></p>
                <ul>
                  <li>✅ <strong>Hook impact:</strong> Cada video atrapa en los primeros 3 segundos</li>
                  <li>✅ <strong>Trend integration:</strong> Usa al menos 3 trends diferentes</li>
                  <li>✅ <strong>Visual variety:</strong> Cada guión tiene elementos visuales únicos</li>
                  <li>✅ <strong>Brand coherence:</strong> Los 5 videos se sienten parte de una campaña</li>
                  <li>✅ <strong>Value delivery:</strong> Cada video aporta valor específico</li>
                  <li>✅ <strong>CTA natural:</strong> Llamadas a acción orgánicas y no forzadas</li>
                </ul>
                
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <p><strong>🎯 Instrucción específica final:</strong></p>
                  <p>Una vez completados los 5 guiones, usa entre 5 y 8 hashtags por video, combinando 2 hashtags virales, 2-3 de nicho, y 1-2 de marca. NO satures el mensaje con elementos de tendencia que no aporten valor real.</p>
                </div>
                
                <p><strong>¡Bonus:</strong> Si tienes tiempo, graba el primer guión y analiza su performance para optimizar los siguientes! 🚀</p>
              </div>
            `
          }
        ]
      },
      {
        id: 5,
        title: 'MÓDULO 5: MÉTRICAS Y OPTIMIZACIÓN',
        duration: '65 min',
        description: 'Mide, analiza y optimiza tus guiones usando datos y A/B testing',
        lessons: [
          {
            id: 'gvp-mod5-les1',
            title: '5.1 Métricas clave para evaluar guiones',
            duration: '25 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example13',
            content: `
              <h2>5.1 Métricas clave para evaluar guiones</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">Para medir la efectividad de un guión, necesitas analizar datos específicos que te digan qué funciona y qué no. Aquí aprenderás las métricas que realmente importan.</p>
              </div>

              <h3>📊 Retención de Audiencia</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>¿Qué es?</strong> Porcentaje de personas que ven el video completo o abandonan en cierta parte.</p>
                
                <h4>Métricas clave de retención:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Retención promedio:</strong> % del video que ve la audiencia</li>
                  <li><strong>Momento de abandono:</strong> Segundo exacto donde se van</li>
                  <li><strong>Picos de retención:</strong> Momentos más enganchantes</li>
                  <li><strong>Caídas bruscas:</strong> Elementos que no funcionan</li>
                </ul>
                
                <h4>Benchmarks por plataforma:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>TikTok:</strong> >70% en primeros 3 seg, >50% total<br>
                  <strong>Instagram Reels:</strong> >65% en primeros 3 seg, >45% total<br>
                  <strong>YouTube Shorts:</strong> >60% en primeros 5 seg, >40% total<br>
                  <strong>Stories:</strong> >80% por story (duración completa)</p>
                </div>
                
                <h4>Cómo interpretar la retención:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Abandono en seg 1-3:</strong> Hook débil</li>
                  <li><strong>Abandono gradual:</strong> Contenido aburrido o lento</li>
                  <li><strong>Abandono abrupto:</strong> Momento específico que falla</li>
                  <li><strong>Subidas en retención:</strong> Elementos que funcionan</li>
                </ul>
              </div>

              <h3>🔗 CTR (Click Through Rate)</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>¿Qué es?</strong> Cuántos hacen clic en el enlace o botón del CTA.</p>
                
                <h4>Tipos de CTR importantes:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>CTR de perfil:</strong> Clics al perfil desde el video</li>
                  <li><strong>CTR de link:</strong> Clics en link en bio o directo</li>
                  <li><strong>CTR de CTA:</strong> Acciones específicas solicitadas</li>
                  <li><strong>CTR de hashtags:</strong> Clics en hashtags del post</li>
                </ul>
                
                <h4>Benchmarks por objetivo:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Brand awareness:</strong> 2-5% CTR<br>
                  <strong>Lead generation:</strong> 5-10% CTR<br>
                  <strong>Sales/Conversión:</strong> 8-15% CTR<br>
                  <strong>Engagement:</strong> 1-3% CTR</p>
                </div>
                
                <h4>Factores que afectan el CTR:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Claridad del CTA:</strong> Instrucción específica</li>
                  <li><strong>Urgencia:</strong> "Solo hoy", "Últimas horas"</li>
                  <li><strong>Valor percibido:</strong> Beneficio claro</li>
                  <li><strong>Momento del CTA:</strong> Cuándo aparece en el video</li>
                </ul>
              </div>

              <h3>❤️ Interacciones (Engagement)</h3>
              <div style="background: #fdf4ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Métricas de interacción por plataforma:</h4>
                
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📱 Instagram/TikTok:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li><strong>Likes:</strong> Indicador básico de resonancia</li>
                    <li><strong>Comentarios:</strong> Engagement profundo y conversación</li>
                    <li><strong>Guardados:</strong> Valor percibido alto</li>
                    <li><strong>Compartidos:</strong> Máxima validación social</li>
                  </ul>
                  
                  <p><strong>🎬 YouTube:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li><strong>Watch time:</strong> Tiempo total de visualización</li>
                    <li><strong>Suscripciones:</strong> Generadas desde el video</li>
                    <li><strong>Comentarios:</strong> Discusión y comunidad</li>
                    <li><strong>Likes/Dislikes:</strong> Sentiment analysis</li>
                  </ul>
                </div>
                
                <h4>Engagement Rate fórmulas:</h4>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem; margin: 1rem 0;">
                  <p><strong>ER básico:</strong> (Likes + Comentarios + Guardados) / Alcance × 100</p>
                  <p><strong>ER avanzado:</strong> (Interacciones + Shares + CTR) / Impresiones × 100</p>
                  <p><strong>ER por seguidor:</strong> Interacciones totales / Seguidores × 100</p>
                </div>
                
                <h4>Benchmarks de engagement:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Excelente:</strong> >6% ER</li>
                  <li><strong>Bueno:</strong> 3-6% ER</li>
                  <li><strong>Promedio:</strong> 1-3% ER</li>
                  <li><strong>Bajo:</strong> <1% ER</li>
                </ul>
              </div>

              <h3>🔄 Reproducciones Repetidas</h3>
              <div style="background: #fef7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>¿Por qué importa?</strong> Indica que el contenido es atractivo y memorable.</p>
                
                <h4>Indicadores de replay value:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Replay rate:</strong> % de usuarios que ven 2+ veces</li>
                  <li><strong>Loop completion:</strong> Videos que se ven en bucle</li>
                  <li><strong>Timestamp replays:</strong> Segundos más repetidos</li>
                  <li><strong>Progressive views:</strong> Vistas que aumentan con el tiempo</li>
                </ul>
                
                <h4>Elementos que generan replays:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Información densa:</strong> Contenido que requiere procesamiento</li>
                  <li><strong>Detalles visuales:</strong> Elementos que se notan en segunda vista</li>
                  <li><strong>Punchlines:</strong> Momentos cómicos o impactantes</li>
                  <li><strong>Transitions:</strong> Efectos visuales llamativos</li>
                </ul>
                
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📊 Meta óptima:</strong> 15-25% de replay rate indica contenido de alta calidad</p>
                </div>
              </div>

              <h3>🔧 Herramientas de Analítica</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Por plataforma:</h4>
                
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📱 Instagram Insights:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Alcance e impresiones detalladas</li>
                    <li>Retención por segundo (Reels)</li>
                    <li>Navegación entre Stories</li>
                    <li>Acciones en perfil generadas</li>
                  </ul>
                  
                  <p><strong>🎵 TikTok Analytics:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Tiempo de visualización promedio</li>
                    <li>Fuentes de tráfico</li>
                    <li>Demografía de audiencia</li>
                    <li>Rendimiento por hashtag</li>
                  </ul>
                  
                  <p><strong>🎬 YouTube Studio:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Retención de audiencia detallada</li>
                    <li>Fuentes de descubrimiento</li>
                    <li>CTR de miniatura</li>
                    <li>Revenue per mille (RPM)</li>
                  </ul>
                </div>
                
                <h4>Herramientas externas:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Hootsuite Analytics:</strong> Vista unificada multiplataforma</li>
                  <li><strong>Sprout Social:</strong> Análisis comparativo</li>
                  <li><strong>Later:</strong> Optimización de hashtags</li>
                  <li><strong>Socialblade:</strong> Tracking histórico</li>
                </ul>
              </div>

              <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="color: #856404; margin-top: 0;">🎯 Instrucción específica</h3>
                <p><strong>Utilizar herramientas de analítica de cada plataforma para obtener datos precisos y cruzarlos con el tipo de guión utilizado:</strong></p>
                
                <h4>Rutina de análisis semanal:</h4>
                <ol style="margin: 0.5rem 0;">
                  <li><strong>Lunes:</strong> Recopilar datos de la semana anterior</li>
                  <li><strong>Martes:</strong> Identificar patrones en guiones exitosos</li>
                  <li><strong>Miércoles:</strong> Correlacionar métricas con elementos específicos</li>
                  <li><strong>Jueves:</strong> Documentar insights en tu base de datos</li>
                  <li><strong>Viernes:</strong> Aplicar aprendizajes a próximos guiones</li>
                </ol>
                
                <div style="background: #fef3c7; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📊 Template de seguimiento:</strong></p>
                  <p style="font-family: monospace; font-size: 0.9rem;">
                    Fecha | Plataforma | Tipo Guión | Hook | Retención 3seg | ER | CTR | Notas
                  </p>
                </div>
              </div>
            `
          },
          {
            id: 'gvp-mod5-les2',
            title: '5.2 A/B testing de guiones',
            duration: '20 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example14',
            content: `
              <h2>5.2 A/B testing de guiones</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">El A/B testing te permite comparar dos versiones de un mismo contenido para ver cuál funciona mejor. Es la forma más científica de optimizar tus guiones.</p>
              </div>

              <h3>🔬 ¿Qué es el A/B Testing?</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <p><strong>Definición:</strong> Consiste en comparar dos versiones de un mismo contenido para determinar cuál genera mejores resultados.</p>
                
                <h4>Principios fundamentales:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Un solo cambio:</strong> Modifica únicamente un elemento por test</li>
                  <li><strong>Condiciones iguales:</strong> Mismo horario, día y audiencia</li>
                  <li><strong>Muestra significativa:</strong> Suficientes datos para conclusiones válidas</li>
                  <li><strong>Tiempo suficiente:</strong> Mínimo 7 días para obtener patrones</li>
                </ul>
                
                <h4>Variables que puedes testear:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>🎯 Hook (gancho inicial):</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Pregunta vs. estadística</li>
                    <li>Personal vs. general</li>
                    <li>Emocional vs. racional</li>
                  </ul>
                  
                  <p><strong>📢 CTA (llamada a la acción):</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Directa vs. sutil</li>
                    <li>Principio vs. final</li>
                    <li>Urgente vs. casual</li>
                  </ul>
                  
                  <p><strong>⏱️ Duración:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>15 vs. 30 segundos</li>
                    <li>Información condensada vs. detallada</li>
                    <li>Ritmo rápido vs. pausado</li>
                  </ul>
                </div>
              </div>

              <h3>📊 Metodología de Testing</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Paso 1: Definir hipótesis</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Ejemplo de hipótesis:</strong></p>
                  <p style="font-style: italic;">"Si cambio el hook de pregunta general a resultado específico, entonces la retención en los primeros 3 segundos aumentará del 65% al 75%."</p>
                </div>
                
                <h4>Paso 2: Crear las versiones</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Versión A (Control):</strong> Tu guión actual</li>
                  <li><strong>Versión B (Variante):</strong> Con el elemento modificado</li>
                  <li><strong>Todo lo demás igual:</strong> Duración, estructura, CTA</li>
                </ul>
                
                <h4>Paso 3: Publicar en condiciones similares</h4>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Variables a controlar:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li><strong>Horario:</strong> Mismo día y hora de la semana</li>
                    <li><strong>Hashtags:</strong> Idénticos para ambas versiones</li>
                    <li><strong>Audiencia:</strong> Sin segmentación diferente</li>
                    <li><strong>Contenido visual:</strong> Similar calidad y estilo</li>
                  </ul>
                </div>
                
                <h4>Paso 4: Medir con las mismas métricas</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Métricas primarias:</strong> Las que buscas optimizar</li>
                  <li><strong>Métricas secundarias:</strong> Efectos colaterales</li>
                  <li><strong>Periodo de medición:</strong> Mínimo 7 días</li>
                </ul>
              </div>

              <h3>🎯 Ejemplos Prácticos de Tests</h3>
              <div style="background: #fdf4ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Test 1: Hook Emocional vs. Racional</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Versión A (Emocional):</strong> "Esto cambió mi vida por completo..."</p>
                  <p><strong>Versión B (Racional):</strong> "3 datos que demuestran que esto funciona..."</p>
                  <p><strong>Métrica objetivo:</strong> Retención en primeros 5 segundos</p>
                  <p><strong>Resultado esperado:</strong> Determinar qué resonancia funciona mejor con tu audiencia</p>
                </div>
                
                <h4>Test 2: CTA Temprano vs. Tardío</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Versión A:</strong> CTA en los primeros 10 segundos</p>
                  <p><strong>Versión B:</strong> CTA en los últimos 10 segundos</p>
                  <p><strong>Métrica objetivo:</strong> CTR y completitud de video</p>
                  <p><strong>Resultado esperado:</strong> Optimizar timing del CTA</p>
                </div>
                
                <h4>Test 3: Duración Rápida vs. Detallada</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Versión A:</strong> 15 segundos, información condensada</p>
                  <p><strong>Versión B:</strong> 45 segundos, información detallada</p>
                  <p><strong>Métrica objetivo:</strong> Engagement total y compartidos</p>
                  <p><strong>Resultado esperado:</strong> Encontrar duración óptima</p>
                </div>
              </div>

              <h3>📈 Interpretación de Resultados</h3>
              <div style="background: #fef7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Significancia estadística:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Diferencia mínima:</strong> >20% para ser considerada relevante</li>
                  <li><strong>Muestra mínima:</strong> 1000 visualizaciones por versión</li>
                  <li><strong>Confianza:</strong> 95% de certeza en los resultados</li>
                </ul>
                
                <h4>Qué hacer con los resultados:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>✅ Ganador claro (>20% diferencia):</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Implementar el elemento ganador</li>
                    <li>Aplicar aprendizaje a futuros guiones</li>
                    <li>Documentar en base de mejores prácticas</li>
                  </ul>
                  
                  <p><strong>⚖️ Resultados similares (<20% diferencia):</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Extender periodo de medición</li>
                    <li>Aumentar tamaño de muestra</li>
                    <li>Considerar variables externas</li>
                  </ul>
                  
                  <p><strong>❌ Ambas versiones con mal rendimiento:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>El problema puede estar en otro elemento</li>
                    <li>Replantear hipótesis inicial</li>
                    <li>Testear variable diferente</li>
                  </ul>
                </div>
              </div>

              <h3>📅 Planificación de Tests</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Calendario mensual sugerido:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem; margin: 1rem 0;">
                  <p><strong>Semana 1:</strong> Test de Hook (3 variantes)<br>
                  <strong>Semana 2:</strong> Test de CTA (2 variantes)<br>
                  <strong>Semana 3:</strong> Test de Duración (2 variantes)<br>
                  <strong>Semana 4:</strong> Test de Estructura narrativa (2 variantes)</p>
                </div>
                
                <h4>Template de documentación:</h4>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.8rem; margin: 1rem 0;">
                  <p><strong>Test #:</strong> ___________<br>
                  <strong>Fecha:</strong> ___________<br>
                  <strong>Hipótesis:</strong> ___________<br>
                  <strong>Variable testeda:</strong> ___________<br>
                  <strong>Versión A:</strong> ___________<br>
                  <strong>Versión B:</strong> ___________<br>
                  <strong>Métrica objetivo:</strong> ___________<br>
                  <strong>Resultado:</strong> ___________<br>
                  <strong>Acción a tomar:</strong> ___________</p>
                </div>
              </div>

              <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <h3 style="color: #856404; margin-top: 0;">🎯 Instrucción específica</h3>
                <p><strong>Planificar mínimo 3 pruebas A/B al mes y documentar los resultados para ir construyendo una base de "mejores prácticas" adaptada a tu marca:</strong></p>
                
                <div style="background: #fef3c7; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <h4>📋 Proceso obligatorio mensual:</h4>
                  <ol style="margin: 0.5rem 0;">
                    <li><strong>Planificar:</strong> 3 tests mínimo con hipótesis clara</li>
                    <li><strong>Ejecutar:</strong> En condiciones controladas</li>
                    <li><strong>Medir:</strong> Durante periodo mínimo establecido</li>
                    <li><strong>Documentar:</strong> Resultados y aprendizajes</li>
                    <li><strong>Implementar:</strong> Cambios en estrategia general</li>
                  </ol>
                </div>
                
                <p><strong>Meta:</strong> Al final de 6 meses, tener 18+ insights documentados específicos para tu marca y audiencia.</p>
              </div>
            `
          },
          {
            id: 'gvp-mod5-les3',
            title: '5.3 Mejora continua del contenido',
            duration: '20 min',
            type: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=example15',
            content: `
              <h2>5.3 Mejora continua del contenido</h2>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #475569; line-height: 1.6;">La optimización no es un proceso único, sino constante. Aquí aprenderás a crear un sistema de mejora continua que evoluciona con tu audiencia y las plataformas.</p>
              </div>

              <h3>🔄 Filosofía de Mejora Continua</h3>
              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>¿Por qué es necesaria?</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Algoritmos cambiantes:</strong> Las plataformas actualizan constantemente</li>
                  <li><strong>Audiencia evolutiva:</strong> Gustos y comportamientos cambian</li>
                  <li><strong>Competencia creciente:</strong> El nivel del contenido sube constantemente</li>
                  <li><strong>Nuevas tendencias:</strong> Formatos y estilos emergen regularmente</li>
                </ul>
                
                <h4>Mentalidad de crecimiento:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>❌ Mentalidad fija:</strong> "Mi contenido ya está bien"</p>
                  <p><strong>✅ Mentalidad de crecimiento:</strong> "¿Cómo puedo mejorar cada video?"</p>
                </div>
              </div>

              <h3>📊 Revisión Mensual del Rendimiento</h3>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Proceso de revisión sistemática:</h4>
                
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📈 Análisis cuantitativo (Semana 1 del mes):</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Recopilar métricas de todos los videos del mes</li>
                    <li>Calcular promedios y identificar outliers</li>
                    <li>Comparar con meses anteriores</li>
                    <li>Identificar tendencias de crecimiento/declive</li>
                  </ul>
                  
                  <p><strong>🔍 Análisis cualitativo (Semana 2 del mes):</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Revisar comentarios y feedback de audiencia</li>
                    <li>Analizar qué temas generaron más interacción</li>
                    <li>Evaluar calidad de engagement (no solo cantidad)</li>
                    <li>Identificar patrones en contenido más guardado/compartido</li>
                  </ul>
                </div>
                
                <h4>Herramientas para la revisión:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Hoja de cálculo:</strong> Para tracking histórico</li>
                  <li><strong>Analytics nativos:</strong> Datos detallados por plataforma</li>
                  <li><strong>Herramientas externas:</strong> Vista consolidada</li>
                  <li><strong>Feedback directo:</strong> Encuestas y polls</li>
                </ul>
              </div>

              <h3>🔍 Identificación de Patrones</h3>
              <div style="background: #fdf4ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Patrones a identificar en guiones exitosos:</h4>
                
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📚 Temas que funcionan:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>¿Qué topics generan más engagement?</li>
                    <li>¿Hay estacionalidad en ciertos temas?</li>
                    <li>¿Qué problemas de tu audiencia resuenan más?</li>
                  </ul>
                  
                  <p><strong>🎭 Tono y estilo:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>¿Formal vs casual? ¿Qué prefiere tu audiencia?</li>
                    <li>¿Humor vs serio? ¿En qué contextos funciona cada uno?</li>
                    <li>¿Personal vs profesional? ¿Cuál genera más confianza?</li>
                  </ul>
                  
                  <p><strong>🏗️ Estructura narrativa:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>¿Qué tipos de hooks tienen mejor retención?</li>
                    <li>¿Cuál es la duración óptima para tu audiencia?</li>
                    <li>¿Dónde colocar el CTA para máximo CTR?</li>
                  </ul>
                </div>
                
                <h4>Método de análisis de patrones:</h4>
                <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; font-family: monospace; font-size: 0.9rem; margin: 1rem 0;">
                  <p><strong>Top 10 videos del mes:</strong><br>
                  1. ¿Qué tienen en común?<br>
                  2. ¿Qué elementos únicos destacan?<br>
                  3. ¿Hay patrones en timing de publicación?<br>
                  4. ¿Qué hashtags se repiten?<br>
                  5. ¿Qué tipo de CTA utilizan?</p>
                  
                  <p><strong>Bottom 5 videos del mes:</strong><br>
                  1. ¿Qué falló en común?<br>
                  2. ¿Hay elementos que evitar?<br>
                  3. ¿El timing fue inadecuado?<br>
                  4. ¿El hook no funcionó?</p>
                </div>
              </div>

              <h3>🚀 Aplicación de Aprendizajes</h3>
              <div style="background: #fef7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>De insight a acción:</h4>
                
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>📝 Creación de templates:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Desarrollar templates basados en patrones exitosos</li>
                    <li>Crear biblioteca de hooks que funcionan</li>
                    <li>Establecer estructura narrativa optimizada</li>
                    <li>Definir guidelines de tono y estilo</li>
                  </ul>
                  
                  <p><strong>🎯 Refinamiento de targeting:</strong></p>
                  <ul style="margin: 0.5rem 0;">
                    <li>Ajustar buyer persona basado en engagement real</li>
                    <li>Identificar subtemas que resuenan más</li>
                    <li>Adaptar horarios de publicación</li>
                    <li>Optimizar strategy de hashtags</li>
                  </ul>
                </div>
                
                <h4>Implementación gradual:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>20% experimento:</strong> Nuevos elementos/formatos</li>
                  <li><strong>80% optimizado:</strong> Aplicar aprendizajes comprobados</li>
                  <li><strong>Testing continuo:</strong> Validar cambios con A/B tests</li>
                  <li><strong>Documentación:</strong> Registrar resultados de cambios</li>
                </ul>
              </div>

              <h3>🆕 Experimentación con Nuevos Formatos</h3>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                <h4>Mantente al día con tendencias:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Nuevas features:</strong> Instagram Reels Templates, TikTok Effects</li>
                  <li><strong>Formatos emergentes:</strong> Carousel posts, Stories interactivos</li>
                  <li><strong>Tendencias de contenido:</strong> Educational, Behind-the-scenes</li>
                  <li><strong>Cambios de algoritmo:</strong> Adaptación a nuevas prioridades</li>
                </ul>
                
                <h4>Proceso de experimentación:</h4>
                <div style="background: #ffffff; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                  <p><strong>Semana 1:</strong> Research de nueva tendencia/formato</p>
                  <p><strong>Semana 2:</strong> Crear content piloto adaptado a tu marca</p>
                  <p><strong>Semana 3:</strong> Publicar y medir performance inicial</p>
                  <p><strong>Semana 4:</strong> Analizar resultados y decidir escalamiento</p>
                </div>
                
                <h4>Criterios para adoptar nuevos formatos:</h4>
                <ul style="margin: 0.5rem 0;">
                  <li><strong>Alineación con brand:</strong> ¿Encaja con tu personalidad?</li>
                  <li><strong>Capacidad de ejecución:</strong> ¿Tienes recursos necesarios?</li>
                  <li><strong>Potencial de ROI:</strong> ¿Vale la pena la inversión?</li>
                  <li><strong>Longevidad:</strong> ¿Es una moda pasajera o tendencia duradera?</li>
                </ul>
              </div>

              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin: 30px 0 20px 0;">
                <h2 style="margin: 0; font-size: 24px;">🎯 Actividad Práctica 5: Plan de contenido mensual con IA</h2>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Crea un calendario estratégico de contenido usando IA y tus aprendizajes</p>
              </div>

              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #007bff;">
                <h3 style="color: #007bff; margin-top: 0;">📝 Instrucciones del Proyecto</h3>
                
                <p><strong>Tu misión:</strong> Crear un calendario de contenido para 1 mes con 4 pilares temáticos para tu tipo de negocio o marca.</p>
                
                <h4>Pasos del proyecto:</h4>
                
                <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #0056b3; margin-top: 0;">1. Elige un negocio o perfil real (5 min)</h5>
                  <ul>
                    <li>Define tu nicho específico (ej: coach de productividad)</li>
                    <li>Identifica tu audiencia objetivo</li>
                    <li>Establece objetivos del mes (awareness, ventas, comunidad)</li>
                  </ul>
                </div>

                <div style="background-color: #fff2e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #d63384; margin-top: 0;">2. Define 4 pilares de contenido (10 min)</h5>
                  <p>Ejemplos de pilares:</p>
                  <ul>
                    <li><strong>Educativo:</strong> Tips y tutoriales</li>
                    <li><strong>Inspiracional:</strong> Motivación y casos de éxito</li>
                    <li><strong>Behind the scenes:</strong> Proceso y vida personal</li>
                    <li><strong>Promocional:</strong> Productos/servicios (máximo 20%)</li>
                  </ul>
                </div>

                <div style="background-color: #e7f5e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #198754; margin-top: 0;">3. Usa el prompt para generar el calendario (20 min)</h5>
                  <p><strong>Prompt sugerido:</strong></p>
                  <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 14px;">
                    "Crea un calendario de contenido para 1 mes con 4 pilares temáticos para [tipo de negocio o marca]. Por cada semana, sugiere un guión corto para TikTok o Reels, con su enfoque, llamado a la acción y hashtags sugeridos. Formato: tabla o lista organizada."
                  </div>
                </div>

                <div style="background-color: #f8f0ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h5 style="color: #6f42c1; margin-top: 0;">4. Revisa que cada guión esté optimizado para red social (10 min)</h5>
                  <ul>
                    <li>Hook fuerte en primeros 3 segundos</li>
                    <li>CTA claro y específico</li>
                    <li>Hashtags balanceados (viral + nicho + marca)</li>
                    <li>Duración apropiada para la plataforma</li>
                    <li>Valor entregado en cada post</li>
                  </ul>
                </div>
              </div>

              <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
                <h3 style="color: #155724; margin-top: 0;">📋 Template de Calendario Mensual</h3>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 12px; line-height: 1.4;">
                  <p><strong>NEGOCIO/MARCA:</strong> _____________________</p>
                  <p><strong>MES:</strong> _____________ <strong>OBJETIVO:</strong> _____________</p>
                  <br>
                  <p><strong>PILARES DE CONTENIDO:</strong></p>
                  <p>1. _________________ 2. _________________</p>
                  <p>3. _________________ 4. _________________</p>
                  <br>
                  <p><strong>SEMANA 1:</strong></p>
                  <p>Pilar: _____________ Guión: _____________</p>
                  <p>Hook: _____________ CTA: _____________</p>
                  <p>Hashtags: #___ #___ #___ #___ #___</p>
                  <br>
                  <p><strong>SEMANA 2:</strong></p>
                  <p>Pilar: _____________ Guión: _____________</p>
                  <p>Hook: _____________ CTA: _____________</p>
                  <p>Hashtags: #___ #___ #___ #___ #___</p>
                  <br>
                  <p><strong>SEMANA 3:</strong></p>
                  <p>Pilar: _____________ Guión: _____________</p>
                  <p>Hook: _____________ CTA: _____________</p>
                  <p>Hashtags: #___ #___ #___ #___ #___</p>
                  <br>
                  <p><strong>SEMANA 4:</strong></p>
                  <p>Pilar: _____________ Guión: _____________</p>
                  <p>Hook: _____________ CTA: _____________</p>
                  <p>Hashtags: #___ #___ #___ #___ #___</p>
                </div>
              </div>

              <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ffc107;">
                <h3 style="color: #856404; margin-top: 0;">🎯 Instrucción específica</h3>
                <p><strong>Mantener un registro de guiones con sus métricas de rendimiento, fecha de publicación y observaciones para ir afinando la estrategia de contenido con IA:</strong></p>
                
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <h4>📊 Sistema de seguimiento obligatorio:</h4>
                  <ol>
                    <li><strong>Revisar mensualmente</strong> el rendimiento de los guiones</li>
                    <li><strong>Identificar patrones</strong> en guiones que funcionaron mejor</li>
                    <li><strong>Aplicar aprendizajes</strong> a la creación de nuevos guiones</li>
                    <li><strong>Experimentar</strong> con nuevos formatos y tendencias</li>
                  </ol>
                </div>
                
                <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 12px; margin: 15px 0;">
                  <p><strong>REGISTRO DE PERFORMANCE:</strong></p>
                  <p>Fecha | Plataforma | Pilar | Hook | Retención | ER | CTR | Observaciones</p>
                  <p>_____|___________|______|______|__________|____|____|_____________</p>
                </div>
                
                <p><strong>Meta:</strong> Después de 3 meses usando este sistema, deberías tener insights claros sobre qué funciona mejor para tu marca específica.</p>
              </div>
            `
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'gvp-mod1-les1',
        moduleId: 1,
        title: '1.1 ¿Qué es un guión digital?',
        duration: '15 min',
        type: 'video',
        description: 'Es la hoja de ruta detallada de un video, que especifica diálogos, acciones, recursos visuales y sonoros.',
        videoUrl: 'https://www.youtube.com/watch?v=example1',
        content: `
          <h2>1.1 ¿Qué es un guión digital?</h2>
          
          <p>Es la hoja de ruta detallada de un video, que especifica diálogos, acciones, recursos visuales y sonoros. En el marketing digital, su función es guiar al equipo para mantener coherencia y asegurar que el mensaje cumpla el objetivo.</p>
          
          <h3>Descripción adicional:</h3>
          <p>Incluye indicaciones técnicas (planos, cortes, efectos) y narrativas (tono, ritmo, emoción). Un guión digital bien hecho reduce errores de producción y agiliza la edición.</p>
          
          <h3>Instrucción específica:</h3>
          <p><strong>Siempre iniciar con un objetivo claro</strong> (vender, educar, entretener) antes de escribir una sola línea.</p>
        `
      },
      {
        id: 'gvp-mod1-les2',
        moduleId: 1,
        title: '1.2 Estructura básica de un guión efectivo',
        duration: '18 min',
        type: 'video',
        description: 'Hook, desarrollo y Call-to-Action para crear guiones efectivos',
        videoUrl: 'https://www.youtube.com/watch?v=example2',
        content: `
          <h2>1.2 Estructura básica de un guión efectivo</h2>
          
          <h3>1. Hook (3-5 segundos iniciales)</h3>
          <p>Elementos que captan atención:</p>
          <ul>
            <li>Una pregunta intrigante</li>
            <li>Dato sorprendente</li>
            <li>Imagen llamativa</li>
          </ul>
          
          <h3>2. Desarrollo</h3>
          <p>Explicación clara, con ejemplos o beneficios. Debe mantener interés y estar alineado al objetivo.</p>
          
          <h3>3. Call-to-Action</h3>
          <p>Indicación directa de qué hacer: comprar, suscribirse, comentar.</p>
          
          <h3>Instrucción específica:</h3>
          <p>Usar frases cortas, evitar tecnicismos innecesarios y mantener coherencia entre guion y recursos visuales.</p>
        `
      },
      {
        id: 'gvp-mod1-les3',
        moduleId: 1,
        title: '1.3 Diferencias entre guiones para YouTube, TikTok e Instagram',
        duration: '17 min',
        type: 'video',
        description: 'Adapta tus guiones según la plataforma y formato específico',
        videoUrl: 'https://www.youtube.com/watch?v=example3',
        content: `
          <h2>1.3 Diferencias entre guiones por plataforma</h2>
          
          <h3>🎬 YouTube</h3>
          <ul>
            <li>Guiones más largos</li>
            <li>Estructura narrativa profunda</li>
            <li>Mayor desarrollo de contenido</li>
          </ul>
          
          <h3>📱 TikTok</h3>
          <ul>
            <li>Guiones muy breves</li>
            <li>Impacto inmediato</li>
            <li>Tendencia visual predominante</li>
          </ul>
          
          <h3>📷 Instagram (Reels y Stories)</h3>
          <ul>
            <li>Interacción rápida</li>
            <li>Enfoque visual y emocional</li>
            <li>Formato vertical optimizado</li>
          </ul>
          
          <p><strong>Conclusión:</strong> Cada formato demanda distintos estilos de lenguaje, duración y ritmo.</p>
        `
      },
      {
        id: 'gvp-mod1-actividad1',
        moduleId: 1,
        title: 'Actividad práctica 1: Análisis de guiones virales',
        duration: '20 min',
        type: 'lab',
        description: 'Analiza guiones virales usando prompts de IA para identificar elementos clave',
        videoUrl: 'https://www.youtube.com/watch?v=example4',
        content: `
          <h2>Actividad práctica 1: Análisis de guiones virales</h2>
          
          <h3>🎯 Objetivo:</h3>
          <p>Analizar la estructura de guiones virales para identificar elementos clave que los hacen efectivos.</p>
          
          <h3>📝 Prompt sugerido para ChatGPT:</h3>
          <div class="prompt-box">
            <p><strong>"Actúa como analista de contenido. Muéstrame la estructura del siguiente guión viral e identifica: 1) el gancho inicial, 2) el desarrollo del mensaje y 3) el llamado a la acción. Aquí está el guión: [pega el texto del guión]."</strong></p>
          </div>
          
          <h3>📋 Indicaciones paso a paso:</h3>
          <ol>
            <li><strong>Paso 1:</strong> Elige un video viral de TikTok, Instagram o YouTube Shorts</li>
            <li><strong>Paso 2:</strong> Transcribe el texto del video o copia el guión si está disponible</li>
            <li><strong>Paso 3:</strong> Pega ese guión en el prompt anterior usando ChatGPT</li>
            <li><strong>Paso 4:</strong> Analiza los elementos encontrados y toma notas</li>
          </ol>
          
          <h3>🔍 Elementos a identificar:</h3>
          <ul>
            <li><strong>Gancho inicial:</strong> ¿Qué capturó tu atención en los primeros 3-5 segundos?</li>
            <li><strong>Desarrollo del mensaje:</strong> ¿Cómo mantuvieron el interés?</li>
            <li><strong>Llamado a la acción:</strong> ¿Qué te pidieron hacer exactamente?</li>
          </ul>
          
          <h3>💡 Consejos para el análisis:</h3>
          <p>Busca patrones en videos de tu nicho y anota qué técnicas se repiten en los contenidos más exitosos.</p>
        `
      }
    ]
  };

  // Convertir módulos a lecciones planas para compatibilidad
  const lessons = courseData.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      ...lesson,
      moduleId: module.id,
      moduleName: module.title
    }))
  );

  // Función para asignar moduleId basado en el orden de la lección (temporal)
  const getLessonModuleId = (lesson: any) => {
    // Por ahora, todas las lecciones son del Módulo 1
    return 1;
  };

  // Función para expandir/colapsar módulos
  const toggleModuleExpansion = (moduleId: number) => {
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

  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/guiones-videos-promocionales-ia/contenido');
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
            router.push('/curso/guiones-videos-promocionales-ia');
            return;
          }
        } else {
          setIsEnrolled(data.isEnrolled);
        }
      } else {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.log('🔍 [DEBUG] No se pudo parsear respuesta JSON, usando texto plano');
          errorData = { message: 'Error de respuesta del servidor' };
        }
        console.error('🔍 [DEBUG] Error en respuesta:', errorData);
        
        // Si el error es de autenticación, redirigir al login
        if (response.status === 401) {
          console.log('🔍 [DEBUG] Error 401 - Token expirado o inválido, redirigiendo al login');
          router.push('/login?redirect=/curso/guiones-videos-promocionales-ia/contenido');
          return;
        }
        
        // Para otros errores, intentar inscripción directa
        console.log('🔍 [DEBUG] Error no es 401, intentando inscripción directa...');
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
            console.log('✅ [DEBUG] Usuario inscrito exitosamente tras error');
            setIsEnrolled(true);
          } else {
            console.error('❌ [DEBUG] Error en inscripción tras error');
            router.push('/curso/guiones-videos-promocionales-ia');
          }
        } catch (enrollError) {
          console.error('❌ [DEBUG] Error crítico en inscripción:', enrollError);
          router.push('/curso/guiones-videos-promocionales-ia');
        }
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
          router.push('/curso/guiones-videos-promocionales-ia');
        }
      } catch (enrollError) {
        console.error('❌ [DEBUG] Error crítico:', enrollError);
        router.push('/curso/guiones-videos-promocionales-ia');
      }
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  

  const handleManualLessonChange = async (newLessonIndex: number) => {
    const currentLesson = lessons[progress.currentLesson];
    await saveProgress(
      progress.currentLesson,
      progress.completedLessons,
      currentLesson?.id ? parseInt(currentLesson.id.split('-').pop() || '0') : undefined,
      currentLesson?.title,
      'access',
      1
    );
    setCurrentLesson(newLessonIndex);
  };

  const handleReturnToCourse = async () => {
    setIsSaving(true);
    try {
      const currentLesson = lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id ? parseInt(currentLesson.id.split('-').pop() || '0') : undefined,
        currentLesson?.title,
        'access',
        1
      );
      router.push('/curso/guiones-videos-promocionales-ia');
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setIsSaving(false);
    }
  };

  const handlePreviousLesson = async () => {
    if (progress.currentLesson > 0) {
      const currentLesson = lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id ? parseInt(currentLesson.id.split('-').pop() || '0') : undefined,
        currentLesson?.title,
        'access',
        1
      );
      setCurrentLesson(progress.currentLesson - 1);
    }
  };

  // Funciones helper para módulos
  const isModuleCompleted = (moduleId: number) => {
    const moduleLessons = lessons.filter(lesson => lesson.moduleId === moduleId);
    return moduleLessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };

  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = lessons.filter(lesson => lesson.moduleId === moduleId);
    const completedCount = moduleLessons.filter(lesson => 
      progress.completedLessons.includes(lesson.id)
    ).length;
    return {
      completed: completedCount,
      total: moduleLessons.length
    };
  };

  const handleMarkLessonComplete = async (lessonId: string) => {
    // Si el curso ya está completado, no permitir marcar lecciones como completadas
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Estás en modo de revisión.');
      return;
    }

    const currentLessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    const currentLesson = lessons[currentLessonIndex];
    
    const newCompletedLessons = progress.completedLessons.includes(lessonId) 
      ? progress.completedLessons 
      : [...progress.completedLessons, lessonId];
    
    markLessonComplete(lessonId);
    
    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id ? parseInt(currentLesson.id.split('-').pop() || '0') : undefined,
      currentLesson.title,
      'complete',
      5
    );
    
    if (currentLessonIndex < lessons.length - 1) {
      setTimeout(() => {
        setCurrentLesson(currentLessonIndex + 1);
      }, 100);
    }
  };

  // Función para verificar si se puede mostrar el botón de completar módulo
  const canCompleteModule = (moduleId: number) => {
    const currentLesson = lessons[progress.currentLesson];
    const moduleLessons = lessons.filter(lesson => lesson.moduleId === moduleId);
    const isLastInModule = moduleLessons[moduleLessons.length - 1].id === currentLesson.id;
    const moduleProgress = getModuleProgress(moduleId);
    
    // Verificar si todas las lecciones del módulo menos la actual están completadas
    const allOtherLessonsCompleted = moduleProgress.completed === moduleProgress.total - 1;
    
    return isLastInModule && allOtherLessonsCompleted && !progress.completedLessons.includes(currentLesson.id);
  };

  // Función para verificar si se pueden completar todas las lecciones anteriores del módulo
  const canCompleteModuleWithPrerequisites = (moduleId: number) => {
    const moduleLessons = lessons.filter(lesson => lesson.moduleId === moduleId);
    const currentLesson = lessons[progress.currentLesson];
    
    // Obtener todas las lecciones del módulo excepto la actual (que es la última)
    const previousLessons = moduleLessons.filter(lesson => lesson.id !== currentLesson.id);
    
    // Verificar que todas las lecciones anteriores estén completadas
    const allPreviousCompleted = previousLessons.every(lesson => progress.completedLessons.includes(lesson.id));
    
    return allPreviousCompleted;
  };

  // Últimas lecciones de cada módulo
  const LAST_LESSONS_BY_MODULE: Record<number, string> = {
    1: 'gvp-mod1-les3', // 1.3 Diferencias entre guiones por plataforma
    2: 'gvp-mod2-les3', // 2.3 Configuración y buenas prácticas
    3: 'gvp-mod3-les3', // 3.3 Optimización de guiones con IA
    4: 'gvp-mod4-les3', // 4.3 Distribución y promoción
    5: 'gvp-mod5-les3'  // 5.3 Mejora continua del contenido
  };

  // Función para verificar si es la última lección del módulo
  const isLastLessonOfModule = (lessonId: string, moduleId: number): boolean => {
    return LAST_LESSONS_BY_MODULE[moduleId] === lessonId;
  };

  // Función auxiliar para obtener el título del módulo
  const getModuleTitle = (moduleId: number): string => {
    switch (moduleId) {
      case 1: return 'Módulo 1: FUNDAMENTOS DEL GUIÓN DIGITAL';
      case 2: return 'Módulo 2: HERRAMIENTAS DE IA PARA GUIÓN';
      case 3: return 'Módulo 3: ESTRUCTURA Y NARRATIVA';
      case 4: return 'Módulo 4: OPTIMIZACIÓN Y TESTING';
      case 5: return 'Módulo 5: MEJORA CONTINUA';
      default: return `Módulo ${moduleId}`;
    }
  };

  const handleCompleteModule = async (moduleId: number) => {
    if (!isEnrolled) return;

    // Si el curso ya está completado, no permitir completar módulos
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Estás en modo de revisión.');
      return;
    }

    // Verificar que se puedan completar todas las lecciones anteriores del módulo
    if (!canCompleteModuleWithPrerequisites(moduleId)) {
      alert('Debes completar todas las lecciones anteriores del módulo antes de poder completarlo.');
      return;
    }
    
    // Obtener todas las lecciones del módulo
    const moduleLessons = lessons.filter(lesson => lesson.moduleId === moduleId);
    
    // Crear array con todas las lecciones completadas (existentes + todas las del módulo)
    const allModuleLessonIds = moduleLessons.map(lesson => lesson.id);
    const newCompletedLessons = [
      ...progress.completedLessons.filter(id => !allModuleLessonIds.includes(id)), // Lecciones de otros módulos
      ...allModuleLessonIds // Todas las lecciones de este módulo
    ];

    // Actualizar el estado local con todas las lecciones del módulo
    allModuleLessonIds.forEach(lessonId => {
      if (!progress.completedLessons.includes(lessonId)) {
        markLessonComplete(lessonId);
      }
    });

    // Guardar progreso con todas las lecciones del módulo completadas
    const currentLessonIndex = progress.currentLesson;
    const currentLesson = lessons[currentLessonIndex];

    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id ? parseInt(currentLesson.id.split('-').pop() || '0') : undefined,
      `Módulo ${moduleId} Completado`,
      'complete',
      10 // Tiempo adicional por completar módulo
    );

    // Mostrar notificación de éxito
    const moduleTitle = getModuleTitle(moduleId);
    const moduleProgress = getModuleProgress(moduleId);
    
    setAchievementData({
      type: 'module',
      title: `¡Módulo Completado!`,
      message: `¡Felicitaciones! Has completado exitosamente el ${moduleTitle}. Continúa con el siguiente módulo para avanzar en tu aprendizaje.`,
      stats: {
        completed: moduleProgress.completed,
        total: moduleProgress.total,
        percentage: Math.round((moduleProgress.completed / moduleProgress.total) * 100)
      }
    });
    setShowModuleNotification(true);

    // Si no es el último módulo, avanzar a la primera lección del siguiente módulo
    if (moduleId < 5) {
      const nextModuleLessons = lessons.filter(lesson => lesson.moduleId === moduleId + 1);
      if (nextModuleLessons.length > 0) {
        const nextLessonIndex = lessons.findIndex(lesson => lesson.id === nextModuleLessons[0].id);
        if (nextLessonIndex !== -1) {
          setCurrentLesson(nextLessonIndex);
        }
      }
    }
  };

  const handleCompleteCourse = async () => {
    if (!isEnrolled) return;
    
    // Si el curso ya está completado, mostrar mensaje
    if (isCourseCompleted()) {
      setAchievementData({
        type: 'course',
        title: '¡Curso Ya Completado!',
        message: 'Este curso ya está completado. Puedes revisar el contenido cuando quieras.',
        stats: {
          completed: lessons.length,
          total: lessons.length,
          percentage: 100
        }
      });
      setShowCourseNotification(true);
      return;
    }
    
    // Verificar si todas las lecciones están completadas
    const allLessonsCompleted = lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
    
    if (!allLessonsCompleted) {
      setAchievementData({
        type: 'course',
        title: 'Completa Todas las Lecciones',
        message: 'Debes completar todas las lecciones antes de poder terminar el curso.',
        stats: {
          completed: progress.completedLessons.length,
          total: lessons.length,
          percentage: Math.round((progress.completedLessons.length / lessons.length) * 100)
        }
      });
      setShowCourseNotification(true);
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
          courseSlug: 'guiones-videos-promocionales-ia'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Mostrar notificación de éxito
        setAchievementData({
          type: 'course',
          title: '¡Curso Completado!',
          message: '¡Felicitaciones! Has completado exitosamente el curso de Guiones para videos promocionales con IA. ¡Has logrado un gran hito en tu aprendizaje!',
          stats: {
            completed: lessons.length,
            total: lessons.length,
            percentage: 100
          }
        });
        setShowCourseNotification(true);
        
        // Redirigir a la página de inicio del curso después de mostrar la notificación
        setTimeout(() => {
          router.push('/curso/guiones-videos-promocionales-ia');
        }, 3000);
      } else {
        const error = await response.json();
        console.error('❌ Error al completar curso:', error);
        setAchievementData({
          type: 'course',
          title: 'Error al Completar',
          message: 'Error al completar el curso. Por favor, intenta de nuevo.',
          stats: {
            completed: progress.completedLessons.length,
            total: lessons.length,
            percentage: Math.round((progress.completedLessons.length / lessons.length) * 100)
          }
        });
        setShowCourseNotification(true);
      }
    } catch (error) {
      console.error('❌ Error al completar curso:', error);
      setAchievementData({
        type: 'course',
        title: 'Error de Conexión',
        message: 'Error de conexión. Por favor, intenta de nuevo.',
        stats: {
          completed: progress.completedLessons.length,
          total: lessons.length,
          percentage: Math.round((progress.completedLessons.length / lessons.length) * 100)
        }
      });
      setShowCourseNotification(true);
    } finally {
      setIsSaving(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isLessonAccessible = (lessonIndex: number) => {
    // Permitir navegación libre: todas las lecciones son siempre accesibles
    return true;
  };

  const isCourseCompleted = () => {
    return progress.status === 'COMPLETED' || progress.progressPercentage === 100;
  };

  const getLessonStatus = (lessonIndex: number, lessonId: string) => {
    if (isLessonCompleted(lessonId)) {
      // Si el curso está completado, mostrar estado de revisión
      if (isCourseCompleted()) {
        return '📖';
      }
      return '✅';
    } else if (lessonIndex === progress.currentLesson) {
      return '▶️';
    } else {
      return '📖';
    }
  };

  const areAllLessonsCompleted = () => {
    return lessons.every(lesson => 
      progress.completedLessons.includes(lesson.id)
    );
  };

  if (!user || isLoading || isCheckingEnrollment) {
    return <div className="loading-container" suppressHydrationWarning>Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/guiones-videos-promocionales-ia')}>
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar  />
      
      
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
                  <a href="/cursos-gratuitos" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Cursos Gratuitos</span>
                  </a>
                  <span className="breadcrumb-separator">/</span>
                  <a href="/curso/guiones-videos-promocionales-ia" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎬</span>
                    <span className="breadcrumb-text">Guiones para videos promocionales con IA</span>
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
                    <h2>Lección {progress.currentLesson + 1}: {lessons[progress.currentLesson].title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-type">{lessons[progress.currentLesson].type}</span>
                      <span className="lesson-duration">{lessons[progress.currentLesson].duration}</span>
                    </div>
                  </div>
                  
                  <div className="lesson-content">
                    {/* Video de la lección */}
                    {lessons[progress.currentLesson].videoUrl && (
                      <div className="lesson-video">
                        <VideoPlayer
                          videoUrl={lessons[progress.currentLesson].videoUrl!}
                          title={lessons[progress.currentLesson].title}
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
                        __html: lessons[progress.currentLesson].content 
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
                      
                      {/* Botón siguiente - navegación libre */}
                      {progress.currentLesson < lessons.length - 1 && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => {
                            const nextLessonIndex = progress.currentLesson + 1;
                            handleManualLessonChange(nextLessonIndex);
                          }}
                        >
                          Siguiente lección →
                        </button>
                      )}
                      
                      {/* Lógica de botones basada en si es la última lección del módulo */}
                      {(() => {
                        const currentLesson = lessons[progress.currentLesson];
                        const currentModuleId = currentLesson.moduleId;
                        const isLastLesson = isLastLessonOfModule(currentLesson.id, currentModuleId);
                        const isCurrentLessonCompleted = progress.completedLessons.includes(currentLesson.id);
                        const isModuleAlreadyCompleted = isModuleCompleted(currentModuleId);
                        
                        if (isModuleAlreadyCompleted) {
                          // Módulo ya completado - no mostrar botones de completar
                          return null;
                        }
                        
                        if (isLastLesson) {
                          // Última lección del módulo - solo mostrar botón "Completar Módulo"
                          const canComplete = canCompleteModuleWithPrerequisites(currentModuleId);
                          return (
                            <button 
                              className={`btn btn-large ${canComplete ? 'btn-success' : 'btn-secondary'}`}
                              onClick={() => handleCompleteModule(currentModuleId)}
                              disabled={!canComplete}
                              style={{ 
                                fontSize: '1.1em', 
                                padding: '12px 24px',
                                opacity: canComplete ? 1 : 0.6,
                                cursor: canComplete ? 'pointer' : 'not-allowed'
                              }}
                              title={canComplete ? 'Completar módulo' : 'Completa todas las lecciones anteriores del módulo primero'}
                            >
                              🏆 Completar {getModuleTitle(currentModuleId).split(':')[0]}
                            </button>
                          );
                        } else {
                          // Lección regular - mostrar botón "Completar Lección" si no está completada
                          return !isCurrentLessonCompleted && (
                            <button 
                              className="btn btn-primary"
                              onClick={() => handleMarkLessonComplete(currentLesson.id)}
                            >
                              ✅ Completar Lección
                            </button>
                          );
                        }
                      })()}
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
                        {progress.completedLessons.length} de {lessons.length} completadas
                      </span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(progress.completedLessons.length / lessons.length) * 100}%` }}
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
                    {courseData.modules.map(module => {
                      const moduleId = module.id;
                      const moduleLessons = lessons.filter(lesson => lesson.moduleId === moduleId);
                      const moduleProgress = getModuleProgress(moduleId);
                      const isModuleComplete = isModuleCompleted(moduleId);
                      
                      return (
                        <div key={moduleId} className="module-group">
                          <div 
                            className={`module-header ${isModuleComplete ? 'completed' : ''} ${expandedModules.has(moduleId) ? 'expanded' : ''}`}
                            onClick={() => toggleModuleExpansion(moduleId)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="module-title">
                              <span className="module-icon">
                                {isModuleComplete ? '✅' : '📚'}
                              </span>
                              <span>MÓDULO {moduleId}</span>
                              <span className="expand-icon">
                                {expandedModules.has(moduleId) ? '▼' : '▶'}
                              </span>
                            </div>
                            <div className="module-progress">
                              <span className="progress-text">
                                {moduleProgress.completed}/{moduleProgress.total}
                              </span>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${moduleProgress.total > 0 ? (moduleProgress.completed / moduleProgress.total) * 100 : 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {expandedModules.has(moduleId) && (
                            <div className="module-lessons">
                              {moduleLessons.map((lesson, index) => {
                                const globalIndex = lessons.findIndex(l => l.id === lesson.id);
                                return (
                                  <div 
                                    key={lesson.id} 
                                    className={`lesson-item ${globalIndex === progress.currentLesson ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${!isLessonAccessible(globalIndex) ? 'locked' : ''}`}
                                    onClick={() => {
                                      if (isLessonAccessible(globalIndex)) {
                                        handleManualLessonChange(globalIndex);
                                      }
                                    }}
                                  >
                                    <div className="lesson-number">{globalIndex + 1}</div>
                                    <div className="lesson-content">
                                      <h4>{lesson.title}</h4>
                                      <div className="lesson-meta">
                                        <span className="lesson-type">{lesson.type}</span>
                                        <span className="lesson-duration">{lesson.duration}</span>
                                      </div>
                                    </div>
                                    <div className="lesson-status">
                                      {getLessonStatus(globalIndex, lesson.id)}
                                    </div>
                                  </div>
                                );
                              })}
                              
                              {/* Botón Completar Módulo eliminado del sidebar - solo aparece en la lección */}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                          <span>✅ Lecciones: {lessons.length}/{lessons.length}</span>
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
                            : `Completa todas las lecciones (${progress.completedLessons.length}/${lessons.length}) para poder terminar el curso`
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

      {/* Notificaciones de logros */}
      {showModuleNotification && (
        <AchievementNotification
          achievement={{
            id: 'module-notification',
            type: achievementData.type,
            title: achievementData.title,
            message: achievementData.message,
            stats: achievementData.stats
          }}
          onClose={() => setShowModuleNotification(false)}
        />
      )}

      {showCourseNotification && (
        <AchievementNotification
          achievement={{
            id: 'course-notification',
            type: achievementData.type,
            title: achievementData.title,
            message: achievementData.message,
            stats: achievementData.stats
          }}
          onClose={() => setShowCourseNotification(false)}
        />
      )}

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

        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, #4b5563, #374151);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
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

        .module-group {
          margin-bottom: 1rem;
        }

        .module-header {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 0.5rem;
        }

        .module-header:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .module-header.completed {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }

        .module-header.expanded {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          margin-bottom: 0;
        }

        .module-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .module-icon {
          margin-right: 0.5rem;
        }

        .expand-icon {
          font-size: 0.875rem;
          color: #64748b;
        }

        .module-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .module-progress .progress-text {
          font-size: 0.75rem;
          color: #64748b;
          min-width: 3rem;
        }

        .module-progress .progress-bar {
          flex: 1;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .module-progress .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .module-lessons {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: none;
          border-radius: 0 0 8px 8px;
          padding: 0.5rem;
        }

        .module-lessons .lesson-item {
          margin-bottom: 0.5rem;
          background: #fafafa;
          border-radius: 6px;
        }

        .module-lessons .lesson-item:last-child {
          margin-bottom: 0;
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

        /* Estilos para completar módulo */
        .complete-module-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        /* Estilos para completar módulo en la lección */
        .complete-module-section-lesson {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .btn-complete-module {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-complete-module:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .btn-complete-module:disabled,
        .btn-complete-module.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          background: linear-gradient(135deg, #9ca3af, #6b7280);
        }

        .btn-complete-module:disabled:hover,
        .btn-complete-module.disabled:hover {
          background: linear-gradient(135deg, #9ca3af, #6b7280);
          transform: none;
          box-shadow: none;
        }

        .complete-module-info {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .module-completed-message {
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 8px;
          border: 1px solid #0ea5e9;
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

          /* Corregir elementos de código */
          .lesson-content pre {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
            background: #f8fafc !important;
            border-radius: 8px !important;
            padding: 0.75rem !important;
            margin: 1rem 0 !important;
            border: 1px solid #e2e8f0 !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            font-size: 0.7rem !important;
          }

          /* Scrollbar para bloques de código */
          .lesson-content pre::-webkit-scrollbar {
            height: 6px !important;
          }

          .lesson-content pre::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 3px !important;
          }

          .lesson-content pre::-webkit-scrollbar-thumb {
            background: #cbd5e1 !important;
            border-radius: 3px !important;
          }

          .lesson-content pre::-webkit-scrollbar-thumb:hover {
            background: #94a3b8 !important;
          }

          /* Indicador para bloques de código */
          .lesson-content pre::after {
            content: "← Desliza para ver código completo →" !important;
            display: block !important;
            text-align: center !important;
            font-size: 0.65rem !important;
            color: #64748b !important;
            margin-top: 0.5rem !important;
            font-style: italic !important;
          }

          .lesson-content code {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            font-size: 0.7rem !important;
          }

          /* Corregir listas */
          .lesson-content ul,
          .lesson-content ol {
            max-width: 100% !important;
            padding-left: 1rem !important;
          }

          .lesson-content li {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* Corregir elementos inline */
          .lesson-content span,
          .lesson-content strong,
          .lesson-content em {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* Corregir elementos con estilos inline */
          .lesson-content div[style*="width"] {
            max-width: 100% !important;
            width: auto !important;
          }

          .lesson-content div[style*="min-width"] {
            min-width: auto !important;
          }

          /* Asegurar que todos los elementos se mantengan dentro de los límites */
          .lesson-content * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }

          /* Contenedor principal de la lección */
          .lesson-container {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            padding: 0 0.5rem !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </>
  );
}
