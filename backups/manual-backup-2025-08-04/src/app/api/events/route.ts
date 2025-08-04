import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 [EVENTS] Obteniendo eventos');

    // Obtener todos los eventos para ver la estructura exacta
    const events = await prisma.$queryRaw`
      SELECT * FROM events 
      ORDER BY date ASC
    `;

    console.log('✅ [EVENTS] Eventos obtenidos:', events.length);

    return NextResponse.json({
      success: true,
      events: events
    });

  } catch (error) {
    console.error('💥 [EVENTS] Error completo:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
} 