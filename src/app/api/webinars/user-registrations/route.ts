import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await prisma.$connect();
    // Verificar token desde cookies o headers
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = extractTokenFromHeader(request)
    
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar token JWT
    const { userId } = verifyToken(token)

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener registros de webinars del usuario
    const registrations = await prisma.webinarRegistration.findMany({
      where: { userId: user.id },
      include: {
        webinar: {
          select: {
            id: true,
            title: true,
            dateTime: true,
            hostName: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transformar los datos para el frontend
    const formattedRegistrations = registrations.map(registration => ({
      webinarId: registration.webinarId,
      webinarTitle: registration.webinar.title,
      webinarDate: registration.webinar.dateTime,
      webinarTime: registration.webinar.dateTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      hostName: registration.webinar.hostName,
      registeredAt: registration.createdAt,
      reminderSent: false, // Por ahora siempre false, se puede implementar después
      reminderSentAt: null
    }));

    return NextResponse.json({
      registrations: formattedRegistrations
    });

  } catch (error) {
    console.error('Error obteniendo registros de webinars:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 