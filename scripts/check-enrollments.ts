import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnrollments() {
  try {
    console.log('🔍 Verificando inscripciones en la base de datos...\n');

    // Obtener todas las inscripciones
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    console.log(`📚 Total de inscripciones encontradas: ${enrollments.length}\n`);

    if (enrollments.length === 0) {
      console.log('❌ No hay inscripciones en la base de datos');
      return;
    }

    console.log('📋 Lista de inscripciones:');
    enrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. ID: ${enrollment.id}`);
      console.log(`   Usuario: ${enrollment.user.firstName} ${enrollment.user.lastName} (${enrollment.user.email})`);
      console.log(`   Curso: ${enrollment.course.title} (${enrollment.course.slug})`);
      console.log(`   Estado: ${enrollment.status}`);
      console.log(`   Progreso: ${enrollment.progressPercentage}%`);
      console.log(`   Inscrito: ${enrollment.enrolledAt.toLocaleDateString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
checkEnrollments()
  .then(() => {
    console.log('✅ Verificación completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 