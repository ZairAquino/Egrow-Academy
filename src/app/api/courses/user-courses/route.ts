import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [USER-COURSES] Obteniendo cursos del usuario...');
    
    // Obtener el token del header Authorization
    const token = extractTokenFromHeader(request);
    
    if (!token) {
      console.log('❌ [USER-COURSES] No hay token');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar el token
    const decoded = verifyToken(token);
    const userId = decoded.userId;
    console.log('🔍 [USER-COURSES] Token verificado, userId:', userId);

    // Obtener enrollments del usuario
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
        progress: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('✅ [USER-COURSES] Enrollments encontrados:', enrollments.length);
    
    // Formatear respuesta
    const userCourses = enrollments.map(enrollment => {
      const completedLessons = enrollment.progress?.completedLessons?.length || 0;
      const totalLessons = enrollment.course.lessons.length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      return {
        id: enrollment.id,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          slug: enrollment.course.slug,
          difficulty: enrollment.course.difficulty,
        durationHours: enrollment.course.durationHours,
        imageUrl: enrollment.course.imageUrl,
          totalLessons: totalLessons
        },
        progress: {
          completedLessons,
          totalLessons,
          progressPercentage,
          lastAccessed: enrollment.progress?.lastAccessed,
          completedAt: enrollment.progress?.completedAt
        },
        enrolledAt: enrollment.createdAt
      };
    });

    return NextResponse.json({
      courses: userCourses,
      total: userCourses.length
    });

  } catch (error) {
    console.error('❌ [USER-COURSES] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 