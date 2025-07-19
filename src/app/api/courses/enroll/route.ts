import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
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

    const { courseId } = await request.json();
    const userId = decoded.userId;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID es requerido' }, { status: 400 });
    }

    // Verificar si el usuario ya está inscrito
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: courseId
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ 
        message: 'Usuario ya inscrito en el curso',
        enrollment: existingEnrollment 
      });
    }

    // Crear la inscripción
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: userId,
        courseId: courseId,
        enrolledAt: new Date(),
        status: 'ACTIVE',
        progressPercentage: 0
      }
    });

    return NextResponse.json({ 
      message: 'Inscripción exitosa',
      enrollment: enrollment 
    });

  } catch (error) {
    console.error('Error en inscripción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 