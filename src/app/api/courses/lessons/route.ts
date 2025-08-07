import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Obtener courseId de los query parameters
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID es requerido' },
        { status: 400 }
      );
    }
    
    // Verificar autenticación
    const cookieToken = request.cookies.get('session')?.value;
    const headerToken = extractTokenFromHeader(request);
    const token = cookieToken || headerToken;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    let tokenData;
    try {
      tokenData = verifyToken(token);
    } catch (tokenError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    
    if (!tokenData || !tokenData.userId) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    
    const userId = tokenData.userId;
    
    // Buscar el curso por slug
    const course = await prisma.course.findUnique({
      where: { slug: courseId }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar que el usuario esté inscrito
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: course.id
      }
    });
    
    if (!enrollment) {
      return NextResponse.json(
        { error: 'No estás inscrito en este curso' },
        { status: 403 }
      );
    }
    
    // Obtener las lecciones del curso
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        videoUrl: true,
        duration: true,
        order: true
      }
    });
    
    // Formatear las lecciones para el frontend
    const formattedLessons = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      type: 'video', // Valor por defecto ya que no existe en el modelo
      order: lesson.order
    }));
    
    return NextResponse.json({
      success: true,
      lessons: formattedLessons,
      courseTitle: course.title
    });
    
  } catch (error) {
    console.error('❌ [API] Error en /api/courses/lessons:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 