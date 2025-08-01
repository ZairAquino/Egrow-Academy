import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Títulos correctos según el código
const correctTitles = [
  '1.1 Introducción a los Asistentes Virtuales con IA',
  '1.2 Beneficios Empresariales Clave',
  '1.3 Comparación: Google Gemini vs ChatGPT',
  '1.4 Planificación Estratégica',
  '2.1 Preparación de Documentación Empresarial',
  '2.2 Configuración de Procesos',
  '2.3 Establecimiento de Metodologías',
  '3.1 Introducción a Google Gemini',
  '3.2 Configuración de Gemini',
  '3.3 Creación de Asistente con Gemini',
  '3.4 Optimización de Prompts',
  '4.1 Introducción a ChatGPT',
  '4.2 Configuración de ChatGPT',
  '4.3 Creación de Asistente con ChatGPT',
  '4.4 GPTs Personalizados',
  '5.1 Optimización de Rendimiento',
  '5.2 Pruebas y Validación',
  '5.3 Mantenimiento Continuo',
  '5.4 Escalabilidad y Mejoras',
  '5.5 Monitoreo y Analytics',
  '5.6 Conclusiones y Próximos Pasos'
];

async function fixLessonTitles() {
  console.log('🔧 Corrigiendo títulos de lecciones en la base de datos...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso en la base de datos
    const course = await prisma.course.findUnique({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log(`📋 Curso encontrado: "${course.title}"`);

    // Obtener todas las lecciones del curso
    const dbLessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' }
    });

    console.log(`📚 Lecciones encontradas: ${dbLessons.length}`);

    // Actualizar cada lección con el título correcto
    for (let i = 0; i < dbLessons.length && i < correctTitles.length; i++) {
      const lesson = dbLessons[i];
      const correctTitle = correctTitles[i];
      
      if (lesson.title !== correctTitle) {
        console.log(`🔄 Actualizando lección ${i + 1}: "${lesson.title}" → "${correctTitle}"`);
        
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: { title: correctTitle }
        });
        
        console.log(`✅ Lección ${i + 1} actualizada`);
      } else {
        console.log(`✅ Lección ${i + 1} ya tiene el título correcto`);
      }
    }

    // Verificar que todas las lecciones estén actualizadas
    const updatedLessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      select: { title: true, order: true }
    });

    console.log('\n📊 Verificación final:');
    updatedLessons.forEach((lesson, index) => {
      const expectedTitle = correctTitles[index];
      const matches = lesson.title === expectedTitle;
      console.log(`${index + 1}. ${matches ? '✅' : '❌'} | "${lesson.title}"`);
    });

    console.log('\n🎉 Títulos corregidos exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  fixLessonTitles()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { fixLessonTitles }; 