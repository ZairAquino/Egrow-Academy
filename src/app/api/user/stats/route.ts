import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar token de autenticación
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const userId = decoded.userId;

    // Obtener inscripciones del usuario
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });

    // Calcular estadísticas
    const totalEnrolled = enrollments.length;
    const completedCourses = enrollments.filter(e => e.status === 'COMPLETED').length;
    const inProgressCourses = enrollments.filter(e => e.status === 'ACTIVE').length;
    const freeCourses = enrollments.filter(e => e.course.isFree).length;
    const premiumCourses = enrollments.filter(e => !e.course.isFree).length;
    
    // Calcular horas totales aprendidas
    const totalHoursLearned = enrollments.reduce((total, enrollment) => {
      return total + (enrollment.course.durationHours || 0);
    }, 0);

    // Calcular progreso promedio
    const averageProgress = enrollments.length > 0 
      ? enrollments.reduce((total, enrollment) => total + (enrollment.progressPercentage || 0), 0) / enrollments.length
      : 0;

    // Por ahora, certificaciones = cursos completados
    // En el futuro esto se puede expandir con una tabla de certificaciones
    const certificates = completedCourses;

    const stats = {
      totalEnrolled,
      completedCourses,
      inProgressCourses,
      freeCourses,
      premiumCourses,
      certificates,
      totalHoursLearned,
      averageProgress: Math.round(averageProgress * 100) / 100,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas del usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 