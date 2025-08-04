import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [ENROLL] Iniciando proceso de inscripción...');
    
    // Verificar token de autenticación
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log('❌ [ENROLL] No hay token');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar token JWT
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('❌ [ENROLL] Token inválido');
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Verificar si es una sesión de base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    });

    // Si es una sesión de BD, verificar que no haya expirado
    if (session && session.expiresAt < new Date()) {
      console.log('❌ [ENROLL] Sesión expirada');
      return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 });
    }

    const { courseId } = await request.json();
    const userId = decoded.userId;

    console.log('🔍 [ENROLL] Datos recibidos:', { courseId, userId });

    if (!courseId) {
      console.log('❌ [ENROLL] Course ID es requerido');
      return NextResponse.json({ error: 'Course ID es requerido' }, { status: 400 });
    }

    // ✅ OPTIMIZADO: Buscar el curso con select específico
    let course;
    if (courseId.length === 25) { // Es un ID de Prisma (25 caracteres)
      console.log('🔍 [ENROLL] Buscando curso por ID...');
      course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          isFree: true,
          requiresAuth: true
        }
      });
    } else { // Es un slug
      console.log('🔍 [ENROLL] Buscando curso por slug...');
      course = await prisma.course.findUnique({
        where: { slug: courseId },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          isFree: true,
          requiresAuth: true
        }
      });
    }

    if (!course) {
      console.log('❌ [ENROLL] Curso no encontrado');
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    if (course.status !== 'PUBLISHED') {
      console.log('❌ [ENROLL] Curso no publicado');
      return NextResponse.json({ error: 'Curso no disponible' }, { status: 400 });
    }

    console.log('✅ [ENROLL] Curso encontrado:', course.title);
    const actualCourseId = course.id;

    // ✅ OPTIMIZADO: Verificar inscripción existente con select específico
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: actualCourseId
      },
      select: {
        id: true,
        enrolledAt: true,
        progressPercentage: true,
        status: true
      }
    });

    if (existingEnrollment) {
      console.log('✅ [ENROLL] Usuario ya inscrito');
      return NextResponse.json({ 
        message: 'Usuario ya inscrito en el curso',
        enrollment: existingEnrollment 
      });
    }

    // ✅ OPTIMIZADO: Crear la inscripción con select específico
    console.log('🔍 [ENROLL] Creando inscripción...');
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: userId,
        courseId: actualCourseId,
        enrolledAt: new Date(),
        status: 'ACTIVE',
        progressPercentage: 0
      },
      select: {
        id: true,
        enrolledAt: true,
        progressPercentage: true,
        status: true,
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    console.log('✅ [ENROLL] Inscripción creada exitosamente');
    return NextResponse.json({ 
      message: 'Inscripción exitosa',
      enrollment: enrollment 
    });

  } catch (error) {
    console.error('❌ [ENROLL] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 