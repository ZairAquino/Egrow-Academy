import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugEnrollment() {
  console.log('🔍 [DEBUG] Iniciando diagnóstico de enrollment...');

  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar variables de entorno
    console.log('\n🔧 Variables de entorno:');
    console.log('JWT_SECRET configurado:', !!process.env.JWT_SECRET);
    console.log('DATABASE_URL configurado:', !!process.env.DATABASE_URL);

    // Verificar cursos existentes
    console.log('\n📚 Cursos en la base de datos:');
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true
      }
    });

    courses.forEach(course => {
      console.log(`- ${course.title} (${course.slug}) - ID: ${course.id}`);
    });

    // Verificar usuarios existentes
    console.log('\n👥 Usuarios en la base de datos:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true
      },
      take: 5
    });

    users.forEach(user => {
      console.log(`- ${user.firstName} (${user.email}) - ID: ${user.id}`);
    });

    // Verificar enrollments existentes
    console.log('\n📝 Enrollments existentes:');
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true
          }
        },
        course: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      take: 10
    });

    enrollments.forEach(enrollment => {
      console.log(`- ${enrollment.user.firstName} inscrito en ${enrollment.course.title}`);
    });

    // Verificar sesiones activas
    console.log('\n🔐 Sesiones activas:');
    const sessions = await prisma.session.findMany({
      where: {
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true
          }
        }
      },
      take: 5
    });

    sessions.forEach(session => {
      console.log(`- Sesión de ${session.user.firstName} expira: ${session.expiresAt}`);
    });

    // Simular verificación de enrollment
    if (users.length > 0 && courses.length > 0) {
      console.log('\n🧪 Simulando verificación de enrollment...');
      
      const testUser = users[0];
      const testCourse = courses[0];
      
      console.log(`Usuario de prueba: ${testUser.firstName} (${testUser.id})`);
      console.log(`Curso de prueba: ${testCourse.title} (${testCourse.id})`);
      
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: testUser.id,
          courseId: testCourse.id
        }
      });
      
      console.log(`Enrollment encontrado: ${!!enrollment}`);
      
      if (enrollment) {
        console.log(`Estado: ${enrollment.status}`);
        console.log(`Progreso: ${enrollment.progressPercentage}%`);
      }
    }

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  debugEnrollment()
    .then(() => {
      console.log('\n✅ Diagnóstico completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { debugEnrollment }; 