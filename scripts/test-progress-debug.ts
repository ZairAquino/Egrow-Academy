import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProgressDebug() {
  try {
    console.log('🔍 [DEBUG] Iniciando prueba de progreso...');

    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      },
      select: {
        id: true,
        email: true
      }
    });

    if (!user) {
      console.log('❌ No se encontró ningún usuario para probar');
      return;
    }

    console.log(`👤 Usuario de prueba: ${user.email} (${user.id})`);

    // Buscar el curso de guiones
    const course = await prisma.course.findFirst({
      where: {
        slug: 'guiones-videos-promocionales-ia'
      },
      select: {
        id: true,
        title: true,
        slug: true
      }
    });

    if (!course) {
      console.log('❌ No se encontró el curso de guiones');
      return;
    }

    console.log(`📚 Curso: ${course.title} (${course.id})`);

    // Buscar la inscripción del usuario
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      },
      include: {
        progress: {
          include: {
            lessonProgress: true
          }
        }
      }
    });

    if (!enrollment) {
      console.log('❌ El usuario no está inscrito en el curso');
      return;
    }

    console.log('✅ Usuario inscrito encontrado');
    console.log(`📊 Progreso actual:`);
    console.log(`   - Lección actual: ${enrollment.progress?.currentLesson || 0}`);
    console.log(`   - Lecciones completadas: ${enrollment.progress?.completedLessons?.length || 0}`);
    console.log(`   - Porcentaje: ${enrollment.progress?.progressPercentage || 0}%`);
    console.log(`   - Estado: ${enrollment.progress?.status || 'N/A'}`);
    
    if (enrollment.progress?.completedLessons) {
      console.log(`   - IDs completados: ${enrollment.progress.completedLessons.join(', ')}`);
    }

    if (enrollment.progress?.lessonProgress) {
      console.log(`   - Progreso de lecciones individuales: ${enrollment.progress.lessonProgress.length} registros`);
      enrollment.progress.lessonProgress.forEach((lp, index) => {
        console.log(`     ${index + 1}. Lección ${lp.lessonNumber}: ${lp.lessonTitle} - ${lp.isCompleted ? '✅ Completada' : '⏳ Pendiente'}`);
      });
    }

    // Verificar si hay inconsistencias
    const totalLessons = 15; // Para el curso de guiones
    const completedCount = enrollment.progress?.completedLessons?.length || 0;
    const expectedPercentage = Math.round((completedCount / totalLessons) * 100);
    const actualPercentage = enrollment.progress?.progressPercentage || 0;

    console.log(`\n🔍 Verificación de consistencia:`);
    console.log(`   - Lecciones completadas: ${completedCount}/${totalLessons}`);
    console.log(`   - Porcentaje esperado: ${expectedPercentage}%`);
    console.log(`   - Porcentaje actual: ${actualPercentage}%`);
    
    if (expectedPercentage !== actualPercentage) {
      console.log(`⚠️ INCONSISTENCIA DETECTADA: Los porcentajes no coinciden`);
    } else {
      console.log(`✅ Los porcentajes coinciden correctamente`);
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProgressDebug();
