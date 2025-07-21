import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [SUBSCRIPTION-STATUS] Iniciando verificación...');
    
    // Obtener el token de las cookies
    const token = request.cookies.get('auth-token')?.value;
    console.log('🔍 [SUBSCRIPTION-STATUS] Token encontrado:', !!token);
    
    if (!token) {
      console.log('❌ [SUBSCRIPTION-STATUS] No hay token');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar el token
    console.log('🔍 [SUBSCRIPTION-STATUS] Verificando token...');
    let decoded;
    try {
      decoded = await verifyToken(token);
    } catch (error) {
      console.log('❌ [SUBSCRIPTION-STATUS] Token inválido');
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }
    const userId = decoded.userId;
    console.log('🔍 [SUBSCRIPTION-STATUS] Token verificado, userId:', userId);

    // Buscar suscripción activa del usuario
    console.log('🔍 [SUBSCRIPTION-STATUS] Buscando suscripción...');
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
      include: {
        price: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log('🔍 [SUBSCRIPTION-STATUS] Suscripción encontrada:', !!activeSubscription);

    return NextResponse.json({
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        status: activeSubscription.status,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
        price: {
          unitAmount: activeSubscription.price.unitAmount,
          currency: activeSubscription.price.currency,
          interval: activeSubscription.price.interval,
          product: {
            name: activeSubscription.price.product.name,
          },
        },
      } : null,
    });

  } catch (error) {
    console.error('❌ [SUBSCRIPTION-STATUS] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 