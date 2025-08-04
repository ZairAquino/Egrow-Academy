import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const { userId } = verifyToken(token);
    
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: true // Para verificar si es instructor
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const { lessonId } = await params;
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'URL del video es requerida' },
        { status: 400 }
      );
    }

    // Buscar la lección
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            instructor: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lección no encontrada' },
        { status: 404 }
      );
    }

    // Verificar permisos: solo el instructor del curso puede actualizar lecciones
    if (lesson.course.instructorId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar esta lección' },
        { status: 403 }
      );
    }

    // Actualizar la lección con el nuevo video
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        videoUrl: videoUrl,
        updatedAt: new Date()
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Video actualizado exitosamente',
      lesson: {
        id: updatedLesson.id,
        title: updatedLesson.title,
        videoUrl: updatedLesson.videoUrl,
        course: updatedLesson.course
      }
    });

  } catch (error) {
    console.error('Error al actualizar video de lección:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const { userId } = verifyToken(token);
    
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const { lessonId } = await params;

    // Buscar la lección
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            instructor: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lección no encontrada' },
        { status: 404 }
      );
    }

    // Verificar permisos: solo el instructor del curso puede eliminar videos
    if (lesson.course.instructorId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar el video de esta lección' },
        { status: 403 }
      );
    }

    // Eliminar el video de la lección
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        videoUrl: null,
        updatedAt: new Date()
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Video eliminado exitosamente',
      lesson: {
        id: updatedLesson.id,
        title: updatedLesson.title,
        videoUrl: updatedLesson.videoUrl,
        course: updatedLesson.course
      }
    });

  } catch (error) {
    console.error('Error al eliminar video de lección:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 