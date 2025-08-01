import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCurrentUser() {
  console.log('🔍 [DEBUG] Verificando usuario actual...');

  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar sesiones activas
    console.log('\n🔐 Sesiones activas:');
    const activeSessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true
          }
        }
      },
      orderBy: {
        expiresAt: 'desc'
      },
      take: 10
    });

    activeSessions.forEach(session => {
      console.log(`- ${session.user.firstName} (${session.user.email}) - Expira: ${session.expiresAt}`);
    });

    // Verificar enrollments del usuario Test en asistentes-virtuales-ia
    console.log('\n📝 Verificando enrollment de Test en asistentes-virtuales-ia:');
    
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (testUser) {
      const course = await prisma.course.findFirst({
        where: { slug: 'asistentes-virtuales-ia' }
      });

      if (course) {
        const enrollment = await prisma.enrollment.findFirst({
          where: {
            userId: testUser.id,
            courseId: course.id
          }
        });

        console.log(`Usuario Test inscrito en asistentes-virtuales-ia: ${!!enrollment}`);
        
        if (enrollment) {
          console.log(`Estado: ${enrollment.status}`);
          console.log(`Progreso: ${enrollment.progressPercentage}%`);
          
          // Verificar si hay progreso
          const progress = await prisma.courseProgress.findFirst({
            where: {
              enrollmentId: enrollment.id
            }
          });
          
          console.log(`Progreso creado: ${!!progress}`);
        }
      }
    }

    // Verificar todos los enrollments en asistentes-virtuales-ia
    console.log('\n📚 Todos los enrollments en asistentes-virtuales-ia:');
    const course = await prisma.course.findFirst({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (course) {
      const enrollments = await prisma.enrollment.findMany({
        where: {
          courseId: course.id
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true
            }
          }
        }
      });

      enrollments.forEach(enrollment => {
        console.log(`- ${enrollment.user.firstName} (${enrollment.user.email}) - Estado: ${enrollment.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  checkCurrentUser()
    .then(() => {
      console.log('\n✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { checkCurrentUser }; 