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
    console.log('🔍 [ENROLLMENT-STATUS] URL:', request.url);
    console.log('🔍 [ENROLLMENT-STATUS] Headers:', Object.fromEntries(request.headers.entries()));
    
    // Verificar autenticación
    const token = request.cookies.get('session')?.value;
    console.log('🔍 [ENROLLMENT-STATUS] Token encontrado:', !!token);
    if (!token) {
      console.log('❌ [ENROLLMENT-STATUS] No hay token');
      return NextResponse.json(
        { error: 'Debes iniciar sesión para verificar inscripción' },
        { status: 401 }
      );
    }

    // Verificar token JWT
    console.log('🔍 [ENROLLMENT-STATUS] Verificando token...');
    let userId: string;
    try {
      const decoded = verifyToken(token);
      userId = decoded.userId;
      console.log('🔍 [ENROLLMENT-STATUS] Usuario ID:', userId);
    } catch (tokenError) {
      console.log('❌ [ENROLLMENT-STATUS] Error verificando token:', tokenError);
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
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

    // Obtener courseId de los query parameters o del body
    const { searchParams } = new URL(request.url);
    let courseId = searchParams.get('courseId');
    console.log('🔍 [ENROLLMENT-STATUS] CourseId de query params:', courseId);
    
    // Si no está en query params, intentar leer del body
    if (!courseId) {
      try {
        const body = await request.json();
        courseId = body.courseId;
        console.log('🔍 [ENROLLMENT-STATUS] CourseId de body:', courseId);
      } catch (error) {
        console.log('🔍 [ENROLLMENT-STATUS] Error al leer body:', error);
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
    console.log('🔍 [ENROLLMENT-STATUS] Buscando curso con courseId:', courseId);
    let course;
    if (courseId.length === 25) { // Es un ID de Prisma (25 caracteres)
      console.log('🔍 [ENROLLMENT-STATUS] Buscando por ID de Prisma');
      course = await prisma.course.findUnique({
        where: { id: courseId }
      });
    } else { // Es un slug
      console.log('🔍 [ENROLLMENT-STATUS] Buscando por slug');
      course = await prisma.course.findUnique({
        where: { slug: courseId }
      });
    }

    console.log('🔍 [ENROLLMENT-STATUS] Resultado búsqueda curso:', !!course);
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
    console.log('🔍 [ENROLLMENT-STATUS] Buscando inscripción para userId:', userId, 'courseId:', actualCourseId);
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: actualCourseId
      }
    });

    const isEnrolled = !!enrollment;
    console.log('🔍 [ENROLLMENT-STATUS] Resultado inscripción:', { isEnrolled, enrollmentId: enrollment?.id });

    const responseData = {
      isEnrolled,
      enrollment: enrollment || null
    };
    console.log('🔍 [ENROLLMENT-STATUS] Devolviendo respuesta:', responseData);
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('💥 [ENROLLMENT-STATUS] Error completo:', error);
    
    if (error instanceof Error) {
      console.error('💥 [ENROLLMENT-STATUS] Error message:', error.message);
      
      if (error.message.includes('Token inválido')) {
        console.log('🔍 [ENROLLMENT-STATUS] Token inválido detectado');
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