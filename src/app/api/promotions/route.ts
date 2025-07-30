import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      promotions,
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      title,
      description,
      ctaText,
      ctaUrl,
      imageUrl,
      isActive = true,
      priority = 5,
      targetAudience = 'ALL',
      startDate,
      endDate,
      maxImpressions,
    } = body;

    // Validar datos requeridos
    if (!type || !title || !ctaText || !ctaUrl) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const promotion = await prisma.promotion.create({
      data: {
        type,
        title,
        description,
        ctaText,
        ctaUrl,
        imageUrl,
        isActive,
        priority,
        targetAudience,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        maxImpressions,
      },
    });

    return NextResponse.json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 