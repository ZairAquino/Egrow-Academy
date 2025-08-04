import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [COMPLETE-COURSE] Iniciando proceso de completar curso...');

    // Verificar autenticación
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || headerToken;

    if (!token) {
      console.log('❌ [COMPLETE-COURSE] No hay token de autenticación');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { userId } = verifyToken(token);
    console.log('✅ [COMPLETE-COURSE] Token verificado, userId:', userId);

    // Obtener datos del request
    const { courseSlug } = await request.json();
    
    if (!courseSlug) {
      console.log('❌ [COMPLETE-COURSE] No se proporcionó courseSlug');
      return NextResponse.json({ error: 'Course slug es requerido' }, { status: 400 });
    }

    console.log('📝 [COMPLETE-COURSE] Completando curso:', courseSlug);

    // Buscar el curso por slug
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true, title: true, slug: true }
    });

    if (!course) {
      console.log('❌ [COMPLETE-COURSE] Curso no encontrado:', courseSlug);
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    console.log('✅ [COMPLETE-COURSE] Curso encontrado:', course.title);

    // Buscar la inscripción del usuario
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id
        }
      },
      include: {
        progress: true
      }
    });

    if (!enrollment) {
      console.log('❌ [COMPLETE-COURSE] Usuario no inscrito en el curso');
      return NextResponse.json({ error: 'No estás inscrito en este curso' }, { status: 404 });
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
    const completedLessons = lessons.map(lesson => lesson.order);
    
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

    return NextResponse.json({
      success: true,
      message: 'Curso marcado como completado exitosamente',
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug
      },
      enrollment: {
        status: updatedEnrollment.status,
        progressPercentage: updatedEnrollment.progressPercentage,
        completedAt: updatedEnrollment.completedAt
      }
    });

  } catch (error) {
    console.error('❌ [COMPLETE-COURSE] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 