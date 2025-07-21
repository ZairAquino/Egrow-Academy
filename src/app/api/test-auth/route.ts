import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [TEST-AUTH] Iniciando prueba de autenticación...');
    
    // Obtener el token del header Authorization
    const token = extractTokenFromHeader(request);
    console.log('🔍 [TEST-AUTH] Token extraído:', token ? 'SÍ' : 'NO');
    
    if (!token) {
      console.log('❌ [TEST-AUTH] No hay token');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar el token
    console.log('🔍 [TEST-AUTH] Verificando token...');
    const decoded = verifyToken(token);
    const userId = decoded.userId;
    console.log('🔍 [TEST-AUTH] Token verificado, userId:', userId);
    
    return NextResponse.json({
      message: 'Autenticación funcionando correctamente',
      userId: userId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [TEST-AUTH] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 