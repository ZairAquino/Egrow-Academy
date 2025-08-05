import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMockupsCourse() {
  console.log('🔧 Creando/actualizando curso "Crea Mockups con IA desde cero"...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso en la base de datos
    const existingCourse = await prisma.course.findUnique({
      where: { slug: 'mockups-ia-desde-cero' }
    });

    if (existingCourse) {
      console.log(`📋 Curso encontrado: "${existingCourse.title}"`);
      console.log(`📊 Lecciones actuales en BD: ${existingCourse.lessonsCount}`);
      
      // Actualizar el curso
      const updatedCourse = await prisma.course.update({
        where: { slug: 'mockups-ia-desde-cero' },
        data: {
          title: 'Crea Mockups con IA desde cero',
          description: 'Aprende a crear mockups profesionales desde cero utilizando herramientas de inteligencia artificial. Domina las técnicas modernas de diseño y prototipado con IA para llevar tus ideas al siguiente nivel.',
          shortDescription: 'Crea mockups profesionales desde cero usando herramientas de IA y técnicas avanzadas de diseño',
          imageUrl: '/images/mockups-ia.png',
          durationHours: 3,
          difficulty: 'BEGINNER',
          isFree: true,
          requiresAuth: false,
          status: 'PUBLISHED',
          category: 'HABILIDADES_IRREMPLAZABLES',
          lessonsCount: 15
        }
      });

      console.log(`✅ Curso actualizado:`);
      console.log(`   - Título: ${updatedCourse.title}`);
      console.log(`   - Lecciones: ${updatedCourse.lessonsCount}`);
      console.log(`   - Duración: ${updatedCourse.durationHours} horas`);
      console.log(`   - Estado: ${updatedCourse.status}`);
      console.log(`   - Es gratuito: ${updatedCourse.isFree}`);
    } else {
      console.log('❌ Curso "mockups-ia-desde-cero" no encontrado en la base de datos');
      console.log('💡 Creando nuevo curso...');
      
      const newCourse = await prisma.course.create({
        data: {
          title: 'Crea Mockups con IA desde cero',
          slug: 'mockups-ia-desde-cero',
          description: 'Aprende a crear mockups profesionales desde cero utilizando herramientas de inteligencia artificial. Domina las técnicas modernas de diseño y prototipado con IA para llevar tus ideas al siguiente nivel.',
          shortDescription: 'Crea mockups profesionales desde cero usando herramientas de IA y técnicas avanzadas de diseño',
          imageUrl: '/images/mockups-ia.png',
          price: 0,
          isFree: true,
          requiresAuth: false,
          difficulty: 'BEGINNER',
          durationHours: 3,
          lessonsCount: 15,
          studentsCount: 0,
          rating: 0,
          status: 'PUBLISHED',
          category: 'HABILIDADES_IRREMPLAZABLES'
        }
      });

      console.log(`✅ Curso creado:`);
      console.log(`   - Título: ${newCourse.title}`);
      console.log(`   - Slug: ${newCourse.slug}`);
      console.log(`   - Lecciones: ${newCourse.lessonsCount}`);
      console.log(`   - Duración: ${newCourse.durationHours} horas`);
      console.log(`   - Es gratuito: ${newCourse.isFree}`);
      console.log(`   - Categoría: ${newCourse.category}`);
    }

    console.log('\n🎉 Operación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la operación:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  updateMockupsCourse()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { updateMockupsCourse };