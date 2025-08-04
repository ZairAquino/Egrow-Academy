import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [USER-REGISTRATIONS] Obteniendo registros del usuario');
    
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;
    
    if (!token) {
      console.error('🔍 [USER-REGISTRATIONS] No se encontró token de autenticación');
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    console.log('🔍 [USER-REGISTRATIONS] Verificando token...');
    const { userId } = verifyToken(token);
    console.log('🔍 [USER-REGISTRATIONS] Token verificado, userId:', userId);

    // Obtener todos los registros del usuario
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            type: true,
            category: true,
            instructor: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });

    console.log('✅ [USER-REGISTRATIONS] Registros obtenidos:', registrations.length);

    // Formatear la respuesta
    const formattedRegistrations = registrations.map(registration => ({
      eventId: registration.eventId,
      eventTitle: registration.event.title,
      eventDate: registration.event.date,
      eventTime: registration.event.time,
      eventType: registration.event.type,
      eventCategory: registration.event.category,
      instructor: registration.event.instructor,
      registeredAt: registration.registeredAt,
      reminderSent: registration.reminderSent,
      reminderSentAt: registration.reminderSentAt
    }));

    return NextResponse.json({
      success: true,
      registrations: formattedRegistrations
    });

  } catch (error) {
    console.error('💥 [USER-REGISTRATIONS] Error completo:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 