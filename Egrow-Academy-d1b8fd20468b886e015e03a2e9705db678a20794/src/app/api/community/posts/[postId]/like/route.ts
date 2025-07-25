import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// POST - Dar like a una discusión
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    console.log('🔍 [API-LIKE] Iniciando like request para post:', postId);
    
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
    console.log('🔍 [API-LIKE] Usuario autenticado:', userId);

    // Verificar si ya existe el like
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId: postId,
      },
    });

    if (existingLike) {
      // Si ya existe, remover el like (toggle)
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      console.log('🔍 [API-LIKE] Like removido');
      return NextResponse.json({ liked: false });
    } else {
      // Si no existe, crear el like
      await prisma.like.create({
        data: {
          userId,
          postId: postId,
        },
      });
      console.log('🔍 [API-LIKE] Like agregado');
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('🔍 [API-LIKE] Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar el like' },
      { status: 500 }
    );
  }
}

// GET - Obtener estado del like del usuario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;
    
    if (!token) {
      return NextResponse.json({ liked: false });
    }

    const { userId } = verifyToken(token);

    // Verificar si el usuario ya dio like
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId: postId,
      },
    });

    return NextResponse.json({ liked: !!existingLike });
  } catch (error) {
    console.error('🔍 [API-LIKE] Error al verificar like:', error);
    return NextResponse.json({ liked: false });
  }
} 