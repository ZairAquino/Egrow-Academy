import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const promotionId = searchParams.get('promotionId');
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Construir la consulta base
    const whereClause: any = {
      timestamp: {
        gte: startDate,
      },
    };

    if (promotionId) {
      whereClause.promotionId = promotionId;
    }

    // Obtener estadísticas de interacciones
    const interactions = await prisma.promotionInteraction.groupBy({
      by: ['action', 'promotionId'],
      where: whereClause,
      _count: {
        action: true,
      },
    });

    // Obtener promociones con sus estadísticas
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
      },
      include: {
        interactions: {
          where: {
            timestamp: {
              gte: startDate,
            },
          },
        },
      },
    });

    // Calcular métricas por promoción
    const stats = promotions.map(promotion => {
      const impressions = promotion.interactions.filter(i => i.action === 'IMPRESSION').length;
      const clicks = promotion.interactions.filter(i => i.action === 'CLICK').length;
      const closes = promotion.interactions.filter(i => i.action === 'CLOSE').length;
      const conversions = promotion.interactions.filter(i => i.action === 'CONVERSION').length;

      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

      return {
        id: promotion.id,
        title: promotion.title,
        type: promotion.type,
        isActive: promotion.isActive,
        currentImpressions: promotion.currentImpressions,
        metrics: {
          impressions,
          clicks,
          closes,
          conversions,
          ctr: Math.round(ctr * 100) / 100,
          conversionRate: Math.round(conversionRate * 100) / 100,
        },
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      period: `${days} días`,
    });
  } catch (error) {
    console.error('Error fetching promotion stats:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 