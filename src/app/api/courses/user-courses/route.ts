import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar token desde cookies o headers (igual que /api/auth/me)
    const cookieToken = request.cookies.get('session')?.value;
    const headerToken = extractTokenFromHeader(request);
    
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar token JWT
    let userId: string;
    try {
      const decoded = verifyToken(token);
      userId = decoded.userId;
    } catch (tokenError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Verificar si es una sesión de base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    });

    // Si es una sesión de BD, verificar que no haya expirado
    if (session && session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Sesión expirada' },
        { status: 401 }
      );
    }

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
        enrolledAt: 'desc'
      }
    });

    // Formatear respuesta
    const userCourses = enrollments.map(enrollment => {
      const completedLessons = enrollment.progress?.completedLessons?.length || 0;
      const totalLessons = enrollment.course.lessons.length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      // Determinar el status basado en el progreso
      let status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' = 'ACTIVE';
      if (progressPercentage === 100) {
        status = 'COMPLETED';
      }
      
      return {
        id: enrollment.id,
        courseId: enrollment.courseId,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description,
          slug: enrollment.course.slug,
          difficulty: enrollment.course.difficulty,
          durationHours: enrollment.course.durationHours,
          imageUrl: enrollment.course.imageUrl,
          hasCertificate: progressPercentage === 100, // Certificado cuando está completado
          certificateUrl: progressPercentage === 100 ? `/certificate/${enrollment.course.slug}` : undefined
        },
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.progress?.completedAt,
        progressPercentage: progressPercentage,
        status: status
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