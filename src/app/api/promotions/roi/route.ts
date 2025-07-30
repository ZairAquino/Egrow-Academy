import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const promotionId = searchParams.get('promotionId');
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Obtener promociones con sus interacciones
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        ...(promotionId && { id: promotionId }),
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

    // Calcular métricas de ROI por promoción
    const roiStats = promotions.map(promotion => {
      const impressions = promotion.interactions.filter(i => i.action === 'IMPRESSION').length;
      const clicks = promotion.interactions.filter(i => i.action === 'CLICK').length;
      const conversions = promotion.interactions.filter(i => i.action === 'CONVERSION').length;
      const closes = promotion.interactions.filter(i => i.action === 'CLOSE').length;

      // Calcular tasas
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      const overallConversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;

      // Calcular ingresos estimados (asumiendo $6.99 por suscripción mensual)
      const estimatedRevenue = conversions * 6.99;
      const estimatedYearlyRevenue = conversions * 59.99; // Plan anual

      // Calcular costo por adquisición (CPA) si se tiene información de costos
      const estimatedCPA = clicks > 0 ? 0 : 0; // Se puede agregar lógica de costos

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
          overallConversionRate: Math.round(overallConversionRate * 100) / 100,
        },
        roi: {
          estimatedRevenue,
          estimatedYearlyRevenue,
          estimatedCPA,
          revenuePerImpression: impressions > 0 ? estimatedRevenue / impressions : 0,
          revenuePerClick: clicks > 0 ? estimatedRevenue / clicks : 0,
        },
      };
    });

    // Calcular métricas agregadas
    const totalImpressions = roiStats.reduce((sum, stat) => sum + stat.metrics.impressions, 0);
    const totalClicks = roiStats.reduce((sum, stat) => sum + stat.metrics.clicks, 0);
    const totalConversions = roiStats.reduce((sum, stat) => sum + stat.metrics.conversions, 0);
    const totalRevenue = roiStats.reduce((sum, stat) => sum + stat.roi.estimatedRevenue, 0);

    const aggregateStats = {
      totalImpressions,
      totalClicks,
      totalConversions,
      totalRevenue,
      overallCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      overallConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      overallRevenuePerImpression: totalImpressions > 0 ? totalRevenue / totalImpressions : 0,
      overallRevenuePerClick: totalClicks > 0 ? totalRevenue / totalClicks : 0,
    };

    return NextResponse.json({
      success: true,
      stats: roiStats,
      aggregate: aggregateStats,
      period: `${days} días`,
    });
  } catch (error) {
    console.error('Error calculating ROI stats:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 