import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enrollUserAsistentes() {
  try {
    console.log('🎓 Inscribiendo usuario en curso de Asistentes...\n');

    // Buscar el usuario de prueba
    const user = await prisma.user.findFirst({
      where: { email: 'test@egrow.academy' }
    });

    if (!user) {
      console.log('❌ Usuario test@egrow.academy no encontrado');
      return;
    }

    // Buscar el curso de asistentes
    const course = await prisma.course.findFirst({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (!course) {
      console.log('❌ Curso asistentes-virtuales-ia no encontrado');
      return;
    }

    // Verificar si ya está inscrito
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      }
    });

    if (existingEnrollment) {
      console.log('✅ Usuario ya está inscrito en el curso de Asistentes');
      return;
    }

    // Crear la inscripción
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: 'ACTIVE'
      }
    });

    console.log('✅ Usuario inscrito exitosamente en el curso de Asistentes');
    console.log(`📝 Enrollment ID: ${enrollment.id}`);

  } catch (error) {
    console.error('❌ Error al inscribir usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enrollUserAsistentes(); 