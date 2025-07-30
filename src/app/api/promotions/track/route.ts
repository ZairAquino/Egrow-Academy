import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      promotionId,
      userId,
      action,
      sessionId,
      pageUrl,
      referrer,
      userAgent,
    } = body;

    // Validar datos requeridos
    if (!promotionId || !action) {
      return NextResponse.json(
        { success: false, error: 'promotionId y action son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la promoción existe
    const promotion = await prisma.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      return NextResponse.json(
        { success: false, error: 'Promoción no encontrada' },
        { status: 404 }
      );
    }

    // Crear la interacción
    const interaction = await prisma.promotionInteraction.create({
      data: {
        promotionId,
        userId: userId || null,
        action,
        sessionId: sessionId || null,
        pageUrl: pageUrl || null,
        referrer: referrer || null,
        userAgent: userAgent || null,
      },
    });

    // Si es una impresión, incrementar el contador
    if (action === 'IMPRESSION') {
      await prisma.promotion.update({
        where: { id: promotionId },
        data: {
          currentImpressions: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      interaction,
    });
  } catch (error) {
    console.error('Error tracking promotion interaction:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 