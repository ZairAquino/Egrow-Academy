import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createPremiumEnrollment() {
  try {
    console.log('🔍 Creando inscripción premium...');
    
    // Buscar el usuario premium
    const user = await prisma.user.findUnique({
      where: { email: 'luisdavid.ls47@gmail.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    });

    if (!user) {
      console.log('❌ Usuario premium no encontrado');
      return;
    }

    console.log('👤 Usuario premium encontrado:', {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      membershipLevel: user.membershipLevel
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
      slug: course.slug,
      isFree: course.isFree,
      price: course.price
    });

    // Verificar si ya existe una inscripción
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      }
    });

    if (existingEnrollment) {
      console.log('✅ Usuario premium ya está inscrito en el curso');
      return;
    }

    // Crear la inscripción premium
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: 'ACTIVE',
        enrolledAt: new Date()
      }
    });

    console.log('✅ Inscripción premium creada exitosamente:', {
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

createPremiumEnrollment();
