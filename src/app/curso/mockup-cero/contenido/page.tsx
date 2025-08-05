'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import VideoPlayer from '@/components/courses/VideoPlayer';

export default function ContenidoMockupCeroPage() {
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
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
  } = useCourseProgress('mockup-cero', isEnrolled);

  const courseData = {
    id: 'mockup-cero',
    title: 'Mockups con IA desde Cero',
    description: 'Aprende a crear mockups profesionales utilizando inteligencia artificial desde los conceptos básicos hasta técnicas avanzadas.',
    lessons: [
      // MÓDULO 1 - Introducción a los Mockups con IA
      {
        id: 'cmdyqqkg80001e5sklyq6zhc3',
        moduleId: 1,
        title: '1.1 ¿Qué es un mockup?',
        duration: '10 min',
        type: 'video',
        description: 'Introducción a los mockups y los beneficios de usar inteligencia artificial en el diseño',
        videoUrl: 'https://www.youtube.com/watch?v=example1-1',
        content: `
          <h2>1.1 ¿Qué es un mockup?</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Un mockup es una representación visual estática y detallada de un diseño o producto antes de su implementación real. Sirve como una maqueta o presentación visual que simula cómo se verá algo en el mundo real (una app, un sitio web, un envase, etc.).</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>Ejemplo:</strong> Un diseño de app móvil enmarcado dentro de un iPhone.</p>
            <p style="margin: 0; color: #475569; line-height: 1.6;">No es interactivo, pero muestra colores, tipografía, elementos y disposición.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">¿Por qué son importantes?</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Permiten visualizar ideas antes de desarrollarlas.</li>
              <li style="margin: 0.5rem 0;">• Ahorran tiempo y dinero al prevenir errores de diseño antes de entrar a producción.</li>
              <li style="margin: 0.5rem 0;">• Facilitan la comunicación con clientes o equipos que no son técnicos.</li>
              <li style="margin: 0.5rem 0;">• Sirven como herramienta de presentación profesional en portafolios, redes sociales o ventas.</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Casos de uso en negocios y marketing</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;"><strong>Empresas de software:</strong> para mostrar apps o webs antes de programarlas.</li>
              <li style="margin: 0.5rem 0;"><strong>Agencias de branding:</strong> para presentar cómo se verá un logo en productos reales.</li>
              <li style="margin: 0.5rem 0;"><strong>Tiendas online:</strong> para mostrar productos personalizados (camisetas, tazas, etc.).</li>
              <li style="margin: 0.5rem 0;"><strong>Presentaciones de ventas o inversores:</strong> para generar impacto visual rápido.</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdyqqkkj0003e5skpj6xocji',
        moduleId: 1,
        title: '1.2 Tipologías',
        duration: '12 min',
        type: 'video',
        description: 'Explora los diferentes tipos de mockups y cuándo usar cada uno',
        videoUrl: 'https://www.youtube.com/watch?v=example1-2',
        content: `
          <h2>1.2 Tipologías</h2>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mockups web</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Simulan el diseño de una página web (landing page, blog, tienda online).</li>
              <li style="margin: 0.5rem 0;">• Usan resoluciones típicas de escritorio.</li>
              <li style="margin: 0.5rem 0;">• Se enfocan en la estructura visual: header, hero, secciones, CTA, footer.</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mockups móviles</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Diseños adaptados para pantallas de celular o tablet.</li>
              <li style="margin: 0.5rem 0;">• Suelen integrarse en marcos de dispositivos (iPhone, Android).</li>
              <li style="margin: 0.5rem 0;">• Se aplican mucho para apps, redes sociales, notificaciones y navegación móvil.</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mockups de producto y branding</h3>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Aplican diseños sobre objetos físicos como tazas, bolsas, camisetas, empaques, etiquetas.</li>
              <li style="margin: 0.5rem 0;">• Muy usados en branding, merchandising o ecommerce.</li>
              <li style="margin: 0.5rem 0;">• Ayudan a visualizar cómo se verá una marca en el mundo real.</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdyqqkmq0005e5skd7awa7hf',
        moduleId: 1,
        title: '1.3 Diferencias entre wireframes, prototipos y mockups',
        duration: '15 min',
        type: 'video',
        description: 'Comprende las diferencias entre wireframes, mockups y prototipos',
        videoUrl: 'https://www.youtube.com/watch?v=example1-3',
        content: `
          <h2>1.3 Diferencias entre wireframes, prototipos y mockups</h2>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <table style="width: 100%; border-collapse: collapse; margin: 0;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">Tipo</th>
                  <th style="padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">Nivel de detalle</th>
                  <th style="padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">Función principal</th>
                  <th style="padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">Interactividad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 500;">Wireframe</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569;">Bajo</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569;">Estructura general (boceto)</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569;">No</td>
                </tr>
                <tr style="background: #f8fafc;">
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569; font-weight: 500;">Mockup</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569;">Alto</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569;">Apariencia visual real</td>
                  <td style="padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #475569;">No</td>
                </tr>
                <tr>
                  <td style="padding: 1rem; color: #475569; font-weight: 500;">Prototipo</td>
                  <td style="padding: 1rem; color: #475569;">Muy alto</td>
                  <td style="padding: 1rem; color: #475569;">Simulación con interacciones</td>
                  <td style="padding: 1rem; color: #475569;">Sí</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;"><strong>Wireframe:</strong> solo líneas y cajas. Ideal para planear.</li>
              <li style="margin: 0.5rem 0;"><strong>Mockup:</strong> diseño casi final, ideal para presentación.</li>
              <li style="margin: 0.5rem 0;"><strong>Prototipo:</strong> experiencia interactiva, útil para pruebas de usuario.</li>
            </ul>
          </div>
        `
      },
      {
        id: 'cmdyqqkox0007e5skmk20laur',
        moduleId: 1,
        title: '1.4 Actividad Práctica 1: Análisis Rápido de Mockups Exitosos',
        duration: '8 min',
        type: 'video',
        description: 'Aprende a identificar qué hace visualmente atractivo y funcional a un mockup',
        videoUrl: 'https://www.youtube.com/watch?v=example1-4',
        content: `
          <h2>1.4 Actividad Práctica 1: Análisis Rápido de Mockups Exitosos</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;"><strong>Objetivo:</strong> Aprender a identificar qué hace visualmente atractivo y funcional a un mockup.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Instrucciones:</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>1.</strong> Elige 1 mockup (puede ser web, móvil o de producto). Puedes buscar en Behance, Dribbble, o usar uno que te comparta el instructor.</p>
            
            <p style="margin: 1rem 0; color: #475569; line-height: 1.6;"><strong>2.</strong> Responde 3 preguntas básicas:</p>
            
            <ul style="margin: 0 0 1rem 2rem; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">¿Qué te gusta del diseño?</li>
              <li style="margin: 0.5rem 0;">¿Qué elemento resalta más?</li>
              <li style="margin: 0.5rem 0;">¿Crees que representa bien el producto o marca? ¿Por qué?</li>
            </ul>
            
            <p style="margin: 1rem 0 0 0; color: #475569; line-height: 1.6;"><strong>3.</strong> Comparte tu opinión en grupo o por escrito (máx. 5 líneas).</p>
          </div>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>💡</span> Consejo
            </h4>
            <p style="margin: 0; color: #065f46; line-height: 1.6;">Esta actividad te ayudará a desarrollar tu ojo crítico para el diseño, una habilidad fundamental antes de crear tus propios mockups con IA.</p>
          </div>
        `
      },

      // MÓDULO 2 - Principales herramientas de IA
      {
        id: 'cmdyqqkr40009e5skmm3hwpfb',
        moduleId: 2,
        title: '2.1 Familiarizarte con las principales herramientas de IA',
        duration: '25 min',
        type: 'lab',
        description: 'Explora y configura las principales herramientas de IA para crear mockups profesionales',
        videoUrl: 'https://www.youtube.com/watch?v=example2-1',
        content: `
          <h2>2.1 Familiarizarte con las principales herramientas de IA</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Para crear mockups sin necesidad de saber diseñar, explora y configura estas herramientas:</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Principales Herramientas</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;"><strong>Figma AI:</strong> para diseños avanzados con IA generativa (opcional si tienes más experiencia).</li>
              <li style="margin: 0.5rem 0;"><strong>Uizard.io:</strong> convierte ideas escritas o dibujos en interfaces básicas.</li>
              <li style="margin: 0.5rem 0;"><strong>Canva:</strong> la herramienta más intuitiva para este curso.</li>
              <li style="margin: 0.5rem 0;"><strong>Mockup World:</strong> galería de plantillas descargables gratuitas.</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Aprende a trabajar con Canva para mockups</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ol style="margin: 0; color: #475569; line-height: 1.7; padding-left: 1.5rem;">
              <li style="margin: 0.75rem 0;">Crea una cuenta gratuita o inicia sesión</li>
              <li style="margin: 0.75rem 0;">Explora las secciones: "Mockups", "Diseño web", "Aplicaciones móviles", "Branding"</li>
              <li style="margin: 0.75rem 0;">Conecta la app "Text to Image" dentro de Canva para generar imágenes AI directamente</li>
            </ol>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Prompt con ChatGPT</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 0.5rem 0; color: #475569; font-style: italic;">"Crea un prompt que describa una interfaz simple para una web de reservas de consultorías."</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Actividad en Canva</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Diseña un mockup web simple (inicio de un sitio con hero, texto y botón).</li>
              <li style="margin: 0.5rem 0;">• Añade imagen AI generada desde Canva.</li>
              <li style="margin: 0.5rem 0;">• Aplica una tipografía y paleta de colores coherente.</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mini video en Sora</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 0.5rem 0; color: #475569;"><strong>Prompt:</strong></p>
            <p style="margin: 0; color: #475569; font-style: italic;">"Mockup animado de sitio web moderno, con acercamientos a cada sección. Música de fondo moderna. Texto: 'Diseño creado con IA en Canva'."</p>
          </div>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯</span> Aprendizaje clave
            </h4>
            <p style="margin: 0; color: #065f46; line-height: 1.6;">Comienzas a visualizar cómo pasar de una idea a un diseño visual sin necesidad de herramientas complejas.</p>
          </div>
        `
      },

      // MÓDULO 3 - Landing page completa
      {
        id: 'cmdyqqktb000be5skivefjiex',
        moduleId: 3,
        title: '3.1 Crear una landing page completa',
        duration: '30 min',
        type: 'lab',
        description: 'Crea una landing page completa y funcional para presentar a clientes o como demo',
        videoUrl: 'https://www.youtube.com/watch?v=example3-1',
        content: `
          <h2>3.1 Crear una landing page completa</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Crear una landing page completa y funcional para presentarse a un cliente o publicarse como demo.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Estructura de una landing page profesional</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ol style="margin: 0; color: #475569; line-height: 1.7; padding-left: 1.5rem;">
              <li style="margin: 0.75rem 0;">Header con logo y menú</li>
              <li style="margin: 0.75rem 0;">Hero con imagen, título potente y CTA</li>
              <li style="margin: 0.75rem 0;">Sección de beneficios (3 columnas o cards)</li>
              <li style="margin: 0.75rem 0;">Testimonios o cifras</li>
              <li style="margin: 0.75rem 0;">CTA final (formulario o botón)</li>
            </ol>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Prompt con ChatGPT</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0; color: #475569; font-style: italic;">"Dame una estructura para una landing page para una escuela online de idiomas con enfoque divertido y profesional."</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Actividad en Canva</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Crea la landing desde cero o con plantilla.</li>
              <li style="margin: 0.5rem 0;">• Genera imágenes con IA desde Canva o integra ilustraciones.</li>
              <li style="margin: 0.5rem 0;">• Ajusta colores, espaciado y tipografía para dar profesionalismo.</li>
              <li style="margin: 0.5rem 0;">• Aplica técnicas de jerarquía visual (grande > mediano > pequeño).</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Actividad complementaria con ChatGPT</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0; color: #475569; font-style: italic;">"Genera 3 titulares atractivos para secciones de una web que vende cursos en línea de forma creativa."</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Video en Sora</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 0.5rem 0; color: #475569;"><strong>Prompt:</strong></p>
            <p style="margin: 0; color: #475569; font-style: italic;">"Recorrido en video por una landing page de cursos online. Aparece texto animado: 'Aprende desde casa con diseño profesional'. Música inspiradora."</p>
          </div>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯</span> Aprendizaje clave
            </h4>
            <p style="margin: 0; color: #065f46; line-height: 1.6;">Creas un mockup web presentable, coherente y listo para testear con potenciales clientes o usuarios.</p>
          </div>
        `
      },

      // MÓDULO 4 - Mockups para apps móviles
      {
        id: 'cmdyqqkvi000de5skwui8tlc5',
        moduleId: 4,
        title: '4.1 Aprender a diseñar mockups',
        duration: '35 min',
        type: 'lab',
        description: 'Diseña mockups para apps móviles modernas siguiendo principios mobile-first',
        videoUrl: 'https://www.youtube.com/watch?v=example4-1',
        content: `
          <h2>4.1 Aprender a diseñar mockups</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Aprender a diseñar mockups para apps móviles modernas siguiendo principios mobile-first.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Conceptos mobile-first</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Diseño vertical</li>
              <li style="margin: 0.5rem 0;">• Pantallas simples y directas</li>
              <li style="margin: 0.5rem 0;">• Navegación táctil clara (menús inferiores, íconos grandes)</li>
              <li style="margin: 0.5rem 0;">• Importancia del contraste, espacio en blanco y legibilidad</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Prompt con ChatGPT</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0; color: #475569; font-style: italic;">"Crea una estructura visual de app para conectar terapeutas con pacientes. Incluye: inicio, búsqueda, perfil y agendar sesión."</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Actividad en Canva</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>Diseña 3 pantallas clave:</strong></p>
            <ol style="margin: 0 0 1rem 1.5rem; color: #475569; line-height: 1.7;">
              <li style="margin: 0.75rem 0;">Pantalla de inicio (login o catálogo)</li>
              <li style="margin: 0.75rem 0;">Pantalla de detalle (info de terapeuta/producto)</li>
              <li style="margin: 0.75rem 0;">Pantalla de acción (reserva, compra o contacto)</li>
            </ol>
            
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Utiliza recursos UI de Canva (tarjetas, botones, sliders)</li>
              <li style="margin: 0.5rem 0;">• Asegura consistencia de color, íconos y tipografía</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Apoyo con ChatGPT</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0; color: #475569; font-style: italic;">"¿Qué errores debo evitar al diseñar una interfaz de app para usuarios mayores de 40 años?"</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Video en Sora</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 0.5rem 0; color: #475569;"><strong>Prompt:</strong></p>
            <p style="margin: 0; color: #475569; font-style: italic;">"Animación de navegación por app móvil de bienestar. Fondo suave. Música tranquila. Texto: 'Crea tu app en minutos con IA'."</p>
          </div>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯</span> Aprendizaje clave
            </h4>
            <p style="margin: 0; color: #065f46; line-height: 1.6;">Dominas cómo visualizar una app funcional aunque no sepas programar, y la conviertes en una presentación profesional.</p>
          </div>
        `
      },

      // MÓDULO 5 - Identidad visual de marca
      {
        id: 'cmdyqqkxq000fe5ska1d3r6ru',
        moduleId: 5,
        title: '5.1 Crear una identidad visual de marca',
        duration: '40 min',
        type: 'lab',
        description: 'Crea una identidad visual completa, presenta un producto en redes sociales y genera mockups con Sora',
        videoUrl: 'https://www.youtube.com/watch?v=example5-1',
        content: `
          <h2>5.1 Crear una identidad visual de marca</h2>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
            <p style="margin: 0; color: #475569; line-height: 1.6;">Crear una identidad visual de marca, presentar un producto o servicio en redes sociales y generar el mockup directamente desde Sora.</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Branding con IA y Canva</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>Usa ChatGPT para definir:</strong></p>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Nombre de marca</li>
              <li style="margin: 0.5rem 0;">• Tono de voz</li>
              <li style="margin: 0.5rem 0;">• Colores asociados</li>
              <li style="margin: 0.5rem 0;">• Tipografía</li>
              <li style="margin: 0.5rem 0;">• Slogan</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Prompt con ChatGPT</h3>
          
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0; color: #475569; font-style: italic;">"Dame una identidad visual para una marca de café premium enfocada en jóvenes emprendedores. Incluye colores, tipografía y slogan."</p>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Diseño en Canva</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;"><strong>Crea:</strong></p>
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Un logotipo básico</li>
              <li style="margin: 0.5rem 0;">• Un mockup de producto (taza, caja, frasco)</li>
              <li style="margin: 0.5rem 0;">• Una publicación de Instagram (anuncio o lanzamiento)</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Mockup directo desde Sora</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <p style="margin: 0 0 1rem 0; color: #475569; line-height: 1.6;">Usa el generador visual de Sora para crear un mockup realista desde cero.</p>
            
            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
              <p style="margin: 0 0 0.5rem 0; color: #475569;"><strong>Prompt para Sora:</strong></p>
              <p style="margin: 0; color: #475569; font-style: italic;">"Mockup de una caja de té artesanal sobre fondo natural con iluminación suave. Estilo moderno. Texto: 'El ritual diario que te calma'. Música ambiental."</p>
            </div>
          </div>
          
          <h3 style="color: #1e293b; margin: 2rem 0 1rem 0;">Presentación final en Sora</h3>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
            <ul style="margin: 0; color: #475569; line-height: 1.7;">
              <li style="margin: 0.5rem 0;">• Crea un carrusel animado o video de branding.</li>
              <li style="margin: 0.5rem 0;">• Incluye logo, eslogan, colores y mockup.</li>
              <li style="margin: 0.5rem 0;">• Ideal para presentar en portafolio o redes.</li>
            </ul>
          </div>
          
          <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎯</span> Aprendizaje clave
            </h4>
            <p style="margin: 0; color: #065f46; line-height: 1.6;">Cierras el curso generando una pieza integral (branding + producto + video) completamente creada con IA, lista para usarse en entornos reales.</p>
          </div>
        `
      }
    ]
  };

  useEffect(() => {
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/mockup-cero/contenido');
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

  // Función para verificar inscripción
  const checkEnrollment = async () => {
    try {
      console.log('🔍 [MOCKUP-CONTENT] Verificando inscripción para curso: mockup-cero');
      console.log('🔍 [MOCKUP-CONTENT] Usuario actual:', { 
        userId: user?.id, 
        email: user?.email, 
        isAuthenticated: !!user
      });
      
      const response = await fetch(`/api/courses/enrollment-status?courseId=mockup-cero`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 [MOCKUP-CONTENT] Datos de inscripción:', data);
        
        if (!data.isEnrolled) {
          console.log('🔍 [MOCKUP-CONTENT] Usuario no inscrito, inscribiendo automáticamente...');
          // Intentar inscribir automáticamente
          const enrollResponse = await fetch('/api/courses/enroll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId: 'mockup-cero' }),
            credentials: 'include',
          });
          
          if (enrollResponse.ok) {
            console.log('✅ [MOCKUP-CONTENT] Usuario inscrito automáticamente');
            setIsEnrolled(true);
          } else {
            console.error('❌ [DEBUG] Error en inscripción automática');
            // Si falla la inscripción automática, redirigir a página del curso
            router.push('/curso/mockup-cero');
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
          router.push('/login?redirect=/curso/mockup-cero/contenido');
          return;
        }
        
        // Para otros errores, intentar inscripción directa
        console.log('🔍 [DEBUG] Intentando inscripción directa...');
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
          router.push('/curso/mockup-cero');
        }
      }
    } catch (error) {
      console.error('❌ [DEBUG] Error de conexión:', error);
      
      // En caso de error de conexión, intentar inscripción directa
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
          router.push('/curso/mockup-cero');
        }
      } catch (enrollError) {
        console.error('❌ [DEBUG] Error crítico:', enrollError);
        router.push('/curso/mockup-cero');
      }
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  // Guardar progreso automáticamente al salir de la página
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      const currentLesson = courseData.lessons[progress.currentLesson];
      if (currentLesson && isEnrolled) {
        const token = localStorage.getItem('authToken');
        const progressData = {
          courseId: 'mockup-cero',
          currentLesson: progress.currentLesson,
          completedLessons: progress.completedLessons,
          lessonNumber: currentLesson.id,
          lessonTitle: currentLesson.title,
          action: 'access',
          timeSpent: 1
        };

        try {
          fetch('/api/courses/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(progressData),
            keepalive: true
          });
        } catch (error) {
          console.error('Error guardando progreso al salir:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [progress.currentLesson, progress.completedLessons, isEnrolled]);

  // Funciones auxiliares de debounce para guardar progreso
  const debouncedSaveProgress = (
    lessonIndex: number,
    completedLessons: string[],
    lessonNumber: string,
    lessonTitle: string,
    action: string,
    timeSpent: number
  ) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (isEnrolled) {
        saveProgress(lessonIndex, completedLessons, lessonNumber, lessonTitle, action, timeSpent);
      }
    }, 1000);
  };

  const handleManualLessonChange = (lessonIndex: number) => {
    const lesson = courseData.lessons[lessonIndex];
    
    setCurrentLesson(lessonIndex);
    
    debouncedSaveProgress(
      lessonIndex,
      progress.completedLessons,
      lesson.id,
      lesson.title,
      'access',
      1
    );
  };

  const handlePreviousLesson = () => {
    if (progress.currentLesson > 0) {
      const newLessonIndex = progress.currentLesson - 1;
      const newLesson = courseData.lessons[newLessonIndex];
      
      setCurrentLesson(newLessonIndex);
      
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
      
      setCurrentLesson(newLessonIndex);
      
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

  const handleCompleteCurrentLesson = async () => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    await handleMarkLessonComplete(currentLesson.id);
  };

  // Función para verificar si se debe mostrar el botón "Completar Módulo"
  const shouldShowCompleteModuleButton = (moduleId: number) => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    if (!currentLesson) return false;
    
    return isLastLessonOfModule(currentLesson.id, moduleId);
  };

  // Función para verificar si el botón "Completar Módulo" debe estar habilitado
  const canCompleteModule = (moduleId: number) => {
    const currentLesson = courseData.lessons[progress.currentLesson];
    if (!currentLesson) return false;
    
    const isLastInModule = isLastLessonOfModule(currentLesson.id, moduleId);
    const moduleProgress = getModuleProgress(moduleId);
    
    const allOtherLessonsCompleted = moduleProgress.completed === moduleProgress.total - 1;
    
    return isLastInModule && allOtherLessonsCompleted && !progress.completedLessons.includes(currentLesson.id);
  };

  const isModuleCompleted = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    return moduleLessons.every(lesson => progress.completedLessons.includes(lesson.id));
  };

  const canCompleteModuleWithPrerequisites = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const currentLesson = courseData.lessons[progress.currentLesson];
    
    const previousLessons = moduleLessons.filter(lesson => lesson.id !== currentLesson.id);
    
    const allPreviousCompleted = previousLessons.every(lesson => progress.completedLessons.includes(lesson.id));
    
    return allPreviousCompleted;
  };

  const getModuleProgress = (moduleId: number) => {
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    const completedInModule = moduleLessons.filter(lesson => progress.completedLessons.includes(lesson.id));
    return {
      completed: completedInModule.length,
      total: moduleLessons.length,
      percentage: (completedInModule.length / moduleLessons.length) * 100
    };
  };

  const LAST_LESSONS_BY_MODULE: Record<number, string> = {
    1: 'cmdyqqkox0007e5skmk20laur', // 1.4 Actividad Práctica 1
    2: 'cmdyqqkr40009e5skmm3hwpfb', // 2.1 Familiarizarte con las principales herramientas de IA
    3: 'cmdyqqktb000be5skivefjiex', // 3.1 Crear una landing page completa
    4: 'cmdyqqkvi000de5skwui8tlc5', // 4.1 Aprender a diseñar mockups
    5: 'cmdyqqkxq000fe5ska1d3r6ru'  // 5.1 Crear una identidad visual de marca
  };

  const isLastLessonOfModule = (lessonId: string, moduleId: number): boolean => {
    return LAST_LESSONS_BY_MODULE[moduleId] === lessonId;
  };

  const handleCompleteModule = async (moduleId: number) => {
    if (!isEnrolled) return;

    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Estás en modo de revisión.');
      return;
    }

    if (!canCompleteModuleWithPrerequisites(moduleId)) {
      alert('Debes completar todas las lecciones anteriores del módulo antes de poder completarlo.');
      return;
    }
    
    const moduleLessons = courseData.lessons.filter(lesson => lesson.moduleId === moduleId);
    
    const allModuleLessonIds = moduleLessons.map(lesson => lesson.id);
    const newCompletedLessons = [
      ...progress.completedLessons.filter(id => !allModuleLessonIds.includes(id)),
      ...allModuleLessonIds
    ];

    allModuleLessonIds.forEach(lessonId => {
      if (!progress.completedLessons.includes(lessonId)) {
        markLessonComplete(lessonId);
      }
    });

    const currentLessonIndex = progress.currentLesson;
    const currentLesson = courseData.lessons[currentLessonIndex];

    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id,
      `Módulo ${moduleId} Completado`,
      'complete',
      10
    );

    const moduleTitle = getModuleTitle(moduleId);
    alert(`¡Felicitaciones! Has completado el ${moduleTitle} 🎉`);

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

  const getModuleTitle = (moduleId: number): string => {
    switch (moduleId) {
      case 1: return 'Módulo 1: Introducción a los Mockups con IA';
      case 2: return 'Módulo 2: Herramientas de IA para Diseño';
      case 3: return 'Módulo 3: Creación de Wireframes';
      case 4: return 'Módulo 4: Diseño de Interfaces con IA';
      case 5: return 'Módulo 5: Proyectos y Casos Prácticos';
      default: return `Módulo ${moduleId}`;
    }
  };

  const handleCompleteCourse = async () => {
    if (!isEnrolled) return;
    
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Puedes revisar el contenido cuando quieras.');
      return;
    }
    
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
          courseSlug: 'mockup-cero'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        router.push('/curso/mockup-cero');
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
    return true;
  };

  const isCourseCompleted = () => {
    return progress.status === 'COMPLETED' || progress.progressPercentage === 100;
  };

  const getLessonStatus = (lessonIndex: number, lessonId: string) => {
    if (isLessonCompleted(lessonId)) {
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
        <button onClick={() => router.push('/curso/mockup-cero')}>
          Volver al curso
        </button>
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
                  <span className="breadcrumb-separator">→</span>
                  <a href="/curso/mockup-cero" className="breadcrumb-item">
                    <span className="breadcrumb-icon">📚</span>
                    <span className="breadcrumb-text">Mockups con IA</span>
                  </a>
                  <span className="breadcrumb-separator">→</span>
                  <span className="breadcrumb-item active">
                    <span className="breadcrumb-icon">🎯</span>
                    <span className="breadcrumb-text">Contenido</span>
                  </span>
                </div>
              </div>
              
              <div className="header-main">
                <div className="header-content">
                  <h1 className="course-title">{courseData.title}</h1>
                  <div className="header-actions">
                    <a href="/curso/mockup-cero" className="btn-exit-course">
                      <span>←</span> Salir del Curso
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              <div className="current-lesson">
                <div className="lesson-header">
                  <h2>{courseData.lessons[progress.currentLesson]?.title || 'Cargando...'}</h2>
                  <div className="lesson-meta">
                    <span className="lesson-type">
                      {courseData.lessons[progress.currentLesson]?.type || 'video'}
                    </span>
                    <span>•</span>
                    <span>{courseData.lessons[progress.currentLesson]?.duration || '0 min'}</span>
                  </div>
                </div>

                {courseData.lessons[progress.currentLesson]?.videoUrl && (
                  <div className="video-section">
                    <VideoPlayer
                      videoUrl={courseData.lessons[progress.currentLesson].videoUrl}
                      title={courseData.lessons[progress.currentLesson].title}
                    />
                  </div>
                )}

                <div 
                  className="lesson-content"
                  dangerouslySetInnerHTML={{ 
                    __html: courseData.lessons[progress.currentLesson]?.content || '<p>Contenido no disponible</p>' 
                  }}
                />

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
                    {(() => {
                      const currentLesson = courseData.lessons[progress.currentLesson];
                      const currentModuleId = currentLesson.moduleId;
                      const isLastLesson = shouldShowCompleteModuleButton(currentModuleId);
                      const isCurrentLessonCompleted = progress.completedLessons.includes(currentLesson.id);
                      const isModuleAlreadyCompleted = isModuleCompleted(currentModuleId);
                      
                      if (isModuleAlreadyCompleted) {
                        // Módulo ya completado - no mostrar botones de completar
                        return null;
                      }
                      
                      if (isLastLesson) {
                        // Última lección del módulo - solo mostrar botón "Completar Módulo"
                        const canComplete = canCompleteModule(currentModuleId);
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
                            🏆 Completar Módulo {currentModuleId}
                          </button>
                        );
                      } else {
                        // Lección regular - mostrar botón "Completar Lección" si no está completada
                        return !isCurrentLessonCompleted && (
                          <button 
                            className="btn btn-primary"
                            onClick={handleCompleteCurrentLesson}
                          >
                            ✅ Completar Lección
                          </button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>

              <div className="course-sidebar">
                <div className="progress-section">
                  <div className="progress-header">
                    <h3>Progreso del Curso</h3>
                    <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressPercentage}%` }}
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
                                  className={`lesson-item ${globalIndex === progress.currentLesson ? 'current' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}
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

        .video-section {
          margin-bottom: 2rem;
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

        .lesson-actions {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          cursor: pointer;
          transition: all 0.3s ease;
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
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-success {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          transform: translateY(-1px);
        }

        .btn-large {
          font-size: 1.1em;
          padding: 12px 24px;
        }

        .course-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .progress-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #1f2937;
        }

        .progress-percentage {
          font-size: 1.25rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          transition: width 0.3s ease;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .course-guidance {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 1rem;
          border-radius: 8px;
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

        .progress-text {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
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
          transition: width 0.3s ease;
        }

        .module-lessons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lesson-item:hover {
          background: #f9fafb;
          border-color: #3b82f6;
        }

        .lesson-item.current {
          background: #eff6ff;
          border-color: #3b82f6;
          border-width: 2px;
        }

        .lesson-item.completed {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .lesson-number {
          background: #f3f4f6;
          color: #6b7280;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 2rem;
          text-align: center;
        }

        .lesson-item.current .lesson-number {
          background: #3b82f6;
          color: white;
        }

        .lesson-item.completed .lesson-number {
          background: #22c55e;
          color: white;
        }

        .lesson-content {
          flex: 1;
        }

        .lesson-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #1f2937;
          line-height: 1.3;
        }

        .lesson-content .lesson-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .lesson-status {
          font-size: 1rem;
        }

        .complete-course-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .btn-complete-course {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-bottom: 1rem;
        }

        .btn-complete-course:hover:not(.disabled) {
          background: linear-gradient(135deg, #d97706, #b45309);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }

        .btn-complete-course.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .complete-course-info {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.4;
          margin: 0;
        }

        .course-completed-message {
          text-align: center;
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
          font-size: 1.25rem;
          font-weight: 700;
          color: #22c55e;
        }

        .completion-info {
          color: #6b7280;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .completion-stats {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: #22c55e;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .course-title {
            font-size: 1.8rem;
          }

          .current-lesson {
            padding: 1.5rem;
          }

          .lesson-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .course-title {
            font-size: 1.5rem;
          }

          .current-lesson {
            padding: 1rem;
          }

          .course-sidebar {
            gap: 1rem;
          }

          .progress-section {
            padding: 1rem;
          }

          .module-group {
            padding: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}