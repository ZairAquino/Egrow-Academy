import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCourseEnrollment() {
  try {
    console.log('🔍 Verificando curso vibe-coding-claude-cursor...');
    
    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'vibe-coding-claude-cursor' },
      include: {
        enrollments: true
      }
    });

    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log('✅ Curso encontrado:', {
      id: course.id,
      title: course.title,
      slug: course.slug,
      status: course.status,
      isFree: course.isFree,
      enrollmentsCount: course.enrollments.length
    });

    // Verificar inscripciones
    if (course.enrollments.length > 0) {
      console.log('📊 Inscripciones encontradas:');
      course.enrollments.forEach((enrollment, index) => {
        console.log(`  ${index + 1}. User ID: ${enrollment.userId}, Status: ${enrollment.status}, Created: ${enrollment.createdAt}`);
      });
    } else {
      console.log('📊 No hay inscripciones para este curso');
    }

    // Verificar usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      },
      take: 5
    });

    console.log('👥 Usuarios disponibles (primeros 5):');
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ID: ${user.id}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourseEnrollment();
