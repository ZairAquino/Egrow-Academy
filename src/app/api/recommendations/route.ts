import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { RecommendationEngine } from '@/lib/recommendation-engine';
import { UserBehaviorTracker } from '@/lib/user-behavior';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const refresh = searchParams.get('refresh') === 'true';

    // Si se solicita refresh, generar nuevas recomendaciones
    if (refresh) {
      const recommendations = await RecommendationEngine.generateRecommendations(session.user.id, limit);
      return NextResponse.json({ recommendations });
    }

    // Obtener recomendaciones existentes de la base de datos
    const existingRecommendations = await prisma.recommendation.findMany({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() },
      },
      orderBy: { score: 'desc' },
      take: limit,
    });

    if (existingRecommendations.length >= limit) {
      // Convertir a formato de respuesta
      const recommendations = await Promise.all(
        existingRecommendations.map(async (rec) => {
          let item;
          if (rec.targetType === 'course') {
            item = await prisma.course.findUnique({
              where: { id: rec.targetId },
            });
          } else if (rec.targetType === 'resource') {
            item = await prisma.resource.findUnique({
              where: { id: rec.targetId },
            });
          }

          if (!item) return null;

          return {
            id: rec.targetId,
            type: rec.targetType,
            title: item.title || item.name,
            description: item.description || '',
            image: item.imageUrl || '',
            score: rec.score,
            reason: rec.reason,
            url: rec.targetType === 'course' 
              ? `/curso/${item.slug}` 
              : `/resources/${item.slug}`,
          };
        })
      );

      const validRecommendations = recommendations.filter(Boolean);
      return NextResponse.json({ recommendations: validRecommendations });
    }

    // Si no hay suficientes recomendaciones, generar nuevas
    const recommendations = await RecommendationEngine.generateRecommendations(session.user.id, limit);
    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, targetId, targetType, metadata } = body;

    // Registrar comportamiento del usuario
    await UserBehaviorTracker.trackBehavior({
      userId: session.user.id,
      action,
      targetId,
      targetType,
      metadata,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error tracking behavior:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 