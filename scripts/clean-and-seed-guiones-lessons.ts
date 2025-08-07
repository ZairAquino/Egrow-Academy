import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAndSeedGuionesLessons() {
  try {
    console.log('🧹 Limpiando lecciones duplicadas del curso de guiones...');

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'guiones-videos-promocionales-ia' }
    });

    if (!course) {
      console.error('❌ Curso no encontrado');
      return;
    }

    console.log(`✅ Curso encontrado: ${course.title} (ID: ${course.id})`);

    // Eliminar todas las lecciones existentes del curso
    const deletedLessons = await prisma.lesson.deleteMany({
      where: { courseId: course.id }
    });

    console.log(`🗑️ Eliminadas ${deletedLessons.count} lecciones duplicadas`);

    // Crear las 5 lecciones correctas
    console.log('\n📚 Creando las 5 lecciones correctas...');

    const lessons = [
      {
        title: 'MÓDULO 1: FUNDAMENTOS DEL GUIÓN DIGITAL',
        order: 1,
        duration: 70,
        content: `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">📝 MÓDULO 1: FUNDAMENTOS DEL GUIÓN DIGITAL</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Aprende los principios básicos de la redacción de guiones para contenido digital</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🎯 ¿Qué aprenderás en este módulo?</h3>
            <ul>
              <li>Fundamentos de copywriting para videos promocionales</li>
              <li>Estructuras de guiones que convierten</li>
              <li>Técnicas de persuasión en contenido audiovisual</li>
              <li>Adaptación de guiones para diferentes redes sociales</li>
            </ul>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📋 Contenido del Módulo</h3>
            <ol>
              <li><strong>1.1 ¿Qué es un guión digital?</strong> - Conceptos básicos</li>
              <li><strong>1.2 Estructura básica de un guión efectivo</strong> - Hook, desarrollo, CTA</li>
              <li><strong>1.3 Diferencias entre plataformas</strong> - YouTube, TikTok, Instagram</li>
            </ol>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🎯 Objetivos del Módulo</h3>
            <p>Al finalizar este módulo serás capaz de:</p>
            <ul>
              <li>Entender los fundamentos del copywriting digital</li>
              <li>Crear estructuras de guiones efectivas</li>
              <li>Adaptar contenido para diferentes plataformas</li>
              <li>Aplicar técnicas de persuasión básicas</li>
            </ul>
          </div>
        `
      },
      {
        title: 'MÓDULO 2: HERRAMIENTAS DE IA PARA GUIONES',
        order: 2,
        duration: 65,
        content: `
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; color: #8b4513; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">🤖 MÓDULO 2: HERRAMIENTAS DE IA PARA GUIONES</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Domina ChatGPT, Claude y otras herramientas de IA para crear guiones efectivos</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🎯 ¿Qué aprenderás en este módulo?</h3>
            <ul>
              <li>Dominio de ChatGPT y Claude para creación de guiones</li>
              <li>Prompts efectivos para diferentes tipos de contenido</li>
              <li>Configuración y buenas prácticas de IA</li>
              <li>Optimización de llamadas a la acción</li>
            </ul>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📋 Contenido del Módulo</h3>
            <ol>
              <li><strong>2.1 Introducción a herramientas de IA</strong> - ChatGPT, Claude, Copy.ai</li>
              <li><strong>2.2 Prompts efectivos para guiones</strong> - Técnicas de prompting</li>
              <li><strong>2.3 Configuración y buenas prácticas</strong> - Optimización de resultados</li>
            </ol>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🎯 Objetivos del Módulo</h3>
            <p>Al finalizar este módulo serás capaz de:</p>
            <ul>
              <li>Utilizar ChatGPT y Claude para crear guiones</li>
              <li>Escribir prompts efectivos para diferentes objetivos</li>
              <li>Configurar herramientas de IA para mejores resultados</li>
              <li>Optimizar el proceso creativo con IA</li>
            </ul>
          </div>
        `
      },
      {
        title: 'MÓDULO 3: GUIONES PARA VIDEOS PROMOCIONALES',
        order: 3,
        duration: 75,
        content: `
          <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 20px; border-radius: 10px; color: #2d3748; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">🎬 MÓDULO 3: GUIONES PARA VIDEOS PROMOCIONALES</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Crea guiones persuasivos para videos promocionales y publicitarios usando AIDA</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🎯 ¿Qué aprenderás en este módulo?</h3>
            <ul>
              <li>Estructura AIDA aplicada al guión</li>
              <li>Adaptación al tipo de audiencia</li>
              <li>Técnicas de persuasión avanzadas</li>
              <li>Análisis y mejora de rendimiento de contenido</li>
            </ul>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📋 Contenido del Módulo</h3>
            <ol>
              <li><strong>3.1 Estructura AIDA aplicada al guión</strong> - Attention, Interest, Desire, Action</li>
              <li><strong>3.2 Adaptación al tipo de audiencia</strong> - Buyer personas</li>
              <li><strong>3.3 Técnicas de persuasión</strong> - Psicología del consumidor</li>
            </ol>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🎯 Objetivos del Módulo</h3>
            <p>Al finalizar este módulo serás capaz de:</p>
            <ul>
              <li>Aplicar la estructura AIDA en guiones promocionales</li>
              <li>Adaptar contenido para diferentes audiencias</li>
              <li>Utilizar técnicas de persuasión efectivas</li>
              <li>Crear guiones que convierten</li>
            </ul>
          </div>
        `
      },
      {
        title: 'MÓDULO 4: GUIONES PARA REDES SOCIALES',
        order: 4,
        duration: 100,
        content: `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">📱 MÓDULO 4: GUIONES PARA REDES SOCIALES</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Adapta tus guiones para diferentes plataformas de redes sociales</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🎯 ¿Qué aprenderás en este módulo?</h3>
            <ul>
              <li>Guiones para redes sociales específicas</li>
              <li>Guiones para YouTube</li>
              <li>Guiones para TikTok</li>
              <li>Proyecto final integrador</li>
            </ul>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📋 Contenido del Módulo</h3>
            <ol>
              <li><strong>4.1 Guiones para redes sociales</strong> - Instagram, Facebook, LinkedIn</li>
              <li><strong>4.2 Guiones para YouTube</strong> - Shorts, videos largos</li>
              <li><strong>4.3 Guiones para TikTok</strong> - Trends, viralidad</li>
              <li><strong>4.4 Proyecto final integrador</strong> - Aplicación práctica</li>
            </ol>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🎯 Objetivos del Módulo</h3>
            <p>Al finalizar este módulo serás capaz de:</p>
            <ul>
              <li>Crear guiones optimizados para cada plataforma</li>
              <li>Adaptar contenido para diferentes formatos</li>
              <li>Maximizar engagement en redes sociales</li>
              <li>Aplicar todo lo aprendido en un proyecto final</li>
            </ul>
          </div>
        `
      },
      {
        title: 'MÓDULO 5: OPTIMIZACIÓN Y ANÁLISIS',
        order: 5,
        duration: 45,
        content: `
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; color: #8b4513; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">📊 MÓDULO 5: OPTIMIZACIÓN Y ANÁLISIS</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Optimiza y analiza el rendimiento de tus guiones para mejorar conversiones</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🎯 ¿Qué aprenderás en este módulo?</h3>
            <ul>
              <li>Métricas clave para evaluar guiones</li>
              <li>A/B testing de guiones</li>
              <li>Mejora continua del contenido</li>
              <li>Automatización del proceso creativo con IA</li>
            </ul>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📋 Contenido del Módulo</h3>
            <ol>
              <li><strong>5.1 Métricas clave para evaluar guiones</strong> - KPIs importantes</li>
              <li><strong>5.2 A/B testing de guiones</strong> - Optimización basada en datos</li>
              <li><strong>5.3 Mejora continua del contenido</strong> - Iteración y evolución</li>
            </ol>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🎯 Objetivos del Módulo</h3>
            <p>Al finalizar este módulo serás capaz de:</p>
            <ul>
              <li>Medir la efectividad de tus guiones</li>
              <li>Realizar pruebas A/B para optimizar</li>
              <li>Implementar mejoras continuas</li>
              <li>Automatizar procesos creativos con IA</li>
            </ul>
          </div>
        `
      }
    ];

    // Crear las lecciones
    for (const lessonData of lessons) {
      await prisma.lesson.create({
        data: {
          title: lessonData.title,
          content: lessonData.content,
          order: lessonData.order,
          duration: lessonData.duration,
          courseId: course.id
        }
      });
      console.log(`✅ Creada: ${lessonData.title}`);
    }

    // Actualizar el contador de lecciones en el curso
    await prisma.course.update({
      where: { id: course.id },
      data: { lessonsCount: lessons.length }
    });

    console.log(`\n🎉 ¡Completado! Se crearon ${lessons.length} lecciones para el curso de guiones`);
    console.log(`📊 Contador de lecciones actualizado: ${lessons.length}`);

  } catch (error) {
    console.error('❌ Error limpiando y creando lecciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndSeedGuionesLessons();
