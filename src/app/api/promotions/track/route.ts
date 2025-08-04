import { NextRequest, NextResponse } from 'next/server';

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

    // Por ahora, solo loguear la interacción sin usar base de datos
    console.log('Promotion interaction:', {
      promotionId,
      userId,
      action,
      sessionId,
      pageUrl,
      referrer,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: 'Interaction logged successfully',
    });
  } catch (error) {
    console.error('Error tracking promotion interaction:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 