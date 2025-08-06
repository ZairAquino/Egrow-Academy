import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener enrollments del usuario con información del curso
    const userEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.id,
        status: 'ACTIVE'
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            imageUrl: true,
            category: true,
            createdAt: true,
            updatedAt: true,
            lessons: {
              select: {
                id: true
              }
            }
          }
        },
        progress: {
          select: {
            progressPercentage: true,
            lastAccessed: true,
            completedLessons: true,
            lessonProgress: {
              where: {
                isCompleted: true
              },
              select: {
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    // Transformar los datos para el frontend
    const courses = userEnrollments.map(enrollment => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.progress?.lessonProgress?.length || 0;
      const progress = enrollment.progress?.progressPercentage 
        ? Number(enrollment.progress.progressPercentage) 
        : (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        description: enrollment.course.description,
        imageUrl: enrollment.course.imageUrl,
        progress: Math.round(progress),
        lastAccessed: enrollment.progress?.lastAccessed || enrollment.enrolledAt,
        totalLessons,
        completedLessons,
        category: enrollment.course.category,
        level: 'BEGINNER', // Default level since it's not in the schema
        enrolledAt: enrollment.enrolledAt
      };
    });

    return NextResponse.json({
      success: true,
      courses
    });

  } catch (error) {
    console.error('Error al obtener cursos del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}