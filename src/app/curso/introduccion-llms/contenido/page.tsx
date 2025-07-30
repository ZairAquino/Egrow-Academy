'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Navbar from '@/components/layout/Navbar';

import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseProgress } from '@/hooks/useCourseProgress';

export default function ContenidoCursoPage() {
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
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
  } = useCourseProgress('introduccion-llms', isEnrolled);

  // Debug: Log cuando cambie el progreso
  useEffect(() => {
    console.log('🔍 [DEBUG] Progreso actualizado en componente:');
    console.log('  - Lección actual:', progress.currentLesson);
    console.log('  - Lecciones completadas:', progress.completedLessons);
    console.log('  - Porcentaje:', progress.progressPercentage);
    console.log('  - Estado:', progress.status);
    console.log('  - isEnrolled:', isEnrolled);
    console.log('  - isLoading:', isLoading);
  }, [progress, isEnrolled, isLoading]);

  const courseData = {
    id: 'introduccion-llms',
    title: 'Introducción a Large Language Models (LLMs)',
    description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
    lessons: [
      {
        id: 1,
        title: 'Bienvenida e Introducción',
        duration: '8 min',
        type: 'video',
        description: 'Presentación del curso y conceptos fundamentales',
        content: `
          <h2>Bienvenido al curso de Introducción a LLMs</h2>
          <p>En este curso aprenderás los fundamentos de los modelos de lenguaje grandes, una de las tecnologías más revolucionarias de la inteligencia artificial.</p>
          
          <h3>¿Qué aprenderás?</h3>
          <ul>
            <li>Fundamentos de los LLMs</li>
            <li>Arquitectura Transformer</li>
            <li>Prompt Engineering</li>
            <li>Implementación práctica</li>
          </ul>
          
          <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
          </div>
        `,
        completed: false
      },
      {
        id: 2,
        title: '¿Qué son los LLMs?',
        duration: '15 min',
        type: 'video',
        description: 'Definición y características principales de los modelos de lenguaje grandes',
        content: `
          <h2>¿Qué son los Large Language Models?</h2>
          <p>Los Large Language Models (LLMs) son modelos de inteligencia artificial entrenados en grandes cantidades de texto para comprender y generar lenguaje humano.</p>
          
          <h3>Características principales:</h3>
          <ul>
            <li><strong>Escala masiva:</strong> Entrenados con miles de millones de parámetros</li>
            <li><strong>Capacidades emergentes:</strong> Habilidades que surgen con el escalado</li>
            <li><strong>Transferencia de conocimiento:</strong> Aplican lo aprendido a nuevas tareas</li>
            <li><strong>Generación de texto:</strong> Crean contenido coherente y contextual</li>
          </ul>
          
          <h3>Ejemplos de LLMs:</h3>
          <ul>
            <li>GPT-3, GPT-4 (OpenAI)</li>
            <li>Claude (Anthropic)</li>
            <li>BERT (Google)</li>
            <li>LLaMA (Meta)</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 3,
        title: 'Historia y Evolución',
        duration: '12 min',
        type: 'video',
        description: 'Evolución desde N-gramas hasta los modelos actuales',
        content: `
          <h2>Historia y Evolución de los LLMs</h2>
          <p>La evolución de los modelos de lenguaje ha sido un viaje fascinante que ha transformado la inteligencia artificial.</p>
          
          <h3>Línea de tiempo:</h3>
          <ul>
            <li><strong>1950s:</strong> N-gramas y modelos estadísticos básicos</li>
            <li><strong>1980s:</strong> Redes neuronales recurrentes (RNN)</li>
            <li><strong>1990s:</strong> LSTM y GRU para secuencias largas</li>
            <li><strong>2017:</strong> Arquitectura Transformer (Vaswani et al.)</li>
            <li><strong>2018:</strong> BERT y modelos bidireccionales</li>
            <li><strong>2020:</strong> GPT-3 y escalado masivo</li>
            <li><strong>2022:</strong> ChatGPT y adopción masiva</li>
            <li><strong>2023+:</strong> GPT-4, Claude y modelos multimodales</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 4,
        title: 'Arquitectura Transformer',
        duration: '20 min',
        type: 'video',
        description: 'Fundamentos de la arquitectura que revolucionó el PLN',
        content: `
          <h2>Arquitectura Transformer</h2>
          <p>La arquitectura Transformer, introducida en el paper "Attention is All You Need", revolucionó el procesamiento de lenguaje natural.</p>
          
          <h3>Componentes principales:</h3>
          <ul>
            <li><strong>Multi-Head Attention:</strong> Mecanismo de atención que permite al modelo enfocarse en diferentes partes de la entrada</li>
            <li><strong>Feed-Forward Networks:</strong> Redes neuronales que procesan la información</li>
            <li><strong>Layer Normalization:</strong> Normalización que estabiliza el entrenamiento</li>
            <li><strong>Residual Connections:</strong> Conexiones que facilitan el flujo de gradientes</li>
          </ul>
          
          <h3>Ventajas del Transformer:</h3>
          <ul>
            <li>Paralelización eficiente</li>
            <li>Captura de dependencias a largo plazo</li>
            <li>Escalabilidad masiva</li>
            <li>Flexibilidad arquitectónica</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 5,
        title: 'Lab: Explorando GPT-3.5',
        duration: '25 min',
        type: 'lab',
        description: 'Ejercicio práctico usando la API de OpenAI',
        content: `
          <h2>Laboratorio: Explorando GPT-3.5</h2>
          <p>En este laboratorio práctico, aprenderás a usar la API de OpenAI para interactuar con GPT-3.5.</p>
          
          <h3>Configuración inicial:</h3>
          <pre><code>pip install openai
export OPENAI_API_KEY="tu-api-key-aqui"</code></pre>
          
          <h3>Ejemplo básico:</h3>
          <pre><code>import openai

openai.api_key = "tu-api-key-aqui"

response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "Explica qué son los LLMs en 3 oraciones"}
  ]
)

