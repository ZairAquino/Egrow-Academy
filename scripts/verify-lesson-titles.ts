import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Títulos de lecciones definidos en el código
const codeTitles = [
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

async function verifyLessonTitles() {
  console.log('🔍 Verificando títulos de lecciones entre código y base de datos...');

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
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true
      }
    });

    console.log(`📚 Lecciones en BD: ${dbLessons.length}`);
    console.log(`📚 Lecciones en código: ${codeTitles.length}`);

    console.log('\n🔍 Comparando títulos:');
    
    const minLength = Math.min(dbLessons.length, codeTitles.length);
    
    for (let i = 0; i < minLength; i++) {
      const dbTitle = dbLessons[i].title;
      const codeTitle = codeTitles[i];
      const matches = dbTitle === codeTitle;
      
      console.log(`${i + 1}. ${matches ? '✅' : '❌'} | BD: "${dbTitle}" | Código: "${codeTitle}"`);
      
      if (!matches) {
        console.log(`   ⚠️  Diferencia encontrada en lección ${i + 1}`);
      }
    }

    if (dbLessons.length !== codeTitles.length) {
      console.log(`\n⚠️  Diferencia en número de lecciones: BD (${dbLessons.length}) vs Código (${codeTitles.length})`);
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  verifyLessonTitles()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { verifyLessonTitles }; 