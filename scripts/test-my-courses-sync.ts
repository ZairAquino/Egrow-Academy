import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMyCoursesSync() {
  console.log('🧪 Probando sincronización de Mis Cursos...\n');

  try {
    // 1. Verificar usuarios con suscripción premium
    const premiumUsers = await prisma.user.findMany({
      where: {
        membershipLevel: 'PREMIUM'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    });

    console.log('👥 Usuarios Premium encontrados:', premiumUsers.length);
    premiumUsers.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
    });

    // 2. Verificar inscripciones
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        },
        course: {
          select: {
            title: true,
            slug: true
          }
        },
        progress: true
      }
    });

    console.log('\n📚 Inscripciones encontradas:', enrollments.length);
    enrollments.forEach(enrollment => {
      const progressPercentage = enrollment.progress?.progressPercentage || 0;
      console.log(`  - ${enrollment.user.firstName} ${enrollment.user.lastName}: ${enrollment.course.title} (${progressPercentage}%)`);
    });

    // 3. Verificar progreso de cursos
    const courseProgress = await prisma.courseProgress.findMany({
      include: {
        enrollment: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            },
            course: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });

    console.log('\n📊 Progreso de cursos encontrado:', courseProgress.length);
    courseProgress.forEach(progress => {
      console.log(`  - ${progress.enrollment.user.firstName} ${progress.enrollment.user.lastName}: ${progress.enrollment.course.title} - ${progress.progressPercentage}%`);
    });

    // 4. Verificar lecciones completadas
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        isCompleted: true
      },
      include: {
        courseProgress: {
          include: {
            enrollment: {
              include: {
                user: {
                  select: {
                    email: true,
                    firstName: true,
                    lastName: true
                  }
                },
                course: {
                  select: {
                    title: true
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('\n✅ Lecciones completadas:', lessonProgress.length);
    const userLessonCounts = new Map<string, number>();
    lessonProgress.forEach(lesson => {
      const userName = `${lesson.courseProgress.enrollment.user.firstName} ${lesson.courseProgress.enrollment.user.lastName}`;
      userLessonCounts.set(userName, (userLessonCounts.get(userName) || 0) + 1);
    });

    userLessonCounts.forEach((count, userName) => {
      console.log(`  - ${userName}: ${count} lecciones completadas`);
    });

    console.log('\n✅ Prueba de sincronización completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`  - Usuarios Premium: ${premiumUsers.length}`);
    console.log(`  - Inscripciones: ${enrollments.length}`);
    console.log(`  - Progreso de cursos: ${courseProgress.length}`);
    console.log(`  - Lecciones completadas: ${lessonProgress.length}`);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMyCoursesSync(); 