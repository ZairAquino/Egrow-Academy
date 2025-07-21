import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log(`🔍 [RESOURCE-API] Obteniendo recurso: ${slug}`);

    const resource = await prisma.resource.findUnique({
      where: { slug },
      include: {
        topics: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            accessLogs: true
          }
        }
      }
    });

    if (!resource) {
      console.log(`❌ [RESOURCE-API] Recurso no encontrado: ${slug}`);
      return NextResponse.json(
        { success: false, error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ [RESOURCE-API] Recurso encontrado: ${resource.title}`);

    return NextResponse.json({
      success: true,
      data: resource
    });

  } catch (error) {
    console.error('❌ [RESOURCE-API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 