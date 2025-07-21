import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testProgressWithToken() {
  try {
    console.log('🔍 [TEST] Probando API de progreso con token generado...\n');

    const userId = 'cmdaqz7xn0000lb04edu7763y';
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    // Generar token
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
    console.log('✅ Token generado:', token.substring(0, 50) + '...');

    // Simular la lógica exacta de la API
    console.log('\n1️⃣ Simulando lógica de la API...');
    
    const courseId = 'desarrollo-web-fullstack';
    let actualCourseId = courseId;
    
    if (!courseId.includes('-')) {
      console.log('❌ La lógica dice que courseId no incluye "-"');
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
    } else {
      console.log('❌ Usuario no inscrito - este es el problema!');
      return;
    }

    console.log('\n3️⃣ Verificando progreso...');
    
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

    // Simular la respuesta que debería devolver la API
    console.log('\n4️⃣ Respuesta que debería devolver la API:');
    const response = {
      currentLesson: progress?.currentLesson || 0,
      completedLessons: progress?.completedLessons || [],
      progressPercentage: progress?.progressPercentage || 0,
      status: progress?.status || 'NOT_STARTED',
      totalTimeSpent: progress?.totalTimeSpent || 0,
      totalSessions: progress?.totalSessions || 0,
      averageSessionTime: progress?.averageSessionTime || 0,
      longestSession: progress?.longestSession || 0,
      startedAt: progress?.startedAt?.toISOString() || new Date().toISOString(),
      lastAccessed: progress?.lastAccessed?.toISOString() || new Date().toISOString(),
      completedAt: progress?.completedAt?.toISOString() || null,
      lessonProgress: progress?.lessonProgress || [],
      totalLessons: 5
    };

    console.log('✅ Respuesta simulada:', response);

  } catch (error) {
    console.error('💥 Error en test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProgressWithToken(); 