print(response.choices[0].message.content)</code></pre>
          
          <h3>Ejercicios prácticos:</h3>
          <ol>
            <li>Genera un resumen de un texto</li>
            <li>Crea un chatbot simple</li>
            <li>Traduce texto entre idiomas</li>
            <li>Genera código Python</li>
          </ol>
        `,
        completed: false
      },
      {
        id: 6,
        title: 'Prompt Engineering',
        duration: '18 min',
        type: 'video',
        description: 'Técnicas para crear prompts efectivos',
        content: `
          <h2>Prompt Engineering</h2>
          <p>El prompt engineering es el arte de diseñar entradas que guíen a los LLMs para producir las respuestas deseadas.</p>
          
          <h3>Principios fundamentales:</h3>
          <ul>
            <li><strong>Claridad:</strong> Instrucciones específicas y sin ambigüedad</li>
            <li><strong>Contexto:</strong> Proporcionar información relevante</li>
            <li><strong>Ejemplos:</strong> Few-shot learning con casos de uso</li>
            <li><strong>Formato:</strong> Estructura clara de la respuesta esperada</li>
          </ul>
          
          <h3>Técnicas avanzadas:</h3>
          <ul>
            <li><strong>Chain of Thought:</strong> Guiar el razonamiento paso a paso</li>
            <li><strong>Role Prompting:</strong> Asignar roles específicos al modelo</li>
            <li><strong>Temperature Control:</strong> Ajustar la creatividad vs consistencia</li>
            <li><strong>System Messages:</strong> Definir el comportamiento del modelo</li>
          </ul>
          
          <h3>Ejemplos prácticos:</h3>
          <pre><code># Ejemplo de Chain of Thought
