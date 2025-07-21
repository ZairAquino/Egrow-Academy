import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log(`🔍 [RESOURCE-ACCESS-API] Verificando acceso: ${slug}`);

    // Verificar token de autenticación
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ [RESOURCE-ACCESS-API] No hay token');
      return NextResponse.json(
        { success: false, error: 'No autorizado', requiresAuth: true },
        { status: 401 }
      );
    }

    const userId = await verifyToken(token);
    if (!userId) {
      console.log('❌ [RESOURCE-ACCESS-API] Token inválido');
      return NextResponse.json(
        { success: false, error: 'Token inválido', requiresAuth: true },
        { status: 401 }
      );
    }

    console.log(`✅ [RESOURCE-ACCESS-API] Token verificado, userId: ${userId}`);

    // Buscar el recurso
    const resource = await prisma.resource.findUnique({
      where: { slug },
      include: {
        topics: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!resource) {
      console.log(`❌ [RESOURCE-ACCESS-API] Recurso no encontrado: ${slug}`);
      return NextResponse.json(
        { success: false, error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si requiere autenticación
    if (resource.requiresAuth) {
      console.log(`✅ [RESOURCE-ACCESS-API] Acceso autorizado para: ${resource.title}`);
      
      // Registrar acceso
      await prisma.resourceAccessLog.create({
        data: {
          userId,
          resourceId: resource.id
        }
      });

      // Incrementar contador de descargas
      await prisma.resource.update({
        where: { id: resource.id },
        data: {
          downloadsCount: {
            increment: 1
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        resource,
        hasAccess: true
      }
    });

  } catch (error) {
    console.error('❌ [RESOURCE-ACCESS-API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 