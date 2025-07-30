import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 [EVENTS] Obteniendo eventos');

    // Obtener todos los eventos activos usando la estructura correcta de la tabla
    const events = await prisma.$queryRaw`
      SELECT 
        id,
        title,
        description,
        date,
        time,
        type,
        category,
        instructor,
        image,
        max_attendees as "maxAttendees",
        is_active as "isActive",
        attendees,
        status
      FROM events 
      WHERE status != 'CANCELLED' 
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