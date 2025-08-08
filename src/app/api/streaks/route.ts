import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifySession } from '@/lib/auth';
import { getUserStreakStats } from '@/lib/streaks';

/**
 * GET /api/streaks - Obtener estadísticas de rachas del usuario
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar token del usuario (buscar en cookies y headers)
    const sessionCookie = request.cookies.get('session')?.value; // principal
    const legacyCookie = request.cookies.get('auth-token')?.value; // compatibilidad
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = sessionCookie || legacyCookie || headerToken;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Soportar sesiones en BD y JWT
    let userId: string | null = null;
    const sessionUser = await verifySession(token);
    if (sessionUser) {
      userId = sessionUser.userId;
    } else {
      try {
        const decoded = verifyToken(token);
        userId = decoded.userId;
      } catch (tokenError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Obtener estadísticas de rachas
    const stats = await getUserStreakStats(userId);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting streak stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}