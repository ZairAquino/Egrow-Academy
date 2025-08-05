import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAsistentesImage() {
  console.log('🖼️ Actualizando imagen del curso "Asistentes virtuales con IA"...');

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
      console.log(`🖼️ Imagen actual: ${existingCourse.imageUrl}`);
      
      // Actualizar la imagen
      const updatedCourse = await prisma.course.update({
        where: { slug: 'asistentes-virtuales-ia' },
        data: {
          imageUrl: '/images/18.png'
        }
      });

      console.log(`✅ Imagen actualizada:`);
      console.log(`   - Nueva imagen: ${updatedCourse.imageUrl}`);
    } else {
      console.log('❌ Curso "asistentes-virtuales-ia" no encontrado en la base de datos');
    }

    console.log('\n🎉 Actualización de imagen completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  updateAsistentesImage()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { updateAsistentesImage }; 