import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [RESOURCES-API] Obteniendo recursos...');

    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ [RESOURCES-API] Conexión a la base de datos establecida');

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log(`🔍 [RESOURCES-API] Parámetros: category=${category}, limit=${limit}, offset=${offset}`);

    // Usar Prisma ORM en lugar de SQL directo para mayor seguridad
    const whereClause: any = {
      status: 'PUBLISHED'
    };

    if (category && category !== 'todos') {
      whereClause.category = category;
    }

    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        topics: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    const totalCount = await prisma.resource.count({
      where: whereClause
    });

    // Formatear recursos para que coincidan con la interfaz esperada
    const formattedResources = resources.map(r => ({
      ...r,
      topics: r.topics || [],
      rating: Number(r.rating),
      _count: {
        accessLogs: 0
      }
    }));

    console.log(`✅ [RESOURCES-API] ${formattedResources.length} recursos encontrados de ${totalCount} total`);

    return NextResponse.json({
      success: true,
      data: formattedResources,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('❌ [RESOURCES-API] Error detallado:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
      console.log('✅ [RESOURCES-API] Conexión cerrada');
    } catch (disconnectError) {
      console.error('❌ [RESOURCES-API] Error al desconectar:', disconnectError);
    }
  }
} 