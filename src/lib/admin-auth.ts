import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * Función reutilizable para verificar autenticación y rol ADMIN en APIs
 * Usa exactamente el mismo método que /api/auth/me
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{success: boolean, userId?: string, response?: NextResponse}> {
  try {
    // ✅ USAR EXACTAMENTE EL MISMO MÉTODO QUE /api/auth/me
    const cookieToken = request.cookies.get('session')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Token no proporcionado' },
          { status: 401 }
        )
      };
    }

    // Verificar token JWT
    const { userId } = verifyToken(token);

    // Verificar si es una sesión de base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    });

    // Si es una sesión de BD, verificar que no haya expirado
    if (session && session.expiresAt < new Date()) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Sesión expirada' },
          { status: 401 }
        )
      };
    }

    // Obtener usuario y verificar rol ADMIN
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true, emailVerified: true }
    });

    if (!user) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        )
      };
    }

    if (user.role !== 'ADMIN') {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Acceso denegado. Se requieren permisos de administrador.' },
          { status: 403 }
        )
      };
    }

    return { success: true, userId };
    
  } catch (error) {
    console.error('Error en verificación admin:', error);
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    };
  }
}