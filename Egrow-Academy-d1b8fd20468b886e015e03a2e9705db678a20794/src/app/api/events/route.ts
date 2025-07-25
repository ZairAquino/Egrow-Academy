import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 [EVENTS] Obteniendo eventos');

    // Obtener todos los eventos activos
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: 'asc' }
    });

    console.log('✅ [EVENTS] Eventos obtenidos:', events.length);

    // Formatear la respuesta con conteo de asistentes
    const eventsWithAttendees = await Promise.all(
      events.map(async (event) => {
        const attendeesCount = await prisma.eventRegistration.count({
          where: { eventId: event.id }
        });

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          type: event.type,
          category: event.category,
          instructor: event.instructor,
          image: event.image,
          maxAttendees: event.maxAttendees,
          isActive: event.isActive,
          attendees: attendeesCount
        };
      })
    );

    return NextResponse.json({
      success: true,
      events: eventsWithAttendees
    });

  } catch (error) {
    console.error('💥 [EVENTS] Error completo:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 