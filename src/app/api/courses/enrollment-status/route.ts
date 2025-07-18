import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ENROLLMENT-STATUS] Verificando estado de inscripción');

    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      console.log('❌ [ENROLLMENT-STATUS] No hay token de autenticación');
      return NextResponse.json(
        { error: 'Debes iniciar sesión para verificar inscripción' },
        { status: 401 }
      );
    }

    // Verificar token
    const { userId } = verifyToken(token);
    console.log('✅ [ENROLLMENT-STATUS] Token válido para usuario:', userId);

    // Obtener courseId de los query parameters
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      console.log('❌ [ENROLLMENT-STATUS] No se proporcionó courseId');
      return NextResponse.json(
        { error: 'Se requiere courseId' },
        { status: 400 }
      );
    }

    console.log('📝 [ENROLLMENT-STATUS] Verificando inscripción:', { courseId, userId });

    // Verificar si el usuario está inscrito
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    const isEnrolled = !!enrollment;

    console.log('✅ [ENROLLMENT-STATUS] Resultado:', { isEnrolled, enrollmentId: enrollment?.id });

    return NextResponse.json({
      isEnrolled,
      enrollment: enrollment || null
    });

  } catch (error) {
    console.error('💥 [ENROLLMENT-STATUS] Error completo:', error);
    
    if (error instanceof Error) {
      console.error('💥 [ENROLLMENT-STATUS] Mensaje de error:', error.message);
      
      if (error.message.includes('Token inválido')) {
        return NextResponse.json(
          { error: 'Sesión expirada. Por favor, inicia sesión nuevamente' },
          { status: 401 }
        );
      }
    }
    
    console.error('💥 [ENROLLMENT-STATUS] Error genérico, devolviendo 500');
    return NextResponse.json(
      { error: 'Error interno del servidor. Inténtalo más tarde' },
      { status: 500 }
    );
  }
} 