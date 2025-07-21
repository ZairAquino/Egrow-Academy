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

    // Obtener courseId de los query parameters
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'ID del curso no proporcionado' },
        { status: 400 }
      );
    }

    // Obtener el enrollment del usuario para este curso
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
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
        progress: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'No se encontró inscripción para este curso' },
        { status: 404 }
      );
    }

    // Calcular progreso
    const totalLessons = enrollment.course.lessons.length;
    const completedLessons = enrollment.progress?.completedLessons?.length || 0;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Verificar si el curso está completado
    const isCompleted = progressPercentage === 100 || enrollment.status === 'COMPLETED';

    if (!isCompleted) {
      return NextResponse.json(
        { error: 'El curso no ha sido completado' },
        { status: 400 }
      );
    }

    // Generar número de certificado único
    const certificateNumber = `EGC-${courseId.slice(-6).toUpperCase()}-${userId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Obtener nombre completo del usuario
    const userName = enrollment.user.firstName && enrollment.user.lastName 
      ? `${enrollment.user.firstName} ${enrollment.user.lastName}`
      : enrollment.user.firstName || enrollment.user.email || 'Estudiante';

    // Crear objeto de certificado
    const certificate = {
      id: enrollment.id,
      courseId: enrollment.courseId,
      userId: enrollment.userId,
      courseTitle: enrollment.course.title,
      userName: userName,
      completedAt: enrollment.completedAt || enrollment.updatedAt,
      certificateNumber: certificateNumber,
      hasCertificate: true
    };

    return NextResponse.json({
      certificate: certificate,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        duration: enrollment.course.durationHours ? `${enrollment.course.durationHours} horas` : '2 horas',
        level: enrollment.course.difficulty || 'Principiante'
      },
      progress: {
        totalLessons: totalLessons,
        completedLessons: completedLessons,
        percentage: progressPercentage
      }
    });

  } catch (error) {
    console.error('Error al obtener certificado:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 