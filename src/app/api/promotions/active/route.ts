import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    
    // Obtener promociones activas
    const activePromotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        OR: [
          {
            startDate: null,
            endDate: null,
          },
          {
            startDate: {
              lte: now,
            },
            endDate: {
              gte: now,
            },
          },
          {
            startDate: {
              lte: now,
            },
            endDate: null,
          },
          {
            startDate: null,
            endDate: {
              gte: now,
            },
          },
        ],
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 5, // Limitar a 5 promociones activas
    });

    return NextResponse.json({
      success: true,
      promotions: activePromotions,
    });
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 