import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [RESOURCES-API] Obteniendo recursos...');
    
    // Forzar conexión a la base de datos
    await prisma.$connect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Construir filtros
    const where: any = {
      status: 'PUBLISHED'
    };

    if (category && category !== 'todos') {
      // Validar que la categoría sea válida antes de aplicar el filtro
      const validCategories = ['WEBINAR', 'MANUAL', 'TUTORIAL', 'PAPER', 'HERRAMIENTA', 'DATASET', 'PODCAST', 'LIBRO'];
      if (validCategories.includes(category.toUpperCase())) {
        where.category = category.toUpperCase();
      }
    }

    // Obtener recursos
    const resources = await prisma.resource.findMany({
      where,
      include: {
        topics: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            accessLogs: true
          }
        }
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ],
      take: limit,
      skip: offset
    });

    // Contar total de recursos
    const totalCount = await prisma.resource.count({ where });

    console.log(`✅ [RESOURCES-API] ${resources.length} recursos encontrados`);

    return NextResponse.json({
      success: true,
      data: resources,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('❌ [RESOURCES-API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 