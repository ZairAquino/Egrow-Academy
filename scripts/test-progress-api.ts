import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProgressAPI() {
  try {
    console.log('🔍 [TEST] Probando lógica de la API de progreso...\n');

    const courseId = 'desarrollo-web-fullstack';
    const userId = 'cmdaqz7xn0000lb04edu7763y';

    console.log('1️⃣ Verificando lógica de búsqueda de curso...');
    
    // Simular la lógica de la API
    let actualCourseId = courseId;
    if (!courseId.includes('-')) {
      console.log('❌ La lógica dice que courseId no incluye "-"');
      console.log('courseId:', courseId);
      console.log('courseId.includes("-"):', courseId.includes('-'));
    } else {
      console.log('✅ La lógica dice que courseId SÍ incluye "-"');
    }

    // Buscar por slug
    const course = await prisma.course.findFirst({
      where: { slug: courseId }
    });
    
    if (course) {
      actualCourseId = course.id;
      console.log('✅ Curso encontrado por slug:', course.title, 'ID:', actualCourseId);
    } else {
      console.log('❌ Curso no encontrado con slug:', courseId);
      return;
    }

    console.log('\n2️⃣ Verificando inscripción...');
    
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: actualCourseId
      }
    });
    
    console.log('Inscripción encontrada:', !!enrollment);
    if (enrollment) {
      console.log('Detalles de inscripción:', {
        id: enrollment.id,
        status: enrollment.status,
        progressPercentage: enrollment.progressPercentage
      });
    }

    console.log('\n3️⃣ Verificando progreso...');
    
    if (enrollment) {
      const progress = await prisma.courseProgress.findFirst({
        where: {
          enrollmentId: enrollment.id
        },
        include: {
          lessonProgress: {
            orderBy: {
              lessonNumber: 'asc'
            }
          }
        }
      });
      
      console.log('Progreso encontrado:', !!progress);
      if (progress) {
        console.log('Detalles de progreso:', {
          currentLesson: progress.currentLesson,
          progressPercentage: progress.progressPercentage,
          status: progress.status,
          lessonProgressCount: progress.lessonProgress.length
        });
      }
    }

  } catch (error) {
    console.error('💥 Error en test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProgressAPI(); 