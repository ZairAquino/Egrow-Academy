import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader, verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [SUBSCRIPTION-STATUS] Iniciando verificación...');
    
    // Obtener el token de las cookies (priorizar 'session') o header
    const token =
      request.cookies.get('session')?.value ||
      request.cookies.get('auth-token')?.value ||
      extractTokenFromHeader(request);
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
    // Aceptar tanto sesiones en BD como JWT
    let userId: string | null = null;
    const sessionUser = await verifySession(token);
    if (sessionUser) {
      userId = sessionUser.userId;
    } else {
      try {
        const decoded = verifyToken(token);
        userId = decoded.userId;
      } catch (error) {
        console.log('❌ [SUBSCRIPTION-STATUS] Token inválido');
        return NextResponse.json(
          { error: 'Token inválido' },
          { status: 401 }
        );
      }
    }
    console.log('🔍 [SUBSCRIPTION-STATUS] Token verificado, userId:', userId);

    // Obtener información del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        membershipLevel: true,
        stripeCustomerId: true
      }
    });

    if (!user) {
      console.log('❌ [SUBSCRIPTION-STATUS] Usuario no encontrado');
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('🔍 [SUBSCRIPTION-STATUS] Membership Level:', user.membershipLevel);

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

    // Lógica mejorada: considerar tanto suscripción activa como membershipLevel
    const hasActiveSubscription = !!activeSubscription || user.membershipLevel === 'PREMIUM';

    console.log('🔍 [SUBSCRIPTION-STATUS] Acceso premium:', hasActiveSubscription);

    return NextResponse.json({
      hasActiveSubscription,
      membershipLevel: user.membershipLevel,
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