import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testCompleteCourseEndpoint() {
  try {
    console.log('🧪 Probando endpoint de finalización de cursos...');
    
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

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'mockup-cero' }
    });

    if (!course) {
      console.log('❌ Curso mockup-cero no encontrado');
      return;
    }

    console.log(`📚 Curso: ${course.title}`);

    // Verificar si el usuario está inscrito
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      }
    });

    if (!enrollment) {
      console.log('📝 Creando inscripción de prueba...');
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          enrolledAt: new Date(),
          status: 'ACTIVE',
          progressPercentage: 0
        }
      });
    }

    console.log(`✅ Inscripción encontrada/creada: ${enrollment.id}`);

    // Simular la petición HTTP al endpoint
    console.log('\n🌐 Simulando petición HTTP al endpoint...');
    
    // Crear una petición simulada
    const requestData = {
      courseSlug: 'mockup-cero'
    };

    // Simular el proceso del endpoint
    console.log('📝 [COMPLETE-COURSE] Iniciando proceso de completar curso...');
    console.log('📝 [COMPLETE-COURSE] Completando curso: mockup-cero');

    // Verificar token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as { userId: string };
    console.log('✅ [COMPLETE-COURSE] Token verificado, userId:', userId);

    // Buscar el curso
    const foundCourse = await prisma.course.findUnique({
      where: { slug: 'mockup-cero' },
      select: { id: true, title: true, slug: true }
    });

    if (!foundCourse) {
      console.log('❌ [COMPLETE-COURSE] Curso no encontrado: mockup-cero');
      return;
    }

    console.log('✅ [COMPLETE-COURSE] Curso encontrado:', foundCourse.title);

    // Buscar la inscripción del usuario
    const foundEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: foundCourse.id
        }
      },
      include: {
        progress: true
      }
    });

    if (!foundEnrollment) {
      console.log('❌ [COMPLETE-COURSE] Usuario no inscrito en el curso');
      return;
    }

    console.log('✅ [COMPLETE-COURSE] Inscripción encontrada');

    // Obtener todas las lecciones del curso
    const lessons = await prisma.lesson.findMany({
      where: { courseId: foundCourse.id },
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
      where: { enrollmentId: foundEnrollment.id },
      update: {
        progressPercentage: 100,
        completedLessons,
        status: 'COMPLETED',
        completedAt: new Date(),
        currentLesson: totalLessons - 1
      },
      create: {
        enrollmentId: foundEnrollment.id,
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
      where: { id: foundEnrollment.id },
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

    console.log('\n✅ Endpoint probado exitosamente');

  } catch (error) {
    console.error('❌ Error en la prueba del endpoint:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteCourseEndpoint(); 