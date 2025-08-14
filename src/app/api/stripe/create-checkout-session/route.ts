
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSubscriptionPriceId } from '@/lib/pricing-server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('🔧 [CHECKOUT] Iniciando creación de sesión de checkout...');
  try {
    // Verificar autenticación (aceptar cookie 'session' o legado 'auth-token', y header Authorization)
    const token =
      request.cookies.get('session')?.value ||
      request.cookies.get('auth-token')?.value ||
      extractTokenFromHeader(request);
    console.log('🔧 [CHECKOUT] Token encontrado:', token ? 'Sí' : 'No');
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { planId, trackingData, discountData, currency } = await request.json();
    console.log('🔧 [CHECKOUT] Plan solicitado:', planId);
    console.log('🔧 [CHECKOUT] Tracking data:', trackingData);
    console.log('🔧 [CHECKOUT] Discount data:', discountData);

    // Validar el plan
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    console.log('🔧 [CHECKOUT] Plan encontrado:', plan ? plan.name : 'No encontrado');
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

    // Descuentos: usar cupones/promotion codes para que solo apliquen al primer mes
    let discountDescription = '';
    let subscriptionDiscounts: any[] = [];
    // Valor de descuento aplicado (0-1) para efectos informativos/metadata
    let discountApplied = 0;
    if (discountData && discountData.code && discountData.discount) {
      const validCodes = { 'WEBINAR50': { discount: 0.5, planId: 'monthly' as const } };
      const validCode = validCodes[discountData.code as keyof typeof validCodes];
      if (validCode && validCode.planId === planId) {
        discountApplied = validCode.discount;
        discountDescription = ` (${Math.round(validCode.discount * 100)}% desc. - ${discountData.code} 1er mes)`;

        try {
          // Buscar promotion code existente en Stripe
          const promoList = await stripe.promotionCodes.list({ code: discountData.code, limit: 1, active: true });
          let promotionCodeId = promoList.data[0]?.id;

          if (!promotionCodeId) {
            // Crear cupón de 50% por una sola vez (solo primer ciclo)
            const coupon = await stripe.coupons.create({
              percent_off: Math.round(validCode.discount * 100),
              duration: 'once',
              name: `${discountData.code}-first-month-${Math.round(validCode.discount * 100)}%`,
            });
            const promotionCode = await stripe.promotionCodes.create({ coupon: coupon.id, code: discountData.code, active: true });
            promotionCodeId = promotionCode.id;
          }

          if (promotionCodeId) {
            subscriptionDiscounts = [{ promotion_code: promotionCodeId }];
          }
        } catch (e) {
          console.warn('⚠️ [CHECKOUT] No se pudo preparar el promotion code, se continuará sin descuento automático:', e);
        }
      }
    }

    // Calcular precio final solo para referencia/metadata (Stripe calcula con el coupon)
    const finalPrice = Number((plan.price * (1 - discountApplied)).toFixed(2));

    // Crear sesión de checkout
    const cookieCurrency = request.cookies.get('currency')?.value;
    const resolvedCurrency = ((currency || cookieCurrency || 'usd') as string).toLowerCase();
    const priceId = await getSubscriptionPriceId(planId, resolvedCurrency);

    const sessionConfig: any = {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://egrowacademy.com'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://egrowacademy.com'}/subscription`,
      customer: stripeCustomerId, // Usar el customer en lugar de customer_email
      metadata: {
        userId: decoded.userId,
        planId: plan.id,
        currency: resolvedCurrency,
        // Agregar datos de tracking si existen
        ...(trackingData?.promotionId && { promotionId: trackingData.promotionId }),
        ...(trackingData?.sessionId && { sessionId: trackingData.sessionId }),
        ...(trackingData?.pageUrl && { pageUrl: trackingData.pageUrl }),
        ...(trackingData?.referrer && { referrer: trackingData.referrer }),
        ...(trackingData?.userAgent && { userAgent: trackingData.userAgent }),
        // Agregar datos de descuento si existen
        ...(discountData?.code && { discountCode: discountData.code }),
        ...(discountData?.discount && { discountAmount: discountData.discount.toString() }),
        planName: plan.name,
        originalPrice: plan.price.toString(),
        finalPrice: finalPrice.toString(),
      },
      subscription_data: {
        metadata: {
          userId: decoded.userId,
          planId: plan.id,
          currency: resolvedCurrency,
          planName: plan.name,
          ...(discountData?.code && { discountCode: discountData.code }),
          ...(discountData?.discount && { discountAmount: discountData.discount.toString() }),
          originalPrice: plan.price.toString(),
          finalPrice: finalPrice.toString(),
        },
      },
      ...(subscriptionDiscounts.length > 0 ? { discounts: subscriptionDiscounts } : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

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