import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

interface EnrollmentRequest {
  courseId: string;
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎓 [ENROLL] Iniciando proceso de inscripción');

    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      console.log('❌ [ENROLL] No hay token de autenticación');
      return NextResponse.json(
        { error: 'Debes iniciar sesión para inscribirte al curso' },
        { status: 401 }
      );
    }

    // Verificar token
    const { userId } = verifyToken(token);
    console.log('✅ [ENROLL] Token válido para usuario:', userId);

    // Obtener datos del request
    const body: EnrollmentRequest = await request.json();
    const { courseId } = body;

    console.log('📝 [ENROLL] Datos recibidos:', { courseId, userId });

    // Validar que el curso existe
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      console.log('❌ [ENROLL] Curso no encontrado:', courseId);
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ [ENROLL] Curso encontrado:', course.title);

    // Verificar si el usuario ya está inscrito
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      console.log('⚠️ [ENROLL] Usuario ya inscrito en el curso');
      return NextResponse.json(
        { 
          message: 'Ya estás inscrito en este curso',
          enrollment: existingEnrollment
        },
        { status: 200 }
      );
    }

    console.log('✅ [ENROLL] Usuario no inscrito, procediendo con inscripción');

    // Crear la inscripción
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ACTIVE',
        progressPercentage: 0,
        enrolledAt: new Date()
      }
    });

    console.log('✅ [ENROLL] Inscripción creada exitosamente');

    // Actualizar contador de estudiantes del curso
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentsCount: {
          increment: 1
        }
      }
    });

    console.log('✅ [ENROLL] Contador de estudiantes actualizado');

    return NextResponse.json({
      message: '¡Te has inscrito exitosamente al curso!',
      enrollment
    });

  } catch (error) {
    console.error('💥 [ENROLL] Error completo:', error);
    
    if (error instanceof Error) {
      console.error('💥 [ENROLL] Mensaje de error:', error.message);
      
      if (error.message.includes('Token inválido')) {
        return NextResponse.json(
          { error: 'Sesión expirada. Por favor, inicia sesión nuevamente' },
          { status: 401 }
        );
      }
    }
    
    console.error('💥 [ENROLL] Error genérico, devolviendo 500');
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    );
  }
} 