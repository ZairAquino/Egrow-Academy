import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return await checkEnrollmentStatus(request);
}

export async function POST(request: NextRequest) {
  return await checkEnrollmentStatus(request);
}

async function checkEnrollmentStatus(request: NextRequest) {
  try {
    console.log('🔍 [ENROLLMENT-STATUS] Iniciando verificación de inscripción...');
    
    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      console.log('❌ [ENROLLMENT-STATUS] No hay token');
      return NextResponse.json(
        { error: 'Debes iniciar sesión para verificar inscripción' },
        { status: 401 }
      );
    }

    // Verificar token JWT
    const { userId } = verifyToken(token);
    console.log('🔍 [ENROLLMENT-STATUS] Usuario ID:', userId);

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

    // Obtener courseId de los query parameters o del body
    const { searchParams } = new URL(request.url);
    let courseId = searchParams.get('courseId');
    
    // Si no está en query params, intentar leer del body
    if (!courseId) {
      try {
        const body = await request.json();
        courseId = body.courseId;
      } catch (error) {
        // Error al leer el body
      }
    }

    if (!courseId) {
      console.log('❌ [ENROLLMENT-STATUS] Se requiere courseId');
      return NextResponse.json(
        { error: 'Se requiere courseId' },
        { status: 400 }
      );
    }

    console.log('🔍 [ENROLLMENT-STATUS] Buscando curso:', courseId);

    // Buscar el curso por ID o slug (igual que en el endpoint de inscripción)
    let course;
    if (courseId.length === 25) { // Es un ID de Prisma (25 caracteres)
      course = await prisma.course.findUnique({
        where: { id: courseId }
      });
    } else { // Es un slug
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

    const actualCourseId = course.id;
    console.log('✅ [ENROLLMENT-STATUS] Curso encontrado:', { id: actualCourseId, title: course.title });

    // Verificar si el usuario está inscrito usando el ID real del curso
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: actualCourseId
      }
    });

    const isEnrolled = !!enrollment;
    console.log('🔍 [ENROLLMENT-STATUS] Resultado inscripción:', { isEnrolled, enrollmentId: enrollment?.id });

    return NextResponse.json({
      isEnrolled,
      enrollment: enrollment || null
    });

  } catch (error) {
    if (error instanceof Error) {
      
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