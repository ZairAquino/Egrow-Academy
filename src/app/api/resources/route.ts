import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [RESOURCES-API] Obteniendo recursos con query directa...');

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Obtener recursos con SQL directo - versión simplificada
    let resourcesQuery = `
      SELECT 
        r.*
      FROM resources r
      WHERE r.status = 'PUBLISHED'
    `;

    let countQuery = `
      SELECT COUNT(*) as count 
      FROM resources r
      WHERE r.status = 'PUBLISHED'
    `;

    if (category && category !== 'todos') {
      resourcesQuery += ` AND r.category = '${category}'`;
      countQuery += ` AND r.category = '${category}'`;
    }

    resourcesQuery += ` ORDER BY r."createdAt" DESC LIMIT ${limit} OFFSET ${offset}`;

    const resources = await prisma.$queryRawUnsafe(resourcesQuery);
    const totalResult = await prisma.$queryRawUnsafe(countQuery);

    // Obtener topics para cada recurso
    const resourcesWithTopics = await Promise.all(
      resources.map(async (resource) => {
        const topics = await prisma.$queryRawUnsafe(
          `SELECT * FROM resource_topics WHERE "resourceId" = '${resource.id}' ORDER BY "order" ASC`
        );
        return {
          ...resource,
          topics: topics || []
        };
      })
    );

    const totalCount = Number(totalResult[0]?.count || 0);

    // Formatear recursos para que coincidan con la interfaz esperada
    const formattedResources = resourcesWithTopics.map(r => ({
      ...r,
      topics: Array.isArray(r.topics) ? r.topics : [],
      rating: Number(r.rating),
      _count: {
        accessLogs: 0
      }
    }));

    console.log(`✅ [RESOURCES-API] ${formattedResources.length} recursos encontrados`);

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
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 