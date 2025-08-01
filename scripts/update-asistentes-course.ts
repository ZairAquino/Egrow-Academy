import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAsistentesCourse() {
  console.log('🔧 Actualizando información del curso "Asistentes virtuales con IA"...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso en la base de datos
    const existingCourse = await prisma.course.findUnique({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (existingCourse) {
      console.log(`📋 Curso encontrado: "${existingCourse.title}"`);
      console.log(`📊 Lecciones actuales en BD: ${existingCourse.lessonsCount}`);
      
      // Actualizar el número de lecciones a 21
      const updatedCourse = await prisma.course.update({
        where: { slug: 'asistentes-virtuales-ia' },
        data: {
          lessonsCount: 21,
          title: 'Asistentes virtuales con IA',
          description: 'Descubre cómo crear y configurar asistentes virtuales inteligentes para automatizar tareas y mejorar la productividad en tu organización. Domina Google Gemini, ChatGPT y otras herramientas de IA.',
          shortDescription: 'Domina la creación de asistentes virtuales personalizados para potenciar tu negocio utilizando Google Gemini y ChatGPT',
          durationHours: 4,
          difficulty: 'INTERMEDIATE',
          isFree: true,
          requiresAuth: false,
          status: 'PUBLISHED'
        }
      });

      console.log(`✅ Curso actualizado:`);
      console.log(`   - Título: ${updatedCourse.title}`);
      console.log(`   - Lecciones: ${updatedCourse.lessonsCount}`);
      console.log(`   - Duración: ${updatedCourse.durationHours} horas`);
      console.log(`   - Estado: ${updatedCourse.status}`);
    } else {
      console.log('❌ Curso "asistentes-virtuales-ia" no encontrado en la base de datos');
      console.log('💡 Creando nuevo curso...');
      
      const newCourse = await prisma.course.create({
        data: {
          id: 'asistentes-virtuales-ia',
          title: 'Asistentes virtuales con IA',
          slug: 'asistentes-virtuales-ia',
          description: 'Descubre cómo crear y configurar asistentes virtuales inteligentes para automatizar tareas y mejorar la productividad en tu organización. Domina Google Gemini, ChatGPT y otras herramientas de IA.',
          shortDescription: 'Domina la creación de asistentes virtuales personalizados para potenciar tu negocio utilizando Google Gemini y ChatGPT',
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
          price: 0,
          isFree: true,
          requiresAuth: false,
          difficulty: 'INTERMEDIATE',
          durationHours: 4,
          lessonsCount: 21,
          studentsCount: 0,
          rating: 0,
          status: 'PUBLISHED'
        }
      });

      console.log(`✅ Curso creado:`);
      console.log(`   - Título: ${newCourse.title}`);
      console.log(`   - Lecciones: ${newCourse.lessonsCount}`);
      console.log(`   - Duración: ${newCourse.durationHours} horas`);
    }

    console.log('\n🎉 Actualización completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  updateAsistentesCourse()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { updateAsistentesCourse }; 