"Resuelve este problema paso a paso:
1. Primero, identifica los datos conocidos
2. Luego, determina qué fórmula usar
3. Finalmente, calcula el resultado

Problema: Si un tren viaja a 120 km/h, ¿cuánto tiempo tarda en recorrer 360 km?"</code></pre>
        `,
        completed: false
      },
      {
        id: 7,
        title: 'Lab: Prompt Engineering Avanzado',
        duration: '30 min',
        type: 'lab',
        description: 'Ejercicios prácticos de optimización de prompts',
        content: `
          <h2>Laboratorio: Prompt Engineering Avanzado</h2>
          <p>En este laboratorio, practicarás técnicas avanzadas de prompt engineering con casos reales.</p>
          
          <h3>Ejercicio 1: Análisis de Sentimientos</h3>
          <pre><code># Prompt básico
"Analiza el sentimiento de este texto: 'Me encanta este producto!'"

# Prompt mejorado con contexto
"Actúa como un analista de sentimientos experto. 
Analiza el siguiente texto y proporciona:
1. Sentimiento (positivo/negativo/neutral)
2. Confianza (0-100%)
3. Palabras clave que influyen en el sentimiento

Texto: 'Me encanta este producto!'"</code></pre>
          
          <h3>Ejercicio 2: Generación de Código</h3>
          <pre><code># Prompt para generar código Python
"Eres un desarrollador Python experto. Crea una función que:
- Tome una lista de números
- Retorne la suma de los números pares
- Incluya manejo de errores
- Tenga documentación clara

