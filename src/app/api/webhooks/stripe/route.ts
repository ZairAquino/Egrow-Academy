import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('❌ [WEBHOOK] No se encontró la firma de Stripe');
      return NextResponse.json(
        { error: 'No se encontró la firma de Stripe' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ [WEBHOOK] Error al verificar la firma:', err);
      return NextResponse.json(
        { error: 'Firma de webhook inválida' },
        { status: 400 }
      );
    }

    console.log('✅ [WEBHOOK] Evento recibido:', event.type);

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`⚠️ [WEBHOOK] Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ [WEBHOOK] Error general:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('💰 [WEBHOOK] Pago exitoso:', paymentIntent.id);
    
    // Actualizar el estado del pago en la base de datos
    await (prisma as any).payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'SUCCEEDED',
        updatedAt: new Date(),
      },
    });

    console.log('✅ [WEBHOOK] Pago actualizado en la base de datos');
  } catch (error) {
    console.error('❌ [WEBHOOK] Error al procesar pago exitoso:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('❌ [WEBHOOK] Pago fallido:', paymentIntent.id);
    
    await (prisma as any).payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'FAILED',
        updatedAt: new Date(),
      },
    });

    console.log('✅ [WEBHOOK] Estado de pago fallido actualizado');
  } catch (error) {
    console.error('❌ [WEBHOOK] Error al procesar pago fallido:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const subscriptionAny = subscription as any;
    console.log('📅 [WEBHOOK] Suscripción creada:', subscription.id);
    
    // Buscar el usuario por el customer ID de Stripe
    const user = await (prisma as any).user.findFirst({
      where: { stripeCustomerId: subscriptionAny.customer as string },
    });

    if (!user) {
      console.error('❌ [WEBHOOK] Usuario no encontrado para la suscripción');
      return;
    }

    // Crear o actualizar la suscripción en la base de datos
    await (prisma as any).subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status,
        currentPeriodStart: new Date(subscriptionAny.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionAny.current_period_end * 1000),
        updatedAt: new Date(),
      },
      create: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        stripePriceId: subscriptionAny.items.data[0].price.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscriptionAny.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionAny.current_period_end * 1000),
      },
    });

    // Actualizar el nivel de membresía del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: { membershipLevel: 'PREMIUM' },
    });

    console.log('✅ [WEBHOOK] Suscripción creada y usuario actualizado');
  } catch (error) {
    console.error('❌ [WEBHOOK] Error al procesar suscripción creada:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('🔄 [WEBHOOK] Suscripción actualizada:', subscription.id);
    
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      },
    });

    console.log('✅ [WEBHOOK] Suscripción actualizada en la base de datos');
  } catch (error) {
    console.error('❌ [WEBHOOK] Error al procesar suscripción actualizada:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('🗑️ [WEBHOOK] Suscripción cancelada:', subscription.id);
    
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        updatedAt: new Date(),
      },
    });

    // Buscar el usuario y actualizar su nivel de membresía
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { membershipLevel: 'FREE' },
      });
    }

    console.log('✅ [WEBHOOK] Suscripción cancelada y usuario actualizado');
  } catch (error) {
    console.error('❌ [WEBHOOK] Error al procesar suscripción cancelada:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('💰 [WEBHOOK] Factura pagada:', invoice.id);
    
    // Aquí puedes agregar lógica adicional para facturas pagadas
    // Por ejemplo, enviar emails de confirmación, etc.
    
    console.log('✅ [WEBHOOK] Factura procesada correctamente');
  } catch (error) {
    console.error('❌ [WEBHOOK] Error al procesar factura pagada:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('❌ [WEBHOOK] Factura fallida:', invoice.id);
    
    // Aquí puedes agregar lógica para manejar pagos fallidos
    // Por ejemplo, enviar emails de notificación, etc.
    
    console.log('✅ [WEBHOOK] Factura fallida procesada');
  } catch (error) {
    console.error('❌ [WEBHOOK] Error al procesar factura fallida:', error);
  }
} 