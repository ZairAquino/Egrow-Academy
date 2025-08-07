import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProgressDisplay() {
  try {
    console.log('🔍 [DISPLAY TEST] Verificando visualización del progreso...');

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
        title: true
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
            lessonProgress: {
              orderBy: {
                lessonNumber: 'asc'
              }
            }
          }
        }
      }
    });

    if (!enrollment) {
      console.log('❌ Usuario no inscrito en el curso');
      return;
    }

    const progress = enrollment.progress;
    if (!progress) {
      console.log('❌ No hay progreso registrado');
      return;
    }

    console.log('\n📊 Estado actual del progreso:');
    console.log(`   Lección actual: ${progress.currentLesson}`);
    console.log(`   Lecciones completadas: ${progress.completedLessons.length}`);
    console.log(`   Porcentaje de progreso: ${progress.progressPercentage}%`);
    console.log(`   Estado: ${progress.status}`);

    console.log('\n📋 Lecciones completadas:');
    progress.lessonProgress.forEach(lesson => {
      if (lesson.isCompleted) {
        console.log(`   ✅ Lección ${lesson.lessonNumber}: ${lesson.lessonTitle}`);
      }
    });

    console.log('\n📈 Cálculo del progreso:');
    const totalLessons = 19; // Actualizado
    const completedCount = progress.lessonProgress.filter(l => l.isCompleted).length;
    const calculatedPercentage = Math.round((completedCount / totalLessons) * 100);
    
    console.log(`   Total de lecciones: ${totalLessons}`);
    console.log(`   Lecciones completadas: ${completedCount}`);
    console.log(`   Porcentaje calculado: ${calculatedPercentage}%`);
    console.log(`   Porcentaje en BD: ${progress.progressPercentage}%`);
    
    if (calculatedPercentage !== progress.progressPercentage) {
      console.log('⚠️  ADVERTENCIA: El porcentaje en BD no coincide con el calculado');
    } else {
      console.log('✅ Porcentaje correcto');
    }

    console.log('\n🎯 Verificación de visualización:');
    console.log(`   Debería mostrar: "Lección ${progress.currentLesson} de ${totalLessons}"`);
    console.log(`   Debería mostrar: "${completedCount} lecciones completadas. ${calculatedPercentage}% del curso"`);

  } catch (error) {
    console.error('❌ Error verificando progreso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProgressDisplay();
