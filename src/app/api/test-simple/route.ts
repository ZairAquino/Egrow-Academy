import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [TEST-SIMPLE] API funcionando');
    
    return NextResponse.json({
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [TEST-SIMPLE] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 