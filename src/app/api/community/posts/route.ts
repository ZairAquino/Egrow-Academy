import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - Obtener todas las discusiones
export async function GET() {
  try {
    const posts = await prisma.communityPost.findMany({
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
        comments: {
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
        },
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error al obtener discusiones:', error);
    return NextResponse.json(
      { error: 'Error al obtener las discusiones' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva discusión
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [API-COMMUNITY] Iniciando POST request...');
    
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log('🔍 [API-COMMUNITY] Cookie token:', cookieToken ? 'Presente' : 'No encontrado');
    console.log('🔍 [API-COMMUNITY] Header token:', headerToken ? 'Presente' : 'No encontrado');
    
    const token = cookieToken || headerToken;
    
    if (!token) {
      console.error('🔍 [API-COMMUNITY] No se encontró token de autenticación');
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    console.log('🔍 [API-COMMUNITY] Verificando token...');
    const { userId } = verifyToken(token);
    console.log('🔍 [API-COMMUNITY] Token verificado, userId:', userId);

    const { title, content, category } = await request.json();
    console.log('🔍 [API-COMMUNITY] Datos recibidos:', { title, content, category });

    // Validar campos requeridos
    if (!title || !content) {
      console.error('🔍 [API-COMMUNITY] Campos requeridos faltantes');
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    console.log('🔍 [API-COMMUNITY] Creando discusión en la base de datos...');
    
    // Crear la nueva discusión
    const post = await prisma.communityPost.create({
      data: {
        title,
        content,
        category: category || 'general',
        userId,
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
        comments: [],
        likes: [],
      },
    });

    console.log('🔍 [API-COMMUNITY] Discusión creada exitosamente:', post.id);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('🔍 [API-COMMUNITY] Error al crear discusión:', error);
    return NextResponse.json(
      { error: 'Error al crear la discusión', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
} 