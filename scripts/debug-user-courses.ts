import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugUserCourses() {
  try {
    console.log('🔍 [DEBUG] Verificando usuarios y sus cursos...\n');

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    console.log(`📊 [DEBUG] Total de usuarios: ${users.length}\n`);

    for (const user of users) {
      console.log(`👤 [DEBUG] Usuario: ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Membership: ${user.membershipLevel}`);
      console.log(`   - Enrollments: ${user._count.enrollments}`);

      if (user._count.enrollments > 0) {
        // Obtener enrollments detallados
        const enrollments = await prisma.enrollment.findMany({
          where: {
            userId: user.id
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            },
            progress: {
              select: {
                completedLessons: true,
                progressPercentage: true,
                status: true
              }
            }
          }
        });

        console.log(`   📚 [DEBUG] Cursos inscritos:`);
        for (const enrollment of enrollments) {
          console.log(`      - ${enrollment.course.title} (${enrollment.course.slug})`);
          console.log(`        Progreso: ${enrollment.progress?.progressPercentage || 0}%`);
          console.log(`        Status: ${enrollment.progress?.status || 'N/A'}`);
          console.log(`        Lecciones completadas: ${enrollment.progress?.completedLessons?.length || 0}`);
        }
      }
      console.log('');
    }

    // Verificar cursos disponibles
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        isFree: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    console.log(`📚 [DEBUG] Cursos disponibles: ${courses.length}\n`);
    for (const course of courses) {
      console.log(`   - ${course.title} (${course.slug}) - ${course.isFree ? 'GRATIS' : 'PAGO'} - ${course._count.enrollments} inscritos`);
    }

  } catch (error) {
    console.error('❌ [DEBUG] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUserCourses(); 