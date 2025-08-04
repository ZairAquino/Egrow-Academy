import { NextRequest, NextResponse } from 'next/server';
import { sendPremiumWelcomeEmail } from '@/lib/email';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [EMAIL-PREMIUM] Iniciando envío de email de bienvenida premium...');
    
    // Verificar autenticación
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Obtener información del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea premium
    if (user.membershipLevel !== 'PREMIUM') {
      return NextResponse.json(
        { error: 'El usuario no tiene suscripción premium' },
        { status: 400 }
      );
    }

    // Enviar email de bienvenida premium
    const result = await sendPremiumWelcomeEmail(
      user.email,
      user.firstName || 'Usuario',
      user.lastName || '',
      user.membershipLevel
    );

    if (!result.success) {
      console.error('❌ [EMAIL-PREMIUM] Error enviando email:', result.error);
      return NextResponse.json(
        { error: result.error || 'Error al enviar el email' },
        { status: 500 }
      );
    }

    console.log('✅ [EMAIL-PREMIUM] Email de bienvenida premium enviado exitosamente a:', user.email);
    
    return NextResponse.json({
      success: true,
      message: 'Email de bienvenida premium enviado exitosamente'
    });

  } catch (error) {
    console.error('💥 [EMAIL-PREMIUM] Error completo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 