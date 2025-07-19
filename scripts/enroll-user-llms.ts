import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enrollUserInLLMs() {
  try {
    console.log('🎓 Inscribiendo usuario en curso de LLMs...');

    // Buscar el usuario por email
    const user = await prisma.user.findFirst({
      where: {
        email: 'aquinozair3@gmail.com' // Cambiar por el email del usuario
      }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Verificar si ya está inscrito
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: 'introduccion-llms'
      }
    });

    if (existingEnrollment) {
      console.log('✅ Usuario ya está inscrito en el curso');
      return;
    }

    // Crear la inscripción
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: 'introduccion-llms',
        enrolledAt: new Date(),
        status: 'IN_PROGRESS',
        progressPercentage: 0
      }
    });

    console.log('✅ Usuario inscrito exitosamente en el curso de LLMs');
    console.log('📊 Detalles de la inscripción:', {
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt
    });

  } catch (error) {
    console.error('❌ Error inscribiendo usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

enrollUserInLLMs(); 