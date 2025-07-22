import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { verifyToken } from '@/lib/auth';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { planId } = await request.json();

    // Validar el plan
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        email: true, 
        firstName: true, 
        lastName: true,
        stripeCustomerId: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    // Si el usuario no tiene stripeCustomerId, crear uno
    if (!stripeCustomerId) {
      console.log('🔧 [CHECKOUT] Creando customer de Stripe para:', user.email);
      
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: {
          userId: decoded.userId,
        },
      });

      stripeCustomerId = customer.id;

      // Actualizar el usuario con el stripeCustomerId
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { stripeCustomerId: customer.id },
      });

      console.log('✅ [CHECKOUT] Customer creado y asignado:', customer.id);
    } else {
      console.log('✅ [CHECKOUT] Usando customer existente:', stripeCustomerId);
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: `Suscripción ${plan.interval === 'month' ? 'mensual' : 'anual'} a eGrow Academy`,
            },
            unit_amount: Math.round(plan.price * 100), // Stripe usa centavos
            recurring: {
              interval: plan.interval as 'month' | 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
      customer: stripeCustomerId, // Usar el customer en lugar de customer_email
      metadata: {
        userId: decoded.userId,
        planId: plan.id,
        planName: plan.name,
      },
      subscription_data: {
        metadata: {
          userId: decoded.userId,
          planId: plan.id,
          planName: plan.name,
        },
      },
    });

    console.log('✅ [CHECKOUT] Sesión creada:', session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ [CHECKOUT] Error creando sesión de checkout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 