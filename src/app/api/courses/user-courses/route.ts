import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = extractTokenFromHeader(authHeader);
    
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    // Verificar token
    const { userId } = verifyToken(token);

    // Verificar sesión en base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Sesión expirada' },
        { status: 401 }
      );
    }

    // Obtener enrollments del usuario con información del curso
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId,
        status: {
          in: ['ACTIVE', 'COMPLETED']
        }
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

    // Transformar los datos para el frontend
    const userCourses = enrollments.map(enrollment => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.progress?.completedLessons?.length || 0;
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      
      // Determinar si el curso está completado
      const isCompleted = progressPercentage === 100 || enrollment.status === 'COMPLETED';
      
      return {
        id: enrollment.id,
        courseId: enrollment.courseId,
        course: {
          id: enrollment.course.id,
          title: enrollment.course.title,
          description: enrollment.course.description || enrollment.course.shortDescription || '',
          image: enrollment.course.imageUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
          duration: enrollment.course.durationHours ? `${enrollment.course.durationHours} horas` : '2 horas',
          level: enrollment.course.difficulty || 'Principiante',
          progress: progressPercentage,
          status: isCompleted ? 'completed' : progressPercentage > 0 ? 'in_progress' : 'enrolled',
          hasCertificate: isCompleted, // Por ahora, todos los cursos completados tienen certificado
          certificateUrl: isCompleted ? `/certificate/${enrollment.course.id}` : undefined
        },
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        progressPercentage: progressPercentage,
        status: isCompleted ? 'COMPLETED' : 'ACTIVE'
      };
    });

    return NextResponse.json({
      courses: userCourses,
      total: userCourses.length,
      stats: {
        total: userCourses.length,
        pending: userCourses.filter(c => c.status === 'ACTIVE' && c.progressPercentage < 100).length,
        completed: userCourses.filter(c => c.status === 'COMPLETED' || c.progressPercentage === 100).length,
        certificates: userCourses.filter(c => 
          (c.status === 'COMPLETED' || c.progressPercentage === 100) && 
          c.course.hasCertificate
        ).length
      }
    });

  } catch (error) {
    console.error('Error al obtener cursos del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 