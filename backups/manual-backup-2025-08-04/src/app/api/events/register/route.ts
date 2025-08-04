import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendEventRegistrationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [EVENT-REGISTER] Iniciando registro a evento');
    
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;
    
    if (!token) {
      console.error('🔍 [EVENT-REGISTER] No se encontró token de autenticación');
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    console.log('🔍 [EVENT-REGISTER] Verificando token...');
    const { userId } = verifyToken(token);
    console.log('🔍 [EVENT-REGISTER] Token verificado, userId:', userId);

    const { eventId } = await request.json();
    console.log('🔍 [EVENT-REGISTER] Evento solicitado:', eventId);

    // Validar campos requeridos
    if (!eventId) {
      console.error('🔍 [EVENT-REGISTER] EventId faltante');
      return NextResponse.json(
        { error: 'ID del evento es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el evento existe y está activo
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      console.error('🔍 [EVENT-REGISTER] Evento no encontrado:', eventId);
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    if (event.status !== 'UPCOMING') {
      console.error('🔍 [EVENT-REGISTER] Evento no disponible:', eventId);
      return NextResponse.json(
        { error: 'Este evento no está disponible para registro' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya está registrado
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    if (existingRegistration) {
      console.log('🔍 [EVENT-REGISTER] Usuario ya registrado:', userId, eventId);
      return NextResponse.json(
        { error: 'Ya estás registrado en este evento' },
        { status: 400 }
      );
    }

    // Verificar límite de asistentes si existe
    if (event.maxCapacity) {
      const currentAttendees = await prisma.eventRegistration.count({
        where: { eventId }
      });

      if (currentAttendees >= event.maxCapacity) {
        console.error('🔍 [EVENT-REGISTER] Evento lleno:', eventId);
        return NextResponse.json(
          { error: 'Este evento ya no tiene cupos disponibles' },
          { status: 400 }
        );
      }
    }

    console.log('🔍 [EVENT-REGISTER] Creando registro...');
    
    // Crear el registro
    const registration = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        event: true
      }
    });

    console.log('✅ [EVENT-REGISTER] Registro creado exitosamente:', registration.id);

    // Enviar email de confirmación
    try {
      console.log('📧 [EVENT-REGISTER] Enviando email de confirmación...');
      const emailResult = await sendEventRegistrationEmail(
        registration.user.email,
        registration.user.firstName,
        registration.event.title,
        registration.event.startDate,
        registration.event.startDate,
        registration.event.type,
        'Instructor del evento',
        registration.event.description
      );

      if (emailResult.success) {
        console.log('✅ [EVENT-REGISTER] Email de confirmación enviado exitosamente');
      } else {
        console.error('❌ [EVENT-REGISTER] Error enviando email de confirmación:', emailResult.error);
      }
    } catch (emailError) {
      console.error('❌ [EVENT-REGISTER] Error en envío de email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: '¡Te has registrado exitosamente al evento! Te hemos enviado un email de confirmación.',
      registration: {
        id: registration.id,
        eventTitle: registration.event.title,
        eventDate: registration.event.startDate,
        eventTime: registration.event.startDate,
        registeredAt: registration.registeredAt
      }
    });

  } catch (error) {
    console.error('💥 [EVENT-REGISTER] Error completo:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Ya estás registrado en este evento' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 