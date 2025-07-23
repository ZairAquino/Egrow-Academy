import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - Obtener comentarios de una discusión
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        type: 'FORUM',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los comentarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo comentario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    console.log('🔍 [API-COMMENT] Iniciando comentario para post:', postId);
    
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const { userId } = verifyToken(token);
    console.log('🔍 [API-COMMENT] Usuario autenticado:', userId);

    const { content } = await request.json();
    console.log('🔍 [API-COMMENT] Contenido recibido:', content);

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'El contenido del comentario es requerido' },
        { status: 400 }
      );
    }

    // Crear el comentario
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        type: 'FORUM',
        userId,
        postId: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    console.log('🔍 [API-COMMENT] Comentario creado exitosamente:', comment.id);
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('🔍 [API-COMMENT] Error:', error);
    return NextResponse.json(
      { error: 'Error al crear el comentario' },
      { status: 500 }
    );
  }
} 