import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Error verificando webhook:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    console.log('Webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      console.error('Metadata faltante en checkout session:', session.id);
      return;
    }

    // Actualizar usuario con stripeCustomerId y membershipLevel
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: session.customer as string,
        membershipLevel: 'PREMIUM',
      },
    });

    console.log(`✅ Usuario ${userId} actualizado a PREMIUM con plan ${planId}`);
  } catch (error) {
    console.error('Error manejando checkout session completed:', error);
  }
}

async function handleSubscriptionCreated(stripeSubscription: Stripe.Subscription) {
  try {
    const userId = stripeSubscription.metadata?.userId;
    const planId = stripeSubscription.metadata?.planId;

    if (!userId || !planId) {
      console.error('Metadata faltante en subscription:', stripeSubscription.id);
      return;
    }

    // Actualizar usuario a PREMIUM
    await prisma.user.update({
      where: { id: userId },
      data: {
        membershipLevel: 'PREMIUM',
      },
    });

    // Crear o actualizar suscripción en la base de datos
    const price = await prisma.price.findFirst({
      where: { stripePriceId: stripeSubscription.items.data[0].price.id }
    });

    if (price) {
      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: stripeSubscription.id },
        update: {
          status: stripeSubscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
          currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
        },
        create: {
          stripeSubscriptionId: stripeSubscription.id,
          status: stripeSubscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
          currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
          userId: userId,
          priceId: price.id,
        },
      });
    }

    console.log(`✅ Suscripción creada y usuario ${userId} actualizado a PREMIUM`);
  } catch (error) {
    console.error('Error manejando subscription created:', error);
  }
}

async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  try {
    const userId = stripeSubscription.metadata?.userId;

    if (!userId) {
      console.error('Metadata faltante en subscription update:', stripeSubscription.id);
      return;
    }

    // Actualizar estado de suscripción
    await prisma.subscription.updateMany({
      where: { 
        stripeSubscriptionId: stripeSubscription.id,
        userId: userId 
      },
      data: {
        status: stripeSubscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
      },
    });

    console.log(`Suscripción actualizada para usuario ${userId}`);
  } catch (error) {
    console.error('Error manejando subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  try {
    const userId = stripeSubscription.metadata?.userId;

    if (!userId) {
      console.error('Metadata faltante en subscription deleted:', stripeSubscription.id);
      return;
    }

    // Actualizar usuario a GRATUITO
    await prisma.user.update({
      where: { id: userId },
      data: {
        membershipLevel: 'GRATUITO',
      },
    });

    // Cancelar suscripción del usuario
    await prisma.subscription.updateMany({
      where: { 
        stripeSubscriptionId: stripeSubscription.id,
        userId: userId 
      },
      data: {
        status: 'CANCELED',
        canceledAt: new Date((stripeSubscription as any).canceled_at! * 1000),
      },
    });

    console.log(`❌ Suscripción cancelada y usuario ${userId} vuelto a GRATUITO`);
  } catch (error) {
    console.error('Error manejando subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if ((invoice as any).subscription) {
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
      const userId = subscription.metadata?.userId;

      if (userId) {
        // La información de renovación se maneja en el modelo Subscription
        console.log(`Pago exitoso para usuario ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error manejando invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if ((invoice as any).subscription) {
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
      const userId = subscription.metadata?.userId;

      if (userId) {
        // Actualizar estado de suscripción a PAST_DUE
        await prisma.subscription.updateMany({
          where: { 
            stripeSubscriptionId: subscription.id,
            userId: userId 
          },
          data: {
            status: 'PAST_DUE',
          },
        });

        console.log(`Pago fallido para usuario ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error manejando invoice payment failed:', error);
  }
} 