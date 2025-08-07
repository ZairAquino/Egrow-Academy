import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLessonOrder() {
  try {
    console.log('🔧 Corrigiendo orden de lecciones...');
    
    // Obtener el curso
    const course = await prisma.course.findUnique({
      where: {
        slug: 'guiones-videos-promocionales-ia'
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log(`✅ Curso encontrado: ${course.title}`);
    console.log(`📚 Lecciones a corregir: ${course.lessons.length}`);

    // Definir el orden correcto de las lecciones
    const correctOrder = [
      { title: '1.1 Introducción al Copywriting Digital', order: 1 },
      { title: '1.2 Estructura de un Guión Efectivo', order: 2 },
      { title: '1.3 Psicología de la Persuasión', order: 3 },
      { title: '1.4 Adaptación para Diferentes Audiencias', order: 4 },
      { title: '2.1 Introducción a ChatGPT para Guiones', order: 5 },
      { title: '2.2 Prompts Efectivos para Guiones', order: 6 },
      { title: '2.3 Claude AI para Refinamiento', order: 7 },
      { title: '2.4 Copy.ai para Variaciones', order: 8 },
      { title: '3.1 Estructura AIDA para Videos Promocionales', order: 9 },
      { title: '3.2 Hook y Apertura Impactante', order: 10 },
      { title: '3.3 Desarrollo del Beneficio Principal', order: 11 },
      { title: '3.4 Llamadas a la Acción que Convierten', order: 12 },
      { title: '4.1 Adaptación para Instagram', order: 13 },
      { title: '4.2 Guiones para TikTok', order: 14 },
      { title: '4.3 Contenido para LinkedIn', order: 15 },
      { title: '4.4 Adaptación para YouTube', order: 16 },
      { title: '5.1 A/B Testing de Guiones', order: 17 },
      { title: '5.2 Métricas de Rendimiento', order: 18 },
      { title: '5.3 Optimización Continua', order: 19 },
      { title: 'MÓDULO 1: FUNDAMENTOS DEL GUIÓN DIGITAL', order: 20 },
      { title: 'MÓDULO 2: HERRAMIENTAS DE IA PARA GUIONES', order: 21 },
      { title: 'MÓDULO 3: GUIONES PARA VIDEOS PROMOCIONALES', order: 22 },
      { title: 'MÓDULO 4: GUIONES PARA REDES SOCIALES', order: 23 },
      { title: 'MÓDULO 5: OPTIMIZACIÓN Y ANÁLISIS', order: 24 }
    ];

    // Actualizar el orden de las lecciones
    for (const lessonInfo of correctOrder) {
      const lesson = course.lessons.find(l => l.title === lessonInfo.title);
      if (lesson) {
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: { order: lessonInfo.order }
        });
        console.log(`✅ Actualizado: ${lessonInfo.title} -> Orden ${lessonInfo.order}`);
      } else {
        console.log(`⚠️ No encontrada: ${lessonInfo.title}`);
      }
    }

    console.log('\n🎯 Orden de lecciones corregido exitosamente');

    // Verificar el resultado
    const updatedCourse = await prisma.course.findUnique({
      where: {
        slug: 'guiones-videos-promocionales-ia'
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (updatedCourse) {
      console.log('\n📋 Nuevo orden de lecciones:');
      updatedCourse.lessons.forEach((lesson, index) => {
        console.log(`${index + 1}. ${lesson.title} (Orden: ${lesson.order})`);
      });
    }

  } catch (error) {
    console.error('❌ Error al corregir orden de lecciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixLessonOrder();
