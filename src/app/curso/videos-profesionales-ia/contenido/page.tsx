'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';
import AchievementNotification from '@/components/ui/AchievementNotification';

export default function ContenidoVideosProfesionalesIAPage() {
  
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
  } = useCourseProgress('videos-profesionales-ia', isEnrolled);

  // Renderiza las acciones de lección evitando IIFE y patrones que confunden el parser en build
  function renderLessonAction(): JSX.Element | null {
    const currentLesson = courseData.lessons[progress.currentLesson];
    const currentModuleId = currentLesson.moduleId;
    const isLastLesson = isLastLessonOfModule(currentLesson.id, currentModuleId);
    const isCurrentLessonCompleted = progress.completedLessons.includes(currentLesson.id);
    const isModuleAlreadyCompleted = isModuleCompleted(currentModuleId);

    if (isModuleAlreadyCompleted) {
      return null;
    }

    if (isLastLesson) {
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
    }

    return isCurrentLessonCompleted ? null : (
      <button className="btn btn-primary" onClick={handleCompleteCurrentLesson}>
        ✅ Completar Lección
      </button>
    );
  }

  const courseData = {
    id: 'videos-profesionales-ia',
    title: 'Aprende a crear videos profesionales con IA',
    description: 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.',
    lessons: [
      // MÓDULO 1 - Sublecciones  
      {
        id: 'vpc-mod1-les1',
        moduleId: 1,
        title: '1.1 Introducción a la Creación de Videos con IA',
        duration: '15 min',
        type: 'video',
        description: 'Comprende el potencial de la IA en la producción audiovisual',
        videoUrl: 'https://www.youtube.com/watch?v=example1-1',
        content: `
          <h2>1.1 Introducción a los Asistentes Virtuales con IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Los asistentes virtuales empresariales representan una revolución en la automatización de procesos comerciales. Estas herramientas, basadas en inteligencia artificial, pueden transformar la manera en que tu empresa interactúa con clientes, gestiona tareas internas y optimiza operaciones diarias.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">¿Qué es un Asistente Virtual Empresarial?</h3>
          <p style="color: #475569; line-height: 1.6;">Un asistente virtual empresarial es un sistema de IA personalizado que actúa como extensión digital de tu negocio, capaz de:</p>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Atender consultas de clientes 24/7</li>
              <li style="margin: 0.5rem 0;">✓ Gestionar recordatorios y tareas administrativas</li>
              <li style="margin: 0.5rem 0;">✓ Proporcionar consejería empresarial basada en datos</li>
              <li style="margin: 0.5rem 0;">✓ Mantener la coherencia de marca en todas las interacciones</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod1-les2',
        moduleId: 1,
        title: '1.2 Herramientas de IA para Video',
        duration: '12 min',
        type: 'video',
        description: 'Conoce las principales herramientas de IA para creación de videos',
        videoUrl: 'https://www.youtube.com/watch?v=example1-2',
        content: `
          <h2>1.2 Herramientas de IA para Video</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Descubre las herramientas más populares de IA para crear videos profesionales. Desde generación de contenido hasta edición automatizada.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Herramientas Principales</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Pictory - Generación de videos desde texto</li>
              <li style="margin: 0.5rem 0;">✓ Synthesia - Avatares IA para presentaciones</li>
              <li style="margin: 0.5rem 0;">✓ Disponibilidad constante sin costos de personal adicional</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mejora en Atención al Cliente</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Respuestas consistentes y precisas</li>
              <li style="margin: 0.5rem 0;">✓ Escalamiento inteligente de consultas complejas</li>
              <li style="margin: 0.5rem 0;">✓ Personalización basada en el perfil empresarial</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Optimización de Recursos</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Liberación de tiempo del equipo para tareas estratégicas</li>
              <li style="margin: 0.5rem 0;">✓ Reducción de errores humanos en procesos rutinarios</li>
              <li style="margin: 0.5rem 0;">✓ Escalabilidad sin incremento proporcional de costos</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod1-les3',
        moduleId: 1,
        title: '1.3 Configuración del Entorno de Trabajo',
        duration: '15 min',
        type: 'video',
        description: 'Configura tu espacio de trabajo para la creación de videos con IA',
        videoUrl: 'https://www.youtube.com/watch?v=example1-3',
        content: `
          <h2>1.3 Comparación: Google Gemini vs ChatGPT</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Para elegir la plataforma adecuada para tu asistente virtual, es importante conocer las diferencias entre las dos opciones principales del mercado.</p>
          </div>
          
          <div style="overflow-x: auto; margin: 2rem 0; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
            <div style="min-width: 600px; display: inline-block;">
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin: 1rem 0; background: white; border-radius: 8px; overflow: hidden;">
              <thead style="background: #f8fafc;">
                <tr>
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">Característica</th>
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">Google Gemini</th>
                  <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: 600; color: #1e293b;">ChatGPT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: 600; color: #475569;">Costo</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Requiere Gemini Advanced</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Requiere ChatGPT Plus/Teams</td>
                </tr>
                <tr style="background: #fafbfc;">
                  <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: 600; color: #475569;">Integración</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Ecosistema Google nativo</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Amplia compatibilidad</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: 600; color: #475569;">Personalización</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">GEMs altamente customizables</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">GPTs con gran flexibilidad</td>
                </tr>
                <tr style="background: #fafbfc;">
                  <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: 600; color: #475569;">Conocimiento</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Acceso a información actualizada</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Base de conocimiento sólida</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; font-weight: 600; color: #475569;">Facilidad de uso</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Interfaz intuitiva</td>
                  <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">Configuración detallada</td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        `
      },
      {
        id: 'vpc-mod2-les1',
        moduleId: 2,
        title: '2.1 Creación de Guiones con IA',
        duration: '8 min',
        type: 'video',
        description: 'Aprende a generar guiones profesionales usando herramientas de IA',
        videoUrl: 'https://www.youtube.com/watch?v=example1-4',
        content: `
          <h2>1.4 Planificación Estratégica</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Una planificación adecuada es fundamental para el éxito de tu asistente virtual. Define estos elementos clave antes de comenzar la implementación.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Elementos a Definir</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ol style="margin: 0; color: #475569; line-height: 1.7; padding-left: 1.5rem;">
              <li style="margin: 0.75rem 0;"><strong style="color: #1e293b;">Objetivos Específicos:</strong> ¿Qué problemas resolverá tu asistente?</li>
              <li style="margin: 0.75rem 0;"><strong style="color: #1e293b;">Audiencia Objetivo:</strong> ¿Quiénes interactuarán con él?</li>
              <li style="margin: 0.75rem 0;"><strong style="color: #1e293b;">Procesos a Automatizar:</strong> Lista de tareas recurrentes</li>
              <li style="margin: 0.75rem 0;"><strong style="color: #1e293b;">Métricas de Éxito:</strong> KPIs para medir efectividad</li>
              <li style="margin: 0.75rem 0;"><strong style="color: #1e293b;">Recursos Disponibles:</strong> Documentos, políticas, catálogos</li>
            </ol>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #3b82f6;">💡</span> Consejo Estratégico
            </h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">Una planificación sólida es la base del éxito. Tómate el tiempo necesario para definir cada punto antes de avanzar a la implementación técnica.</p>
          </div>
        `
      },
      
      // MÓDULO 2 - Sublecciones
      {
        id: 'vpc-mod2-les2',
        moduleId: 2,
        title: '2.2 Generación de Texto a Video',
        duration: '20 min',
        type: 'lab',
        description: 'Convierte textos en videos profesionales usando IA',
        videoUrl: 'https://www.youtube.com/watch?v=example2-1',
        content: `
          <h2>2.1 Creación del Perfil Empresarial</h2>
          
          <p>El perfil empresarial es el ADN de tu asistente virtual. Debe contener información precisa y actualizada sobre tu negocio.</p>
          
          <h3>Estructura del Perfil Empresarial Completo:</h3>
          
          <div style="background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e40af; margin: 0 0 1rem 0;">📋 INFORMACIÓN BÁSICA:</h4>
            <ul style="margin: 0; color: #1e40af;">
              <li><strong>Nombre de la empresa:</strong> [Tu empresa]</li>
              <li><strong>Sector/Industria:</strong> [Especificar]</li>
              <li><strong>Ubicación:</strong> [Ciudad, país]</li>
              <li><strong>Años en el mercado:</strong> [Número]</li>
              <li><strong>Misión:</strong> [Declaración concisa]</li>
              <li><strong>Visión:</strong> [Proyección futura]</li>
              <li><strong>Valores corporativos:</strong> [3-5 valores principales]</li>
            </ul>
          </div>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #15803d; margin: 0 0 1rem 0;">🎯 PRODUCTOS/SERVICIOS:</h4>
            <ul style="margin: 0; color: #15803d;">
              <li>Línea principal de productos/servicios</li>
              <li>Características distintivas</li>
              <li>Público objetivo de cada servicio</li>
              <li>Ventajas competitivas</li>
            </ul>
          </div>
          
          <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #a16207; margin: 0 0 1rem 0;">📋 POLÍTICAS EMPRESARIALES:</h4>
            <ul style="margin: 0; color: #a16207;">
              <li>Política de devoluciones</li>
              <li>Garantías ofrecidas</li>
              <li>Términos de servicio</li>
              <li>Política de privacidad</li>
              <li>Procedimientos de atención al cliente</li>
            </ul>
          </div>
          
          <div style="background: #fdf2f8; border: 1px solid #f9a8d4; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #be185d; margin: 0 0 1rem 0;">📞 INFORMACIÓN DE CONTACTO:</h4>
            <ul style="margin: 0; color: #be185d;">
              <li>Teléfonos principales</li>
              <li>Correos electrónicos</li>
              <li>Redes sociales</li>
              <li>Dirección física</li>
              <li>Horarios de atención</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod2-les3',
        moduleId: 2,
        title: '2.3 Edición Avanzada con IA',
        duration: '25 min',
        type: 'lab',
        description: 'Técnicas avanzadas de edición automatizada con IA',
        videoUrl: 'https://www.youtube.com/watch?v=example2-2',
        content: `
          <h2>2.2 Documentación de Soporte</h2>
          
          <h3>Documentos Esenciales a Preparar:</h3>
          
          <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1f2937; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="background: #3b82f6; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">1</span>
              Lista de Precios Actualizada (.pdf)
            </h4>
            <ul style="margin: 0; color: #4b5563;">
              <li>Formato claro y legible</li>
              <li>Precios con y sin impuestos</li>
              <li>Descuentos por volumen</li>
              <li>Vigencia de precios</li>
            </ul>
          </div>
          
          <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1f2937; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="background: #10b981; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">2</span>
              Catálogo de Productos (.pdf)
            </h4>
            <ul style="margin: 0; color: #4b5563;">
              <li>Imágenes de alta calidad</li>
              <li>Descripciones detalladas</li>
              <li>Especificaciones técnicas</li>
              <li>Códigos de producto</li>
            </ul>
          </div>
          
          <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1f2937; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="background: #f59e0b; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">3</span>
              FAQ (Preguntas Frecuentes) (.txt)
            </h4>
            <ul style="margin: 0; color: #4b5563;">
              <li>20-30 preguntas más comunes</li>
              <li>Respuestas concisas y claras</li>
              <li>Actualización trimestral</li>
            </ul>
          </div>
          
          <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1f2937; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="background: #ef4444; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">4</span>
              Políticas Empresariales (.txt/.pdf)
            </h4>
            <ul style="margin: 0; color: #4b5563;">
              <li>Procesos internos relevantes</li>
              <li>Protocolos de atención</li>
              <li>Escalamiento de problemas</li>
            </ul>
          </div>
        `
      },
      {
        id: 'vpc-mod3-les1',
        moduleId: 3,
        title: '3.1 Creación de Avatares IA',
        duration: '15 min',
        type: 'video',
        description: 'Crea avatares realistas con IA para tus videos',
        videoUrl: 'https://www.youtube.com/watch?v=example2-3',
        content: `
          <h2>2.3 Optimización de Contenido para IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Para maximizar la efectividad de tu asistente virtual, es importante optimizar el contenido siguiendo estas mejores prácticas.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mejores Prácticas</h3>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: #1e293b;">
                <span style="font-size: 1.2rem;">💎</span>
                Claridad
              </h4>
              <p style="margin: 0; color: #475569; line-height: 1.5;">
                Usa lenguaje directo y sin ambigüedades
              </p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: #1e293b;">
                <span style="font-size: 1.2rem;">🏗️</span>
                Estructura
              </h4>
              <p style="margin: 0; color: #475569; line-height: 1.5;">
                Organiza información en secciones claras
              </p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: #1e293b;">
                <span style="font-size: 1.2rem;">🔄</span>
                Actualización
              </h4>
              <p style="margin: 0; color: #475569; line-height: 1.5;">
                Mantén documentos actualizados mensualmente
              </p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: #1e293b;">
                <span style="font-size: 1.2rem;">♿</span>
                Accesibilidad
              </h4>
              <p style="margin: 0; color: #475569; line-height: 1.5;">
                Formatos que la IA pueda procesar eficientemente
              </p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: #1e293b;">
                <span style="font-size: 1.2rem;">🎯</span>
                Consistencia
              </h4>
              <p style="margin: 0; color: #475569; line-height: 1.5;">
                Utiliza terminología uniforme en todos los documentos
              </p>
            </div>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #3b82f6;">💡</span> Consejo Pro
            </h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">
              La calidad de tu documentación determinará directamente la efectividad de tu asistente virtual. 
              Invierte tiempo en preparar documentos claros y bien estructurados para obtener mejores resultados.
            </p>
          </div>
        `
      },
      
      // MÓDULO 3 - Sublecciones
      {
        id: 'vpc-mod3-les2',
        moduleId: 3,
        title: '3.2 Exportación y Optimización',
        duration: '15 min',
        type: 'lab',
        description: 'Optimiza y exporta tus videos en múltiples formatos',
        videoUrl: 'https://www.youtube.com/watch?v=example3-1',
        content: `
          <h2>3.1 Configuración Inicial de GEM</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Crear tu primer GEM es el punto de partida para tener un asistente virtual personalizado. Sigue esta guía paso a paso para configurarlo correctamente.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Paso a Paso Detallado</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Acceso a la Plataforma
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Navega a gemini.google.com</li>
              <li style="margin: 0.5rem 0;">✓ Verifica suscripción a Gemini Advanced activa</li>
              <li style="margin: 0.5rem 0;">✓ Localiza "Crear un Gemini" en el menú lateral</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Configuración Básica
            </h4>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1rem; margin: 1rem 0;">
              <p style="margin: 0 0 0.5rem 0; color: #1e293b; font-weight: 600;">Nombre del Gem:</p>
              <p style="margin: 0 0 1rem 0; color: #475569;">[Tu Empresa] - Asistente Virtual</p>
              
              <p style="margin: 0 0 0.5rem 0; color: #1e293b; font-weight: 600;">Descripción:</p>
              <p style="margin: 0; color: #475569; line-height: 1.6;">Asistente virtual especializado en [tu sector], diseñado para gestionar recordatorios, atender consultas de clientes y brindar consejería empresarial personalizada.</p>
            </div>
          </div>
        `
      },
      {
        id: 'vpc-mod4-les1',
        moduleId: 4,
        title: '4.1 Marketing de Videos con IA',
        duration: '20 min',
        type: 'lab',
        description: 'Estrategias para promocionar tus videos creados con IA',
        videoUrl: 'https://www.youtube.com/watch?v=example3-2',
        content: `
          <h2>3.2 Instrucciones Avanzadas para GEM</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Las instrucciones son el cerebro de tu asistente. Define aquí su personalidad, funciones y protocolo de actuación.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Prompt Master para GEM</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #1e293b; font-weight: 600;">Eres el asistente virtual oficial de [NOMBRE DE LA EMPRESA]. Tu nombre es Gem.</p>
            
            <h4 style="color: #1e293b; margin: 1.5rem 0 1rem 0;">PERSONALIDAD Y TONO:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">Profesional pero cercano</li>
              <li style="margin: 0.5rem 0;">Proactivo en las sugerencias</li>
              <li style="margin: 0.5rem 0;">Empático con los clientes</li>
              <li style="margin: 0.5rem 0;">Orientado a soluciones</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0;">FUNCIONES PRINCIPALES:</h4>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>⚙️</span> GESTIÓN DE RECORDATORIOS
              </h5>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">Crear recordatorios con fecha, hora y prioridad</li>
                <li style="margin: 0.25rem 0;">Seguimiento proactivo de compromisos</li>
                <li style="margin: 0.25rem 0;">Alertas anticipadas para fechas críticas</li>
                <li style="margin: 0.25rem 0;">Categorización por urgencia e importancia</li>
              </ul>
            </div>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>💬</span> ATENCIÓN AL CLIENTE INTEGRAL
              </h5>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">Saludo personalizado con nombre de empresa</li>
                <li style="margin: 0.25rem 0;">Identificación precisa de necesidades</li>
                <li style="margin: 0.25rem 0;">Respuestas basadas en documentación oficial</li>
                <li style="margin: 0.25rem 0;">Escalamiento inteligente cuando sea necesario</li>
                <li style="margin: 0.25rem 0;">Seguimiento post-consulta</li>
              </ul>
            </div>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>🧠</span> CONSEJERÍA EMPRESARIAL ESTRATÉGICA
              </h5>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">Análisis contextual de situaciones</li>
                <li style="margin: 0.25rem 0;">Recomendaciones basadas en mejores prácticas</li>
                <li style="margin: 0.25rem 0;">Conexión con recursos formativos relevantes</li>
                <li style="margin: 0.25rem 0;">Planificación de acciones concretas</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0;">PROTOCOLO DE ACTUACIÓN:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Siempre mantente dentro del contexto empresarial</li>
              <li style="margin: 0.5rem 0;">✓ Usa información actualizada de los archivos proporcionados</li>
              <li style="margin: 0.5rem 0;">✓ Si no tienes información suficiente, ofrece buscar más datos</li>
              <li style="margin: 0.5rem 0;">✓ Escala consultas complejas con transparencia</li>
              <li style="margin: 0.5rem 0;">✓ Proporciona siempre próximos pasos claros</li>
            </ul>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #3b82f6;">📝</span> Nota Importante
            </h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">En la sección "INFORMACIÓN EMPRESARIAL", deberás insertar el perfil empresarial completo que creaste en el Módulo 2.</p>
          </div>
        `
      },
      {
        id: 'vpc-mod4-les2',
        moduleId: 4,
        title: '4.2 Distribución Multicanal',
        duration: '10 min',
        type: 'lab',
        description: 'Distribuye tus videos en múltiples plataformas automáticamente',
        videoUrl: 'https://www.youtube.com/watch?v=example3-3',
        content: `
          <h2>3.3 Configuración de Herramientas y Conocimiento</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Las herramientas y documentación adecuadas potenciarán las capacidades de tu asistente virtual.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Herramientas Recomendadas</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span>
                <strong>Google Search:</strong> Para información actualizada
              </li>
              <li style="margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span>
                <strong>Generación de Imágenes:</strong> Para recursos visuales
              </li>
              <li style="margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #ef4444;">❌</span>
                <strong>Intérprete de Código:</strong> Mantener enfoque empresarial
              </li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Carga de Documentos</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ol style="margin: 0; color: #475569; line-height: 1.7; padding-left: 1.5rem;">
              <li style="margin: 0.75rem 0;">Organiza archivos por categorías</li>
              <li style="margin: 0.75rem 0;">Verifica que sean legibles y actualizados</li>
              <li style="margin: 0.75rem 0;">Nombra archivos de manera descriptiva</li>
              <li style="margin: 0.75rem 0;">Prueba la accesibilidad de la información</li>
            </ol>
          </div>
        `
      },
      {
        id: 'vpc-mod4-les3',
        moduleId: 4,
        title: '4.3 Monetización de Videos',
        duration: '10 min',
        type: 'video',
        description: 'Estrategias para monetizar tus videos creados con IA',
        videoUrl: 'https://www.youtube.com/watch?v=example3-4',
        content: `
          <h2>3.4 Ejemplos de Conversación Inicial</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Una vez configurado tu GEM, es importante saber cómo interactuar eficientemente con él. Aquí tienes ejemplos prácticos de conversaciones iniciales.</p>
          </div>

          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Frases de Inicio Recomendadas</h3>
          
          <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin: 1.5rem 0;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 0.5rem 0; color: #1e293b; display: flex; align-items: center; gap: 0.5rem;">
                <span>📅</span> Gestión de Recordatorios
              </h4>
              <p style="margin: 0; color: #475569; font-style: italic;">"¿Qué recordatorios necesito configurar hoy?"</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 0.5rem 0; color: #1e293b; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎧</span> Atención al Cliente
              </h4>
              <p style="margin: 0; color: #475569; font-style: italic;">"Ayúdame a responder una consulta de cliente"</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 0.5rem 0; color: #1e293b; display: flex; align-items: center; gap: 0.5rem;">
                <span>📈</span> Optimización de Procesos
              </h4>
              <p style="margin: 0; color: #475569; font-style: italic;">"Necesito consejo para optimizar mi proceso de ventas"</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 8px;">
              <h4 style="margin: 0 0 0.5rem 0; color: #1e293b; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> Planificación Estratégica
              </h4>
              <p style="margin: 0; color: #475569; font-style: italic;">"¿Qué estrategias me recomiendas para este trimestre?"</p>
            </div>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #3b82f6;">💡</span> Consejo de Uso
            </h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">Comienza con preguntas específicas y permite que tu GEM aprenda tu estilo de trabajo. Mientras más interactúes con él, mejor se adaptará a tus necesidades empresariales.</p>
          </div>
        `
      },
      
      // MÓDULO 4 - Sublecciones
      {
        id: 'cmdsziuwo000ne5aolwpkgsl1',
        moduleId: 4,
        title: '4.1 Configuración de GPT Personalizado',
        duration: '15 min',
        type: 'lab',
        description: 'Aprende paso a paso cómo crear y configurar tu GPT personalizado en ChatGPT',
        videoUrl: 'https://www.youtube.com/watch?v=example4-1',
        content: `
          <h2>4.1 Configuración de GPT Personalizado</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Crear un GPT personalizado te permite tener un asistente virtual específicamente diseñado para las necesidades de tu empresa. Sigue este proceso detallado para configurarlo correctamente.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Proceso Paso a Paso</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Acceso y Creación
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Ingresa a chat.openai.com</li>
              <li style="margin: 0.5rem 0;">✓ Navega a "Explorar" → "Crear un GPT"</li>
              <li style="margin: 0.5rem 0;">✓ Selecciona modo "Crear" para configuración manual</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Información General Optimizada
            </h4>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1rem; margin: 1rem 0;">
              <p style="margin: 0 0 0.5rem 0; color: #1e293b; font-weight: 600;">Nombre:</p>
              <p style="margin: 0 0 1rem 0; color: #475569;">[Tu Empresa] - Asistente Virtual Pro</p>
              
              <p style="margin: 0 0 0.5rem 0; color: #1e293b; font-weight: 600;">Descripción:</p>
              <p style="margin: 0; color: #475569; line-height: 1.6;">Asistente virtual especializado con IA avanzada para gestión empresarial integral, atención al cliente y consejería estratégica en [tu sector].</p>
            </div>
          </div>
        `
      },
      {
        id: 'cmdsziuz2000pe5aoco6iiuje',
        moduleId: 4,
        title: '4.2 Instrucciones Maestras para GPT',
        duration: '25 min',
        type: 'lab',
        description: 'Configura el prompt avanzado que definirá el comportamiento y competencias de tu GPT',
        videoUrl: 'https://www.youtube.com/watch?v=example4-2',
        content: `
          <h2>4.2 Instrucciones Maestras para GPT</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Las instrucciones maestras son el corazón de tu GPT. Define aquí su identidad profesional, competencias y metodologías de trabajo.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Prompt Avanzado para ChatGPT</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #1e293b; font-weight: 600;">Eres el asistente virtual oficial de [NOMBRE DE LA EMPRESA].</p>
            
            <h4 style="color: #1e293b; margin: 1.5rem 0 1rem 0;">IDENTIDAD PROFESIONAL:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;"><strong>Nombre:</strong> Asistente [Nombre de Empresa]</li>
              <li style="margin: 0.5rem 0;"><strong>Especialización:</strong> [Tu sector específico]</li>
              <li style="margin: 0.5rem 0;"><strong>Nivel de experiencia:</strong> Experto empresarial</li>
              <li style="margin: 0.5rem 0;"><strong>Enfoque:</strong> Orientado a resultados y crecimiento</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0;">COMPETENCIAS CORE:</h4>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>📋</span> GESTIÓN AVANZADA DE RECORDATORIOS
              </h5>
              <p style="margin: 0 0 0.5rem 0; color: #475569; font-weight: 600;">Estructura obligatoria:</p>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">🗓️ Fecha y hora específica</li>
                <li style="margin: 0.25rem 0;">📝 Descripción detallada y accionable</li>
                <li style="margin: 0.25rem 0;">🚦 Prioridad (Alta/Media/Baja) con justificación</li>
                <li style="margin: 0.25rem 0;">➡️ Acciones de seguimiento sugeridas</li>
                <li style="margin: 0.25rem 0;">🔄 Frecuencia si es recurrente</li>
              </ul>
            </div>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span> ATENCIÓN AL CLIENTE PREMIUM
              </h5>
              <p style="margin: 0 0 0.5rem 0; color: #475569; font-weight: 600;">Protocolo de 5 pasos:</p>
              <ol style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">Saludo personalizado con nombre de empresa</li>
                <li style="margin: 0.25rem 0;">Escucha activa e identificación de necesidades</li>
                <li style="margin: 0.25rem 0;">Análisis de opciones disponibles</li>
                <li style="margin: 0.25rem 0;">Presentación de soluciones personalizadas</li>
                <li style="margin: 0.25rem 0;">Programación de seguimiento proactivo</li>
              </ol>
            </div>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>💡</span> CONSEJERÍA EMPRESARIAL ESTRATÉGICA
              </h5>
              <p style="margin: 0 0 0.5rem 0; color: #475569; font-weight: 600;">Metodología ACES:</p>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;"><strong>Analizar:</strong> Contexto actual y desafíos</li>
                <li style="margin: 0.25rem 0;"><strong>Considerar:</strong> Recursos y limitaciones</li>
                <li style="margin: 0.25rem 0;"><strong>Estructurar:</strong> Plan de acción con timeline</li>
                <li style="margin: 0.25rem 0;"><strong>Sugerir:</strong> Formación complementaria</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0;">DIRECTRICES DE COMUNICACIÓN:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Mantén siempre el contexto empresarial</li>
              <li style="margin: 0.5rem 0;">✓ Usa datos actualizados de los archivos cargados</li>
              <li style="margin: 0.5rem 0;">✓ Escala consultas complejas de forma transparente</li>
              <li style="margin: 0.5rem 0;">✓ Proporciona valor agregado en cada interacción</li>
              <li style="margin: 0.5rem 0;">✓ Sugiere mejoras proactivamente</li>
            </ul>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #3b82f6;">📝</span> Recordatorio Importante
            </h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">En la sección "CONOCIMIENTO EMPRESARIAL", deberás insertar el perfil empresarial completo que desarrollaste en el Módulo 2.</p>
          </div>
        `
      },
      {
        id: 'cmdsziv1h000re5ao0a2w1mkf',
        moduleId: 4,
        title: '4.3 Configuración Avanzada de Capacidades',
        duration: '10 min',
        type: 'lab',
        description: 'Optimiza las capacidades y configuraciones técnicas de tu GPT personalizado',
        videoUrl: 'https://www.youtube.com/watch?v=example4-3',
        content: `
          <h2>4.3 Configuración Avanzada de Capacidades</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">La configuración adecuada de las capacidades de tu GPT determinará su efectividad y versatilidad para tareas empresariales.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Ajustes Recomendados</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0;">Capacidades Principales:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span>
                <strong>Navegación Web:</strong> Esencial para información actualizada
              </li>
              <li style="margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span>
                <strong>Generación de Imágenes:</strong> Para contenido visual corporativo
              </li>
              <li style="margin: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #ef4444;">❌</span>
                <strong>Intérprete de Código:</strong> Mantener enfoque comercial
              </li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0;">Configuración de Creatividad:</h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Deslizador en posición media para balance precisión-naturalidad</li>
              <li style="margin: 0.5rem 0;">✓ Nivel de detalle alto para respuestas completas</li>
              <li style="margin: 0.5rem 0;">✓ Consistencia en terminología empresarial</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdsziv3v000te5aoo22nck44',
        moduleId: 4,
        title: '4.4 Optimización de Base de Conocimiento',
        duration: '10 min',
        type: 'lab',
        description: 'Aprende las mejores prácticas para cargar y organizar la documentación de tu empresa',
        videoUrl: 'https://www.youtube.com/watch?v=example4-4',
        content: `
          <h2>4.4 Optimización de Base de Conocimiento</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Una base de conocimiento bien estructurada es fundamental para que tu GPT proporcione respuestas precisas y relevantes.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mejores Prácticas para Carga de Archivos</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Organización por Categorías
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">📦 Productos/Servicios</li>
              <li style="margin: 0.5rem 0;">📋 Políticas/Procedimientos</li>
              <li style="margin: 0.5rem 0;">💰 Precios/Promociones</li>
              <li style="margin: 0.5rem 0;">❓ FAQ/Consultas Comunes</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Formato Optimizado
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ PDFs con texto seleccionable</li>
              <li style="margin: 0.5rem 0;">✓ Documentos con estructura clara</li>
              <li style="margin: 0.5rem 0;">✓ Imágenes con texto alternativo descriptivo</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">3.</span> Validación de Contenido
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🔍 Información actualizada y precisa</li>
              <li style="margin: 0.5rem 0;">📊 Consistencia en datos entre documentos</li>
              <li style="margin: 0.5rem 0;">🔒 Eliminación de información confidencial</li>
            </ul>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #3b82f6;">💡</span> Consejo de Optimización
            </h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">Revisa y actualiza tu base de conocimiento mensualmente para mantener la precisión y relevancia de las respuestas de tu GPT.</p>
          </div>
        `
      },
      
      // MÓDULO 5 - Sublecciones
      {
        id: 'cmdsziv69000ve5ao5tog460x',
        moduleId: 5,
        title: '5.1 Protocolo de Pruebas Integrales',
        duration: '15 min',
        type: 'project',
        description: 'Implementa un sistema completo de pruebas para validar el funcionamiento de tu asistente virtual',
        videoUrl: 'https://www.youtube.com/watch?v=example5-1',
        content: `
          <h2>5.1 Protocolo de Pruebas Integrales</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Las pruebas sistemáticas son esenciales para asegurar que tu asistente virtual funcione correctamente y brinde respuestas consistentes y precisas.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Suite de Pruebas Obligatorias</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Pruebas Funcionales
            </h4>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span> Prueba de Conocimiento Base
              </h5>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">"¿Cuáles son nuestros productos principales?"</li>
                <li style="margin: 0.25rem 0;">"Explícame nuestra política de devoluciones"</li>
                <li style="margin: 0.25rem 0;">"¿Cuáles son nuestros precios actuales para [producto]?"</li>
              </ul>
            </div>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span> Prueba de Gestión de Recordatorios
              </h5>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">"Crea un recordatorio para reunión con cliente el próximo martes"</li>
                <li style="margin: 0.25rem 0;">"Configura seguimiento de propuesta comercial en 3 días"</li>
                <li style="margin: 0.25rem 0;">"Programa recordatorio recurrente para revisión mensual"</li>
              </ul>
            </div>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span> Prueba de Atención al Cliente
              </h5>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">Simula consulta sobre garantías</li>
                <li style="margin: 0.25rem 0;">Pregunta sobre disponibilidad de productos</li>
                <li style="margin: 0.25rem 0;">Solicita cotización personalizada</li>
              </ul>
            </div>
            
            <div style="margin: 1rem 0;">
              <h5 style="color: #1e293b; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                <span style="color: #22c55e;">✅</span> Prueba de Consejería Empresarial
              </h5>
              <ul style="margin: 0; color: #475569; line-height: 1.6; padding-left: 1.5rem;">
                <li style="margin: 0.25rem 0;">"Mi competencia bajó precios, ¿qué me recomiendas?"</li>
                <li style="margin: 0.25rem 0;">"¿Cómo puedo mejorar mi servicio al cliente?"</li>
                <li style="margin: 0.25rem 0;">"Necesito estrategia para expandir mi mercado"</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Pruebas de Consistencia
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Misma pregunta en diferentes momentos</li>
              <li style="margin: 0.5rem 0;">✓ Verificación de respuestas coherentes</li>
              <li style="margin: 0.5rem 0;">✓ Mantenimiento del tono empresarial</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">3.</span> Pruebas de Límites
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">✓ Consultas fuera del alcance empresarial</li>
              <li style="margin: 0.5rem 0;">✓ Solicitudes de información no disponible</li>
              <li style="margin: 0.5rem 0;">✓ Manejo de consultas ambiguas</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdsziv8o000xe5aoxqhkk651',
        moduleId: 5,
        title: '5.2 Métricas de Rendimiento y KPIs',
        duration: '10 min',
        type: 'video',
        description: 'Define y monitorea los indicadores clave para medir el éxito de tu asistente virtual',
        videoUrl: 'https://www.youtube.com/watch?v=example5-2',
        content: `
          <h2>5.2 Métricas de Rendimiento y KPIs</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Establecer métricas claras te permitirá medir el impacto real de tu asistente virtual y identificar áreas de mejora.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Indicadores Clave de Éxito</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Efectividad de Respuestas
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">📊 Porcentaje de consultas resueltas completamente</li>
              <li style="margin: 0.5rem 0;">⏱️ Tiempo promedio de respuesta</li>
              <li style="margin: 0.5rem 0;">⭐ Nivel de satisfacción del usuario</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Utilización de Funciones
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🔄 Frecuencia de uso por función (recordatorios, consultas, consejería)</li>
              <li style="margin: 0.5rem 0;">📈 Patrones de consultas más comunes</li>
              <li style="margin: 0.5rem 0;">⚡ Eficiencia en escalamiento</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">3.</span> Impacto Empresarial
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">⏰ Reducción en tiempo de gestión administrativa</li>
              <li style="margin: 0.5rem 0;">📞 Mejora en respuesta a clientes</li>
              <li style="margin: 0.5rem 0;">💰 ROI del asistente virtual</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdszivb2000ze5ao3eccaj4f',
        moduleId: 5,
        title: '5.3 Estrategias de Optimización Continua',
        duration: '10 min',
        type: 'lab',
        description: 'Implementa un plan sistemático de mejora continua para tu asistente virtual',
        videoUrl: 'https://www.youtube.com/watch?v=example5-3',
        content: `
          <h2>5.3 Estrategias de Optimización Continua</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">La optimización continua asegura que tu asistente virtual evolucione y mejore con el tiempo, adaptándose a las necesidades cambiantes de tu empresa.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Plan de Mejora Mensual</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Análisis de Interacciones
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🔍 Revisión de consultas frecuentes</li>
              <li style="margin: 0.5rem 0;">❓ Identificación de gaps de información</li>
              <li style="margin: 0.5rem 0;">⚠️ Detección de patrones de error</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Actualización de Contenido
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">💰 Revisión trimestral de precios</li>
              <li style="margin: 0.5rem 0;">📋 Actualización de políticas</li>
              <li style="margin: 0.5rem 0;">🆕 Incorporación de nuevos productos/servicios</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">3.</span> Refinamiento de Instrucciones
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">⚙️ Ajuste de prompts según feedback</li>
              <li style="margin: 0.5rem 0;">🎯 Mejora en precisión de respuestas</li>
              <li style="margin: 0.5rem 0;">🔄 Optimización de flujos de conversación</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdszivdg0011e5aorowmnx4l',
        moduleId: 5,
        title: '5.4 Mantenimiento y Actualizaciones',
        duration: '8 min',
        type: 'video',
        description: 'Establece un calendario sistemático de mantenimiento para garantizar el óptimo funcionamiento',
        videoUrl: 'https://www.youtube.com/watch?v=example5-4',
        content: `
          <h2>5.4 Mantenimiento y Actualizaciones</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Un programa de mantenimiento regular es esencial para mantener tu asistente virtual funcionando al máximo rendimiento.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Calendario de Mantenimiento</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>📅</span> Semanal
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🔍 Revisión de consultas no resueltas</li>
              <li style="margin: 0.5rem 0;">⚙️ Verificación de funcionamiento de herramientas</li>
              <li style="margin: 0.5rem 0;">📊 Actualización de información temporal</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>📊</span> Mensual
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">📈 Análisis de métricas de rendimiento</li>
              <li style="margin: 0.5rem 0;">📄 Actualización de documentos base</li>
              <li style="margin: 0.5rem 0;">🔧 Ajuste de instrucciones según patrones identificados</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>📋</span> Trimestral
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🎯 Revisión completa de objetivos y KPIs</li>
              <li style="margin: 0.5rem 0;">📚 Actualización mayor de base de conocimiento</li>
              <li style="margin: 0.5rem 0;">🚀 Evaluación de necesidades de expansión funcional</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdszivfv0013e5aowzs8cmd9',
        moduleId: 5,
        title: '5.5 Resolución de Problemas Comunes',
        duration: '7 min',
        type: 'lab',
        description: 'Guía práctica para identificar y resolver los problemas más frecuentes',
        videoUrl: 'https://www.youtube.com/watch?v=example5-5',
        content: `
          <h2>5.5 Resolución de Problemas Comunes</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Conocer los problemas más comunes y sus soluciones te permitirá mantener tu asistente virtual funcionando eficientemente.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Troubleshooting Guide</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Respuestas Inconsistentes
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🔍 Revisar claridad en instrucciones</li>
              <li style="margin: 0.5rem 0;">📄 Verificar conflictos en documentos base</li>
              <li style="margin: 0.5rem 0;">✂️ Simplificar prompts complejos</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Información Desactualizada
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🚨 Implementar sistema de alertas de actualización</li>
              <li style="margin: 0.5rem 0;">📅 Crear proceso de revisión regular</li>
              <li style="margin: 0.5rem 0;">👥 Establecer responsabilidades de mantenimiento</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">3.</span> Escalamiento Inadecuado
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">📋 Definir criterios claros de escalamiento</li>
              <li style="margin: 0.5rem 0;">🎓 Entrenar en reconocimiento de límites</li>
              <li style="margin: 0.5rem 0;">🔄 Establecer protocolos de derivación</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdszivi90015e5aog2xc0rl2',
        moduleId: 5,
        title: '5.6 Escalabilidad y Crecimiento',
        duration: '10 min',
        type: 'project',
        description: 'Planifica el crecimiento y expansión de tu asistente virtual para el futuro',
        videoUrl: 'https://www.youtube.com/watch?v=example5-6',
        content: `
          <h2>5.6 Escalabilidad y Crecimiento</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Preparar tu asistente virtual para el crecimiento futuro te permitirá escalarlo según evolucionen las necesidades de tu empresa.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Preparación para Expansión</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">1.</span> Integración con Sistemas Existentes
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🏢 CRM empresarial</li>
              <li style="margin: 0.5rem 0;">📦 Sistemas de gestión de inventario</li>
              <li style="margin: 0.5rem 0;">💬 Plataformas de comunicación</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">2.</span> Funcionalidades Avanzadas
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🔮 Análisis predictivo de consultas</li>
              <li style="margin: 0.5rem 0;">👤 Personalización por tipo de cliente</li>
              <li style="margin: 0.5rem 0;">🤖 Automatización de procesos complejos</li>
            </ul>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <h4 style="color: #1e293b; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #6b7280; font-weight: 600;">3.</span> Expansión Multicanal
            </h4>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">🌐 Integración en sitio web</li>
              <li style="margin: 0.5rem 0;">📱 Implementación en redes sociales</li>
              <li style="margin: 0.5rem 0;">📲 Desarrollo de aplicación móvil</li>
            </ul>
          </div>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 2rem 0; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: #3b82f6;">🚀</span> Visión de Futuro
            </h4>
            <p style="margin: 0; color: #475569; line-height: 1.6;">El éxito de tu asistente virtual no se mide solo por su funcionamiento actual, sino por su capacidad de adaptarse y crecer junto con tu empresa. Planifica siempre pensando en el futuro.</p>
          </div>
        `
      }
    ]
  };

  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/videos-profesionales-ia/contenido');
    }
  }, [user]);

  // Expandir automáticamente el módulo actual
  useEffect(() => {
    if (progress.currentLesson !== undefined && courseData.lessons[progress.currentLesson]) {
      const currentModuleId = courseData.lessons[progress.currentLesson].moduleId;
      setExpandedModules(prev => new Set(prev).add(currentModuleId));
    }
  }, [progress.currentLesson]);

  // Función para alternar expansión de módulos
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

  // Guardar progreso automáticamente al salir de la página
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      // Guardar progreso antes de salir
      const currentLesson = courseData.lessons[progress.currentLesson];
      if (currentLesson && isEnrolled) {
        // Usar sendBeacon para envío garantizado
        const token = localStorage.getItem('authToken');
        const progressData = {
          courseId: 'videos-profesionales-ia',
          currentLesson: progress.currentLesson,
          completedLessons: progress.completedLessons,
          lessonNumber: currentLesson.id,
          lessonTitle: currentLesson.title,
          action: 'access',
          timeSpent: 1
        };

        // Usar fetch con keepalive para garantizar el envío
        try {
          fetch('/api/courses/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(progressData),
            keepalive: true // Esto garantiza que se complete incluso si la página se cierra
          });
        } catch (error) {
          console.error('Error guardando progreso al salir:', error);
        }
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && isEnrolled) {
        // Guardar progreso cuando la pestaña se oculta
        const currentLesson = courseData.lessons[progress.currentLesson];
        if (currentLesson) {
          await saveProgress(
            progress.currentLesson,
            progress.completedLessons,
            currentLesson.id,
            currentLesson.title,
            'access',
            1
          );
        }
      }
    };

    // Agregar listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Limpiar listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [progress.currentLesson, progress.completedLessons, isEnrolled, saveProgress]);

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
            router.push('/curso/videos-profesionales-ia');
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
          router.push('/login?redirect=/curso/videos-profesionales-ia/contenido');
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
            router.push('/curso/videos-profesionales-ia');
          }
        } catch (enrollError) {
          console.error('❌ [DEBUG] Error crítico en inscripción:', enrollError);
          router.push('/curso/videos-profesionales-ia');
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
          router.push('/curso/videos-profesionales-ia');
        }
      } catch (enrollError) {
        console.error('❌ [DEBUG] Error crítico:', enrollError);
        router.push('/curso/videos-profesionales-ia');
      }
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  
  // Función debounced para guardar progreso
  const debouncedSaveProgress = (
    currentLesson: number,
    completedLessons: number[],
    lessonId: string,
    lessonTitle: string,
    action: 'access' | 'complete',
    timeSpent: number
  ) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(currentLesson, completedLessons, lessonId, lessonTitle, action, timeSpent);
    }, 300); // Esperar 300ms antes de guardar
  };

  const handleManualLessonChange = (newLessonIndex: number) => {
    // Evitar cambiar a la misma lección
    if (newLessonIndex === progress.currentLesson) return;
    
    const newLesson = courseData.lessons[newLessonIndex];
    
    // Cambiar a la nueva lección inmediatamente
    setCurrentLesson(newLessonIndex);
    
    // Luego guardar progreso con la nueva lección
    debouncedSaveProgress(
      newLessonIndex,
      progress.completedLessons,
      newLesson?.id,
      newLesson?.title,
      'access',
      1
    );
  };

  const handleReturnToCourse = async () => {
    setIsSaving(true);
    try {
      const currentLesson = courseData.lessons[progress.currentLesson];
      console.log('💾 Guardando progreso antes de salir...', {
        currentLesson: progress.currentLesson,
        completedLessons: progress.completedLessons.length,
        lessonId: currentLesson?.id
      });
      
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      
      console.log('✅ Progreso guardado exitosamente');
      
      // Esperar un poco más para asegurar que la operación se complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push('/curso/videos-profesionales-ia');
    } catch (error) {
      console.error('❌ Error guardando progreso:', error);
      setIsSaving(false);
      // Aún así permitir la navegación
      router.push('/curso/videos-profesionales-ia');
    }
  };

  const handlePreviousLesson = () => {
    if (progress.currentLesson > 0) {
      const newLessonIndex = progress.currentLesson - 1;
      const newLesson = courseData.lessons[newLessonIndex];
      
      // Cambiar la lección primero
      setCurrentLesson(newLessonIndex);
      
      // Luego guardar progreso con la nueva lección
      debouncedSaveProgress(
        newLessonIndex,
        progress.completedLessons,
        newLesson?.id,
        newLesson?.title,
        'access',
        1
      );
    }
  };

  const handleNextLesson = () => {
    if (progress.currentLesson < courseData.lessons.length - 1) {
      const newLessonIndex = progress.currentLesson + 1;
      const newLesson = courseData.lessons[newLessonIndex];
      
      // Cambiar la lección primero
      setCurrentLesson(newLessonIndex);
      
      // Luego guardar progreso con la nueva lección
      debouncedSaveProgress(
        newLessonIndex,
        progress.completedLessons,
        newLesson?.id,
        newLesson?.title,
        'access',
        1
      );
    }
  };

  const handleMarkLessonComplete = async (lessonId: string) => {
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
  };

  // Nueva función para completar una lección individual
  const handleCompleteCurrentLesson = async () => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    await handleMarkLessonComplete(currentLesson.id);
  };

  // Función para verificar si se puede mostrar el botón de completar módulo
  const canCompleteModule = (moduleId: number) => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const isLastInModule = moduleLessons[moduleLessons.length - 1].id === currentLesson.id;
    const moduleProgress = getModuleProgress(moduleId);
    
    // Verificar si todas las lecciones del módulo menos la actual están completadas
    const allOtherLessonsCompleted = moduleProgress.completed === moduleProgress.total - 1;
    
    return isLastInModule && allOtherLessonsCompleted && !progress.completedLessons.includes(currentLesson.id);
  };

  // Función para verificar si un módulo completo está terminado
  const isModuleCompleted = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    return moduleLessons.every(lesson => progress.completedLessons.includes(lesson.id));
  };

  // Función para verificar si se pueden completar todas las lecciones anteriores del módulo
  const canCompleteModuleWithPrerequisites = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const currentLesson = courseData.lessons[progress.currentLesson];
    
    // Obtener todas las lecciones del módulo excepto la actual (que es la última)
    const previousLessons = moduleLessons.filter(lesson => lesson.id !== currentLesson.id);
    
    // Verificar que todas las lecciones anteriores estén completadas
    const allPreviousCompleted = previousLessons.every(lesson => progress.completedLessons.includes(lesson.id));
    
    return allPreviousCompleted;
  };

  // Función para obtener el progreso de un módulo
  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const completedInModule = moduleLessons.filter(lesson => progress.completedLessons.includes(lesson.id));
    return {
      completed: completedInModule.length,
      total: moduleLessons.length,
      percentage: (completedInModule.length / moduleLessons.length) * 100
    };
  };

  // Últimas lecciones de cada módulo
  const LAST_LESSONS_BY_MODULE: Record<number, string> = {
    1: 'vpc-mod1-les3', // 1.3 Configuración del Entorno de Trabajo
    2: 'vpc-mod2-les3', // 2.3 Edición Avanzada con IA
    3: 'vpc-mod3-les2', // 3.2 Exportación y Optimización
    4: 'vpc-mod4-les3'  // 4.3 Monetización de Videos
  };

  // Función para verificar si es la última lección del módulo
  const isLastLessonOfModule = (lessonId: string, moduleId: number): boolean => {
    return LAST_LESSONS_BY_MODULE[moduleId] === lessonId;
  };

  // Función para completar un módulo completo
  const handleCompleteModule = async (moduleId: number) => {
    if (!isEnrolled) return;

    // Si el curso ya está completado, no permitir completar módulos
    if (isCourseCompleted()) {
      setAchievementData({
        type: 'module',
        title: 'Curso Ya Completado',
        message: 'Este curso ya está completado. Estás en modo de revisión.',
        stats: {
          completed: courseData.lessons.length,
          total: courseData.lessons.length,
          percentage: 100
        }
      });
      setShowModuleNotification(true);
      return;
    }

    // Verificar que se puedan completar todas las lecciones anteriores del módulo
    if (!canCompleteModuleWithPrerequisites(moduleId)) {
      const moduleProgress = getModuleProgress(moduleId);
      setAchievementData({
        type: 'module',
        title: 'Completa las Lecciones Anteriores',
        message: 'Debes completar todas las lecciones anteriores del módulo antes de poder completarlo.',
        stats: {
          completed: moduleProgress.completed,
          total: moduleProgress.total,
          percentage: Math.round((moduleProgress.completed / moduleProgress.total) * 100)
        }
      });
      setShowModuleNotification(true);
      return;
    }
    
    // Obtener todas las lecciones del módulo
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    
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
    const currentLesson = courseData.lessons[currentLessonIndex];

    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id,
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
      const nextModuleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId + 1);
      if (nextModuleLessons.length > 0) {
        const nextLessonIndex = courseData.lessons.findIndex(lesson => lesson.id === nextModuleLessons[0].id);
        if (nextLessonIndex !== -1) {
          setCurrentLesson(nextLessonIndex);
        }
      }
    }
  };

  // Función auxiliar para obtener el título del módulo
  const getModuleTitle = (moduleId: number): string => {
    switch (moduleId) {
      case 1: return 'Módulo 1: Introducción y Herramientas Básicas';
      case 2: return 'Módulo 2: Creación de Contenido con IA';
      case 3: return 'Módulo 3: Producción y Post-Producción';
      case 4: return 'Módulo 4: Distribución y Monetización';
      default: return `Módulo ${moduleId}`;
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
          courseSlug: 'videos-profesionales-ia'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Redirigir a la página de inicio del curso
        router.push('/curso/videos-profesionales-ia');
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

  if (!user || isLoading || isCheckingEnrollment) {
    return <div className="loading-container" suppressHydrationWarning>Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/videos-profesionales-ia')}>
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
                  <a href="/curso/videos-profesionales-ia" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎬</span>
                    <span className="breadcrumb-text">Videos profesionales con IA</span>
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
                      
                      {/* Botón siguiente - navegación libre */}
                      {progress.currentLesson < courseData.lessons.length - 1 && (
                        <button 
                          className="btn btn-primary"
                          onClick={handleNextLesson}
                        >
                          Siguiente lección →
                        </button>
                      )}
                      
                      {/* Lógica de botones basada en si es la última lección del módulo */}
                      {renderLessonAction()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-sidebar">
                <div className="progress-section">
                  <div className="progress-header">
                    <h3>Progreso del Curso</h3>
                    <span className="progress-percentage">{Math.round((progress.completedLessons.length / courseData.lessons.length) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(progress.completedLessons.length / courseData.lessons.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <div className="stat">
                      <span className="stat-number">{progress.completedLessons.length}</span>
                      <span className="stat-label">Completadas</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{courseData.lessons.length}</span>
                      <span className="stat-label">Total</span>
                    </div>
                  </div>
                </div>
                  {isEnrolled && (
                    <div className="course-guidance">
                      <p className="guidance-text">
                        💡 <strong>Navegación Libre:</strong> Puedes navegar entre todas las lecciones. Para completar el curso, debes marcar como completadas todas las lecciones de todos los módulos.
                      </p>
                    </div>
                  )}
                  <div className="lessons-list">
                    {[1, 2, 3, 4, 5].map(moduleId => {
                      const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
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
                              <div className="progress-bar-mini">
                                <div 
                                  className="progress-fill-mini" 
                                  style={{ width: `${moduleProgress.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {expandedModules.has(moduleId) && (
                            <div className="module-lessons">
                              {moduleLessons.map((lesson, index) => {
                              const globalIndex = courseData.lessons.findIndex(l => l.id === lesson.id);
                              return (
                                <div 
                                  key={lesson.id} 
                                  className={`lesson-item ${globalIndex === progress.currentLesson ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}
                                  onClick={() => {
                                    if (isLessonAccessible(globalIndex)) {
                                      handleManualLessonChange(globalIndex);
                                    }
                                  }}
                                >
                                  <div className="lesson-number">{moduleId}.{index + 1}</div>
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
                            : (
                                <>
                                  Completa todas las lecciones
                                  {' '}<strong>{progress.completedLessons.length}</strong>
                                  /
                                  <strong>{courseData.lessons.length}</strong>
                                  {' '}para poder terminar el curso
                                </>
                              )}
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
          isVisible={showModuleNotification}
          type={achievementData.type}
          title={achievementData.title}
          message={achievementData.message}
          stats={achievementData.stats}
          onClose={() => setShowModuleNotification(false)}
        />
      )}

      {showCourseNotification && (
        <AchievementNotification
          isVisible={showCourseNotification}
          type={achievementData.type}
          title={achievementData.title}
          message={achievementData.message}
          stats={achievementData.stats}
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
          gap: 1rem;
        }

        .module-group {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #e5e7eb;
        }

        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          margin-bottom: 0.75rem;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .module-header:hover {
          background: #f9fafb;
          border-color: #3b82f6;
        }

        .module-header.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .module-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .module-icon {
          font-size: 1rem;
        }

        .expand-icon {
          font-size: 0.8rem;
          color: #6b7280;
          transition: transform 0.2s ease;
          margin-left: auto;
        }

        .module-header.expanded .expand-icon {
          transform: rotate(0deg);
        }

        .module-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.5rem;
          animation: slideDown 0.3s ease-out;
          overflow: hidden;
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

        @media (min-width: 769px) and (max-width: 1199px) {
          .content-layout {
            grid-template-columns: 1fr 280px;
            gap: 1.5rem;
          }
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

          /* Corregir el tamaño del lesson-number en móviles */
          .lesson-number {
            width: 24px !important;
            height: 24px !important;
            font-size: 0.75rem !important;
          }

          .lesson-item.active .lesson-number {
            width: 24px !important;
            height: 24px !important;
          }

          .lesson-item.completed .lesson-number {
            width: 24px !important;
            height: 24px !important;
          }

          /* Asegurar que el contenido se mantenga centrado en móviles */
          .module-lessons {
            padding: 0.5rem !important;
            margin: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .lesson-item {
            width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 !important;
          }

          .lessons-list {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }

          .module-group {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }

          /* Corregir tablas en móviles */
          .lesson-content table {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 0.75rem !important;
            border-collapse: collapse !important;
          }

          .lesson-content table th,
          .lesson-content table td {
            padding: 0.5rem !important;
            font-size: 0.7rem !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          .lesson-content table th {
            font-size: 0.7rem !important;
            font-weight: 600 !important;
          }

          /* Contenedor de tabla con scroll horizontal */
          .lesson-content div[style*="overflow-x: auto"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
            border-radius: 8px !important;
            background: #f8fafc !important;
            padding: 0.5rem !important;
            margin: 1rem 0 !important;
          }

          /* Estilos para el scrollbar en webkit */
          .lesson-content div[style*="overflow-x: auto"]::-webkit-scrollbar {
            height: 6px !important;
          }

          .lesson-content div[style*="overflow-x: auto"]::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 3px !important;
          }

          .lesson-content div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
            background: #cbd5e1 !important;
            border-radius: 3px !important;
          }

          .lesson-content div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb:hover {
            background: #94a3b8 !important;
          }

          /* Indicador visual de scroll */
          .lesson-content div[style*="overflow-x: auto"]::after {
            content: "← Desliza para ver más →" !important;
            display: block !important;
            text-align: center !important;
            font-size: 0.7rem !important;
            color: #64748b !important;
            margin-top: 0.5rem !important;
            font-style: italic !important;
          }

          /* SOLUCIÓN UNIVERSAL PARA ELEMENTOS QUE NO CABEN EN MÓVILES */

          /* 1. Bloques de código con scroll horizontal */
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

          /* 2. Código inline con scroll */
          .lesson-content code {
            max-width: 100% !important;
            overflow-x: auto !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            font-size: 0.7rem !important;
            background: #f1f5f9 !important;
            padding: 0.2rem 0.4rem !important;
            border-radius: 4px !important;
            display: inline-block !important;
          }

          /* 3. Elementos con ancho fijo que pueden desbordar */
          .lesson-content div[style*="width"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
          }

          .lesson-content div[style*="min-width"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
          }

          /* 4. Contenedores de listas largas */
          .lesson-content ul,
          .lesson-content ol {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
            padding-left: 1rem !important;
          }

          /* 5. Elementos con texto largo sin espacios */
          .lesson-content p,
          .lesson-content div,
          .lesson-content span,
          .lesson-content strong,
          .lesson-content em {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }

          /* 6. Contenedores de imágenes o elementos multimedia */
          .lesson-content img,
          .lesson-content video,
          .lesson-content iframe {
            max-width: 100% !important;
            height: auto !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }

          /* 7. Elementos con URLs largas o nombres de archivo extensos */
          .lesson-content a {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            display: inline-block !important;
          }

          /* 8. Contenedores de formularios o inputs */
          .lesson-content input,
          .lesson-content textarea,
          .lesson-content select {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }

          /* 9. Elementos con contenido JSON o XML */
          .lesson-content div[style*="font-family: monospace"],
          .lesson-content div[style*="font-family: 'Courier New'"] {
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
          }

          /* 10. Contenedores de datos estructurados */
          .lesson-content div[style*="display: grid"],
          .lesson-content div[style*="display: flex"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
          }

          /* 11. Elementos que se renderizan dinámicamente con contenido ancho */
          .lesson-content div[style*="grid-template-columns"],
          .lesson-content div[style*="minmax"],
          .lesson-content div[style*="repeat"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
            background: #f8fafc !important;
            border-radius: 8px !important;
            padding: 0.5rem !important;
            margin: 1rem 0 !important;
          }

          /* 12. Contenedores con contenido que puede desbordar */
          .lesson-content div[style*="border"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
          }

          /* 13. Elementos con gap que pueden causar desbordamiento */
          .lesson-content div[style*="gap"] {
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
            scrollbar-color: #cbd5e1 #f1f5f9 !important;
          }

          /* Scrollbar universal para todos los elementos con overflow-x */
          .lesson-content *[style*="overflow-x: auto"]::-webkit-scrollbar {
            height: 6px !important;
          }

          .lesson-content *[style*="overflow-x: auto"]::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 3px !important;
          }

          .lesson-content *[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
            background: #cbd5e1 !important;
            border-radius: 3px !important;
          }

          .lesson-content *[style*="overflow-x: auto"]::-webkit-scrollbar-thumb:hover {
            background: #94a3b8 !important;
          }

          /* Indicador universal para elementos con scroll */
          .lesson-content *[style*="overflow-x: auto"]:not(pre):not(div[style*="overflow-x: auto"]):after {
            content: "← Desliza para ver más contenido →" !important;
            display: block !important;
            text-align: center !important;
            font-size: 0.65rem !important;
            color: #64748b !important;
            margin-top: 0.5rem !important;
            font-style: italic !important;
          }

          /* Asegurar que el contenido de las lecciones no se desborde */
          .lesson-content {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          .lesson-content h2,
          .lesson-content h3,
          .lesson-content h4,
          .lesson-content p,
          .lesson-content div {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* Corregir elementos de código */
          .lesson-content pre {
            max-width: 100% !important;
            overflow-x: auto !important;
            font-size: 0.7rem !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
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

          /* Estilos para el contenedor del video */
          .lesson-video {
            width: 100% !important;
            max-width: 100% !important;
            margin: 2rem 0 !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
            background: #000 !important;
          }

          /* Responsive para diferentes tamaños de pantalla */
          @media (min-width: 1200px) {
            .lesson-video {
              max-width: 900px !important;
              margin: 2rem auto !important;
            }
          }

          @media (min-width: 768px) and (max-width: 1199px) {
            .lesson-video {
              max-width: 100% !important;
              margin: 1.5rem 0 !important;
              max-height: 60vh !important;
            }
          }

          @media (max-width: 767px) {
            .lesson-video {
              margin: 1rem 0 !important;
              border-radius: 8px !important;
              max-height: 50vh !important;
            }
          }

          @media (max-width: 480px) {
            .lesson-video {
              margin: 0.5rem 0 !important;
              max-height: 40vh !important;
            }
          }

          @media (max-width: 375px) {
            .lesson-video {
              max-height: 35vh !important;
            }
          }
        }

        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 1000px;
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}