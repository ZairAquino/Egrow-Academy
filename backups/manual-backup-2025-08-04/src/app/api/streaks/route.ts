import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserStreakStats } from '@/lib/streaks';

/**
 * GET /api/streaks - Obtener estadísticas de rachas del usuario
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar token del usuario (buscar en cookies y headers)
    const cookieToken = request.cookies.get('auth-token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || headerToken;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (tokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const userId = decoded.userId;

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