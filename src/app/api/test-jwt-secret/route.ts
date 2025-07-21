import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [TEST-JWT-SECRET] Verificando JWT_SECRET...');
    
    const jwtSecret = process.env.JWT_SECRET;
    console.log('🔍 [TEST-JWT-SECRET] JWT_SECRET configurado:', !!jwtSecret);
    console.log('🔍 [TEST-JWT-SECRET] JWT_SECRET length:', jwtSecret?.length);
    console.log('🔍 [TEST-JWT-SECRET] JWT_SECRET starts with:', jwtSecret?.substring(0, 10));
    
    return NextResponse.json({
      message: 'JWT_SECRET verificado',
      hasSecret: !!jwtSecret,
      secretLength: jwtSecret?.length,
      secretStart: jwtSecret?.substring(0, 10),
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [TEST-JWT-SECRET] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 