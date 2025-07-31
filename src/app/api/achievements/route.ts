import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { AchievementService } from '@/lib/achievements';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeProgress = searchParams.get('includeProgress') === 'true';

    // Obtener logros del usuario
    const achievements = await prisma.achievement.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    let response: any = { achievements };

    // Incluir progreso si se solicita
    if (includeProgress) {
      const progress = await AchievementService.getUserProgress(session.user.id);
      response.progress = progress;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Error al obtener logros' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, metadata } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Acción requerida' },
        { status: 400 }
      );
    }

    // Registrar acción y verificar logros
    const newAchievements = await AchievementService.recordUserAction(
      session.user.id,
      action,
      metadata
    );

    return NextResponse.json({
      success: true,
      achievements: newAchievements,
      message: newAchievements.length > 0 
        ? `¡Felicitaciones! Has desbloqueado ${newAchievements.length} logro(s)`
        : 'Acción registrada correctamente'
    });
  } catch (error) {
    console.error('Error recording user action:', error);
    return NextResponse.json(
      { error: 'Error al registrar acción' },
      { status: 500 }
    );
  }
} 