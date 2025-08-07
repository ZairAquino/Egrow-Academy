import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestEnrollment() {
  try {
    console.log('🔍 Creando inscripción de prueba...');
    
    // Buscar el primer usuario disponible
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }

    console.log('👤 Usuario encontrado:', {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`
    });

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'vibe-coding-claude-cursor' }
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log('📚 Curso encontrado:', {
      id: course.id,
      title: course.title,
      slug: course.slug
    });

    // Verificar si ya existe una inscripción
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
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
        courseId: course.id,
        status: 'ACTIVE',
        enrolledAt: new Date()
      }
    });

    console.log('✅ Inscripción creada exitosamente:', {
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestEnrollment();
