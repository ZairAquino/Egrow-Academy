import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [TEST-PRISMA] Iniciando prueba de Prisma...');
    
    // Prueba simple de conexión
    const userCount = await prisma.user.count();
    console.log('🔍 [TEST-PRISMA] Usuarios en BD:', userCount);
    
    return NextResponse.json({
      message: 'Prisma funcionando correctamente',
      userCount: userCount,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [TEST-PRISMA] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 