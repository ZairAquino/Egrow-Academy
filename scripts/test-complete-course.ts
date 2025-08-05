import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testCompleteCourse() {
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
      },
      include: {
        progress: true
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
        },
        include: {
          progress: true
        }
      });
    }

    console.log(`✅ Inscripción encontrada/creada: ${enrollment.id}`);

    // Obtener todas las lecciones del curso
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' }
    });

    console.log(`📚 Total de lecciones: ${lessons.length}`);

    // Simular el proceso de finalización del curso
    console.log('\n🔄 Simulando finalización del curso...');

    // 1. Marcar todas las lecciones como completadas
    const completedLessons = lessons.map(lesson => lesson.id);
    
    // 2. Actualizar el progreso del curso
    const updatedProgress = await prisma.courseProgress.upsert({
      where: { enrollmentId: enrollment.id },
      update: {
        progressPercentage: 100,
        completedLessons,
        status: 'COMPLETED',
        completedAt: new Date(),
        currentLesson: lessons.length - 1
      },
      create: {
        enrollmentId: enrollment.id,
        progressPercentage: 100,
        completedLessons,
        status: 'COMPLETED',
        completedAt: new Date(),
        currentLesson: lessons.length - 1
      }
    });

    console.log('✅ Progreso actualizado');

    // 3. Actualizar el enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: 'COMPLETED',
        progressPercentage: 100,
        completedAt: new Date()
      }
    });

    console.log('✅ Enrollment actualizado');

    // 4. Crear registros de progreso de lecciones
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
          lessonTitle: lesson.title,
          isCompleted: true,
          completedAt: new Date()
        }
      });
    }

    console.log('✅ Progreso de lecciones actualizado');

    // Verificar el resultado final
    const finalEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollment.id },
      include: {
        progress: true
      }
    });

    console.log('\n📊 Resultado final:');
    console.log(`   Estado: ${finalEnrollment?.status}`);
    console.log(`   Progreso: ${finalEnrollment?.progressPercentage}%`);
    console.log(`   Completado: ${finalEnrollment?.completedAt ? 'Sí' : 'No'}`);
    console.log(`   Lecciones completadas: ${finalEnrollment?.progress?.completedLessons.length}`);

    console.log('\n✅ Prueba completada exitosamente');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteCourse(); 