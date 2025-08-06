import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check cookies first, then authorization header
    const cookieToken = request.cookies.get('session')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = extractTokenFromHeader(authHeader);
    
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    // Verify token
    const { userId } = verifyToken(token);

    // Delete session from database
    await prisma.session.delete({
      where: { token }
    });

    // Create response
    const response = NextResponse.json({ 
      message: 'Sesión cerrada exitosamente' 
    });

    // Clear cookie
    response.cookies.delete('session');

    return response;

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    
    // Even if there's an error, clear the cookie
    const response = NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
    
    response.cookies.delete('session');
    return response;
  }
}