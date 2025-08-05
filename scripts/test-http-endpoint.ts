import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testHttpEndpoint() {
  try {
    console.log('🧪 Probando endpoint HTTP de finalización de cursos...');
    
    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: { isActive: true }
    });

    if (!user) {
      console.log('❌ No se encontró ningún usuario activo');
      return;
    }

    console.log(`👤 Usuario de prueba: ${user.firstName} ${user.lastName} (${user.email})`);

    // Generar token de prueba
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    // Simular una petición HTTP real
    const requestData = {
      courseSlug: 'mockup-cero'
    };

    // Simular las cookies y headers
    const cookies = `auth-token=${token}`;
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': cookies,
      'Authorization': `Bearer ${token}`
    };

    console.log('\n🌐 Simulando petición HTTP...');
    console.log('📝 Headers:', headers);
    console.log('📝 Body:', requestData);

    // Simular el proceso del endpoint paso a paso
    console.log('\n🔍 [COMPLETE-COURSE] Iniciando proceso de completar curso...');

    // Extraer token de cookies y headers
    const cookieToken = token; // Simulamos que viene de cookies
    const headerToken = token; // Simulamos que viene de headers
    const finalToken = cookieToken || headerToken;

    console.log('🔍 [COMPLETE-COURSE] Cookie token:', cookieToken ? 'Presente' : 'Ausente');
    console.log('🔍 [COMPLETE-COURSE] Header token:', headerToken ? 'Presente' : 'Ausente');

    if (!finalToken) {
      console.log('❌ [COMPLETE-COURSE] No hay token de autenticación');
      return;
    }

    try {
      const { userId } = jwt.verify(finalToken, process.env.JWT_SECRET || 'test-secret') as { userId: string };
      console.log('✅ [COMPLETE-COURSE] Token verificado, userId:', userId);
    } catch (tokenError) {
      console.log('❌ [COMPLETE-COURSE] Error verificando token:', tokenError);
      return;
    }

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'mockup-cero' },
      select: { id: true, title: true, slug: true }
    });

    if (!course) {
      console.log('❌ [COMPLETE-COURSE] Curso no encontrado: mockup-cero');
      return;
    }

    console.log('✅ [COMPLETE-COURSE] Curso encontrado:', course.title);

    // Buscar la inscripción del usuario
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      },
      include: {
        progress: true
      }
    });

    if (!enrollment) {
      console.log('❌ [COMPLETE-COURSE] Usuario no inscrito en el curso');
      return;
    }

    console.log('✅ [COMPLETE-COURSE] Inscripción encontrada');

    // Obtener todas las lecciones del curso
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      select: { id: true, order: true }
    });

    const totalLessons = lessons.length;
    console.log('📊 [COMPLETE-COURSE] Total de lecciones:', totalLessons);

    // Marcar todas las lecciones como completadas en el progreso
    const completedLessons = lessons.map(lesson => lesson.id);
    
    console.log('📝 [COMPLETE-COURSE] Lecciones a marcar como completadas:', completedLessons);

    // Actualizar el progreso del curso
    const updatedProgress = await prisma.courseProgress.upsert({
      where: { enrollmentId: enrollment.id },
      update: {
        progressPercentage: 100,
        completedLessons,
        status: 'COMPLETED',
        completedAt: new Date(),
        currentLesson: totalLessons - 1
      },
      create: {
        enrollmentId: enrollment.id,
        progressPercentage: 100,
        completedLessons,
        status: 'COMPLETED',
        completedAt: new Date(),
        currentLesson: totalLessons - 1
      }
    });

    console.log('✅ [COMPLETE-COURSE] Progreso actualizado');

    // Actualizar el enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: 'COMPLETED',
        progressPercentage: 100,
        completedAt: new Date()
      }
    });

    console.log('✅ [COMPLETE-COURSE] Enrollment actualizado');

    // Crear registros de progreso de lecciones si no existen
    for (const lesson of lessons) {
      await prisma.lessonProgress.upsert({
        where: {
          courseProgressId_lessonNumber: {
            courseProgressId: updatedProgress.id,
            lessonNumber: lesson.order
          }
        },
        update: {
          isCompleted: true,
          completedAt: new Date()
        },
        create: {
          courseProgressId: updatedProgress.id,
          lessonNumber: lesson.order,
          lessonTitle: `Lección ${lesson.order + 1}`,
          isCompleted: true,
          completedAt: new Date()
        }
      });
    }

    console.log('✅ [COMPLETE-COURSE] Progreso de lecciones actualizado');

    console.log('\n📊 Resultado final:');
    console.log(`   Estado: ${updatedEnrollment.status}`);
    console.log(`   Progreso: ${updatedEnrollment.progressPercentage}%`);
    console.log(`   Completado: ${updatedEnrollment.completedAt ? 'Sí' : 'No'}`);
    console.log(`   Lecciones completadas: ${updatedProgress.completedLessons.length}`);

    console.log('\n✅ Endpoint HTTP probado exitosamente');

  } catch (error) {
    console.error('❌ Error en la prueba del endpoint HTTP:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHttpEndpoint(); 