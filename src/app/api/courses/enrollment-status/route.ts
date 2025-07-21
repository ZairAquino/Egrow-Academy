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

    // Buscar el curso por ID o slug (igual que en el endpoint de inscripción)
    let course;
    if (courseId.length === 25) { // Es un ID de Prisma (25 caracteres)
      console.log('🔍 [ENROLLMENT-STATUS] Buscando curso por ID...');
      course = await prisma.course.findUnique({
        where: { id: courseId }
      });
    } else { // Es un slug
      console.log('🔍 [ENROLLMENT-STATUS] Buscando curso por slug...');
      course = await prisma.course.findUnique({
        where: { slug: courseId }
      });
    }

    if (!course) {
      console.log('❌ [ENROLLMENT-STATUS] Curso no encontrado');
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ [ENROLLMENT-STATUS] Curso encontrado:', course.title);
    const actualCourseId = course.id;

    // Verificar si el usuario está inscrito usando el ID real del curso
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: actualCourseId
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