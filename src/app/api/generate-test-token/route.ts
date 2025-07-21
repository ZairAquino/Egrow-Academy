import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [GENERATE-TOKEN] Generando token de prueba...');
    
    const testEmail = 'luisdavid.ls47@gmail.com';
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario de prueba no encontrado' },
        { status: 404 }
      );
    }

    // Generar token usando la función del servidor
    const token = generateToken(user.id);
    
    console.log('🔍 [GENERATE-TOKEN] Token generado para:', user.email);
    
    return NextResponse.json({
      message: 'Token generado correctamente',
      token: token,
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [GENERATE-TOKEN] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 