Formato de respuesta:
\`\`\`python
def nombre_funcion(parametros):
    &quot;&quot;&quot;
    Descripción de la función
    &quot;&quot;&quot;
    # código aquí
\`\`\`</code></pre>
          
          <h3>Ejercicio 3: Resolución de Problemas</h3>
          <p>Usa Chain of Thought para resolver problemas matemáticos complejos.</p>
        `,
        completed: false
      },
      {
        id: 8,
        title: 'Casos de Uso Reales',
        duration: '15 min',
        type: 'video',
        description: 'Aplicaciones en chatbots, análisis de texto y más',
        content: `
          <h2>Casos de Uso Reales de LLMs</h2>
          <p>Los LLMs están transformando múltiples industrias con aplicaciones prácticas innovadoras.</p>
          
          <h3>Chatbots y Asistentes Virtuales:</h3>
          <ul>
            <li><strong>Customer Service:</strong> Atención al cliente 24/7</li>
            <li><strong>Asistentes Personales:</strong> Siri, Alexa, Google Assistant</li>
            <li><strong>Chatbots Educativos:</strong> Tutores personalizados</li>
            <li><strong>Asistentes de Programación:</strong> GitHub Copilot, Cursor</li>
          </ul>
          
          <h3>Análisis y Generación de Contenido:</h3>
          <ul>
            <li><strong>Resúmenes Automáticos:</strong> Artículos, documentos, reuniones</li>
            <li><strong>Generación de Contenido:</strong> Blogs, marketing, creativo</li>
            <li><strong>Traducción:</strong> Múltiples idiomas con contexto</li>
            <li><strong>Análisis de Sentimientos:</strong> Redes sociales, reviews</li>
          </ul>
          
          <h3>Aplicaciones Empresariales:</h3>
          <ul>
            <li><strong>Automatización de Procesos:</strong> Documentos, emails, reportes</li>
            <li><strong>Investigación:</strong> Análisis de datos, literatura científica</li>
            <li><strong>Educación:</strong> Contenido personalizado, evaluación</li>
            <li><strong>Salud:</strong> Diagnóstico, investigación médica</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 9,
        title: 'Limitaciones y Sesgos',
        duration: '12 min',
        type: 'video',
        description: 'Desafíos actuales y consideraciones éticas',
        content: `
          <h2>Limitaciones y Sesgos en LLMs</h2>
          <p>Es crucial entender las limitaciones y sesgos de los LLMs para usarlos de manera responsable.</p>
          
          <h3>Limitaciones Técnicas:</h3>
          <ul>
            <li><strong>Alucinaciones:</strong> Generación de información falsa pero plausible</li>
            <li><strong>Contexto Limitado:</strong> Ventana de atención restringida</li>
            <li><strong>Falta de Razonamiento:</strong> No entienden realmente el contenido</li>
            <li><strong>Actualización de Conocimiento:</strong> Datos de entrenamiento desactualizados</li>
          </ul>
          
          <h3>Sesgos y Consideraciones Éticas:</h3>
          <ul>
            <li><strong>Sesgos de Entrenamiento:</strong> Reflejan sesgos en los datos de entrenamiento</li>
            <li><strong>Discriminación:</strong> Pueden perpetuar estereotipos</li>
            <li><strong>Privacidad:</strong> Riesgos de exposición de datos sensibles</li>
            <li><strong>Responsabilidad:</strong> ¿Quién es responsable de las decisiones del modelo?</li>
          </ul>
          
          <h3>Mejores Prácticas:</h3>
          <ul>
            <li>Verificar siempre la información generada</li>
            <li>Implementar filtros de contenido</li>
            <li>Diversificar fuentes de datos</li>
            <li>Transparencia en el uso de IA</li>
            <li>Evaluación continua de sesgos</li>
          </ul>
        `,
        completed: false
      },
      {
        id: 10,
        title: 'Proyecto Final',
        duration: '35 min',
        type: 'project',
        description: 'Construye una aplicación completa con LLMs',
        content: `
          <h2>Proyecto Final: Chatbot Inteligente</h2>
          <p>En este proyecto final, construirás un chatbot inteligente que integre todo lo aprendido en el curso.</p>
          
          <h3>Objetivos del Proyecto:</h3>
          <ul>
            <li>Crear un chatbot funcional con GPT-3.5</li>
            <li>Implementar prompt engineering efectivo</li>
            <li>Manejar conversaciones contextuales</li>
            <li>Integrar con una interfaz web</li>
          </ul>
          
          <h3>Arquitectura del Proyecto:</h3>
          <pre><code># Estructura del proyecto
chatbot-app/
├── app.py              # Aplicación principal
├── chatbot.py          # Lógica del chatbot
├── prompts.py          # Templates de prompts
├── templates/          # Interfaz web
│   ├── index.html
│   └── chat.html
└── requirements.txt    # Dependencias</code></pre>
          
          <h3>Funcionalidades a Implementar:</h3>
          <ol>
            <li><strong>Configuración inicial:</strong> API key y configuración</li>
            <li><strong>Chat básico:</strong> Conversación simple con el modelo</li>
            <li><strong>Manejo de contexto:</strong> Mantener conversación</li>
            <li><strong>Prompt templates:</strong> Diferentes tipos de respuestas</li>
            <li><strong>Interfaz web:</strong> Chat visual con Streamlit</li>
            <li><strong>Validación:</strong> Filtros de contenido</li>
          </ol>
          
          <h3>Código Base:</h3>
          <pre><code>import streamlit as st
import openai
from datetime import datetime

# Configuración
openai.api_key = st.secrets[&quot;openai_api_key&quot;]

def chat_with_gpt(message, conversation_history):
    messages = [
        {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;Eres un asistente útil y amigable.&quot;}
    ]
    
    # Agregar historial de conversación
    for msg in conversation_history:
        messages.append(msg)
    
    # Agregar mensaje actual
    messages.append({&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: message})
    
    response = openai.ChatCompletion.create(
        model=&quot;gpt-3.5-turbo&quot;,
        messages=messages,
        max_tokens=150
    )
    
    return response.choices[0].message.content

# Interfaz de Streamlit
st.title(&quot;🤖 Chatbot Inteligente&quot;)
st.write(&quot;¡Bienvenido al proyecto final del curso!&quot;)

# Inicializar historial de chat
if &quot;messages&quot; not in st.session_state:
    st.session_state.messages = []

# Mostrar historial
for message in st.session_state.messages:
    with st.chat_message(message[&quot;role&quot;]):
        st.markdown(message[&quot;content&quot;])

# Input del usuario
if prompt := st.chat_input(&quot;Escribe tu mensaje...&quot;):
    st.session_state.messages.append({&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: prompt})
    with st.chat_message(&quot;user&quot;):
        st.markdown(prompt)

    # Respuesta del chatbot
    with st.chat_message(&quot;assistant&quot;):
        response = chat_with_gpt(prompt, st.session_state.messages)
        st.markdown(response)
    
    st.session_state.messages.append({&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: response})</code></pre>
          
          <h3>Evaluación del Proyecto:</h3>
          <ul>
            <li>Funcionalidad del chatbot (40%)</li>
            <li>Calidad de los prompts (30%)</li>
            <li>Interfaz de usuario (20%)</li>
            <li>Documentación (10%)</li>
          </ul>
        `,
        completed: false
      }
    ]
  };

  useEffect(() => {
    // Verificar si el usuario está inscrito
    if (user) {
      checkEnrollment();
    } else {
      router.push('/login?redirect=/curso/introduccion-llms/contenido');
    }
  }, [user]);

  // Guardar progreso antes de salir de la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isEnrolled && !isLoading && progress.completedLessons.length > 0) {
        const currentLesson = courseData.lessons[progress.currentLesson];
        saveProgress(
          progress.currentLesson, 
          progress.completedLessons,
          currentLesson?.id,
          currentLesson?.title,
          'access',
          1
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [progress.currentLesson, progress.completedLessons]); // Solo dependencias del progreso

  // Guardar progreso cuando el usuario navegue a otra página
  useEffect(() => {
    const handleRouteChange = () => {
      if (isEnrolled && !isLoading && progress.completedLessons.length > 0) {
        const currentLesson = courseData.lessons[progress.currentLesson];
        saveProgress(
          progress.currentLesson, 
          progress.completedLessons,
          currentLesson?.id,
          currentLesson?.title,
          'access',
          1
        );
      }
    };

    // Solo ejecutar cuando cambie la ruta, no cuando cambie el progreso
    if (pathname && isEnrolled && !isLoading) {
      // Usar un flag para evitar ejecuciones múltiples
      const timeoutId = setTimeout(() => {
        handleRouteChange();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pathname]); // Solo dependencia de pathname para evitar ejecuciones múltiples

  const checkEnrollment = async () => {
    // Primero verificar si el usuario está autenticado
    if (!user) {
      console.log('🔍 [DEBUG] Usuario no autenticado, redirigiendo al login');
      router.push('/login?redirect=/curso/introduccion-llms/contenido');
      return;
    }

    console.log('🔍 [DEBUG] Usuario autenticado, verificando inscripción...');
    
    try {
      const response = await fetch(`/api/courses/enrollment-status?courseId=${courseData.id}`);
      if (response.ok) {
        const data = await response.json();
        
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
            router.push('/curso/introduccion-llms');
            return;
          }
        } else {
          setIsEnrolled(data.isEnrolled);
        }
      } else {
        const errorData = await response.json();
        console.error('🔍 [DEBUG] Error en respuesta:', errorData);
        
        // Si el error es de autenticación, verificar si realmente no está autenticado
        if (response.status === 401) {
          console.log('🔍 [DEBUG] Error 401 - Verificando si realmente no está autenticado...');
          
          // Intentar inscribir directamente sin verificar inscripción previa
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
              console.log('✅ [DEBUG] Usuario inscrito exitosamente tras error 401');
              setIsEnrolled(true);
            } else {
              console.log('🔍 [DEBUG] Error en inscripción tras 401 - Redirigiendo al login');
              router.push('/login?redirect=/curso/introduccion-llms/contenido');
            }
          } catch (enrollError) {
            console.error('❌ [DEBUG] Error crítico en inscripción:', enrollError);
            router.push('/login?redirect=/curso/introduccion-llms/contenido');
          }
          return;
        }
        
        // Para otros errores, redirigir a página del curso
        router.push('/curso/introduccion-llms');
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
          router.push('/curso/introduccion-llms');
        }
      } catch (enrollError) {
        console.error('❌ [DEBUG] Error crítico:', enrollError);
        router.push('/curso/introduccion-llms');
      }
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  

  const handleManualLessonChange = async (newLessonIndex: number) => {
    console.log('🔍 [DEBUG] handleManualLessonChange llamado con newLessonIndex:', newLessonIndex);
    
    // Guardar progreso de la lección actual antes de cambiar
    const currentLesson = courseData.lessons[progress.currentLesson];
    await saveProgress(
      progress.currentLesson,
      progress.completedLessons,
      currentLesson?.id,
      currentLesson?.title,
      'access',
      1
    );
    
    // Cambiar a la nueva lección
    setCurrentLesson(newLessonIndex);
  };

  const handleReturnToCourse = async () => {
    console.log('🔍 [DEBUG] Regresando al curso');
    
    setIsSaving(true);
    
    try {
      // Guardar progreso de la lección actual antes de salir
      const currentLesson = courseData.lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      
      // Navegar de vuelta al curso
      router.push('/curso/introduccion-llms');
    } catch (error) {
      console.error('Error guardando progreso:', error);
      setIsSaving(false);
    }
  };

  const handlePreviousLesson = async () => {
    if (progress.currentLesson > 0) {
      console.log('🔍 [DEBUG] Regresando a lección anterior:', progress.currentLesson - 1);
      
      // Guardar progreso de la lección actual antes de cambiar
      const currentLesson = courseData.lessons[progress.currentLesson];
      await saveProgress(
        progress.currentLesson,
        progress.completedLessons,
        currentLesson?.id,
        currentLesson?.title,
        'access',
        1
      );
      
      // Cambiar a la lección anterior
      setCurrentLesson(progress.currentLesson - 1);
    }
  };

  const handleMarkLessonComplete = async (lessonId: number) => {
    // Si el curso ya está completado, no permitir marcar lecciones como completadas
    if (isCourseCompleted()) {
      alert('Este curso ya está completado. Estás en modo de revisión.');
      return;
    }

    console.log('🔍 [DEBUG] handleMarkLessonComplete llamado con lessonId:', lessonId);
    
    // Obtener el índice actual de la lección
    const currentLessonIndex = courseData.lessons.findIndex(lesson => lesson.id === lessonId);
    const currentLesson = courseData.lessons[currentLessonIndex];
    
    console.log('🔍 [DEBUG] currentLessonIndex:', currentLessonIndex);
    
    // Crear la nueva lista de lecciones completadas
    const newCompletedLessons = progress.completedLessons.includes(lessonId) 
      ? progress.completedLessons 
      : [...progress.completedLessons, lessonId];
    
    // Marcar la lección como completada (actualiza el estado inmediatamente)
    markLessonComplete(lessonId);
    
    // Guardar progreso con información de completado
    await saveProgress(
      currentLessonIndex,
      newCompletedLessons,
      currentLesson.id,
      currentLesson.title,
      'complete',
      5 // 5 minutos por completar una lección
    );
    
    // Avanzar a la siguiente lección si no es la última
    if (currentLessonIndex < courseData.lessons.length - 1) {
      console.log('🔍 [DEBUG] Avanzando a lección:', currentLessonIndex + 1);
      // Usar setTimeout para evitar conflictos de estado
      setTimeout(() => {
        setCurrentLesson(currentLessonIndex + 1);
      }, 100);
    } else {
      console.log('🔍 [DEBUG] Es la última lección, no avanzar');
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
          courseSlug: 'introduccion-llms'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Curso marcado como completado:', result);
        
        // Redirigir a la página de inicio del curso
        router.push('/curso/introduccion-llms');
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

  // Función de debug para verificar el progreso
  const debugProgress = () => {
    console.log('🔍 [DEBUG] Estado actual del progreso:');
    console.log('  - Lección actual:', progress.currentLesson);
    console.log('  - Lecciones completadas:', progress.completedLessons);
    console.log('  - Porcentaje de progreso:', progress.progressPercentage);
    console.log('  - Estado:', progress.status);
    console.log('  - Total de lecciones:', courseData.lessons.length);
  };

  if (!user || isLoading || isCheckingEnrollment) {
    return <div className="loading-container" suppressHydrationWarning>Cargando...</div>;
  }

  if (!isEnrolled) {
    return (
      <div className="enrollment-required">
        <h2>Inscripción requerida</h2>
        <p>Debes inscribirte al curso para acceder al contenido.</p>
        <button onClick={() => router.push('/curso/introduccion-llms')}>
          Volver al curso
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar  />
      
      
      
      <main className="main-content">
        {/* Course Header */}
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
                  <a href="/curso/introduccion-llms" className="breadcrumb-item">
                    <span className="breadcrumb-icon">🎯</span>
                    <span className="breadcrumb-text">Introducción a LLMs</span>
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

        {/* Course Content */}
        <section className="course-content">
          <div className="container">
            <div className="content-layout">
              {/* Main Content */}
              <div className="main-content-area">
                {/* Current Lesson */}
                <div className="current-lesson">
                  <div className="lesson-header">
                    <h2>Lección {progress.currentLesson + 1}: {courseData.lessons[progress.currentLesson].title}</h2>
                    <div className="lesson-meta">
                      <span className="lesson-type">{courseData.lessons[progress.currentLesson].type}</span>
                      <span className="lesson-duration">{courseData.lessons[progress.currentLesson].duration}</span>
                    </div>
                  </div>
                  
                  <div className="lesson-content">
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
                    {/* Botón de debug temporal */}
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <button 
                        className="btn btn-outline"
                        onClick={debugProgress}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        🔍 Debug Progreso
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="content-sidebar">
                {/* Lessons Navigation */}
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
                            console.log('🔍 [DEBUG] Navegando a lección:', index);
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

        .btn-outline-white {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-outline-white:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
        }

        .btn-outline-white:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
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

        .btn-exit-course::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-exit-course:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          border-color: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .btn-exit-course:hover::before {
          left: 100%;
        }

        .btn-exit-course:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .btn-exit-course:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        @media (max-width: 768px) {
          .header-main {
            flex-direction: column;
            gap: 1rem;
            text-align: left;
          }

          .header-content {
            align-items: flex-start;
          }
          
          .breadcrumb-container {
            gap: 0.25rem;
          }
          
          .breadcrumb-item {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
          }
          
          .breadcrumb-icon {
            font-size: 0.9rem;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-outline-white {
            width: 100%;
            justify-content: center;
          }
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

        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          margin: 2rem 0;
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 8px;
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

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 2px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #374151;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        @media (max-width: 768px) {
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

          .btn-outline-white,
          .btn-exit-course {
            width: 100%;
            justify-content: center;
          }


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

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
          
          .course-title {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 480px) {
          .header-main {
            flex-direction: column;
            gap: 1rem;
            text-align: left;
          }

          .header-content {
            align-items: flex-start;
          }
          
          .breadcrumb-container {
            gap: 0.2rem;
          }
          
          .breadcrumb-item {
            padding: 0.3rem 0.5rem;
            font-size: 0.75rem;
          }
          
          .breadcrumb-icon {
            font-size: 0.8rem;
          }
          
          .breadcrumb-separator {
            margin: 0 0.15rem;
          }
          
          .course-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
} 