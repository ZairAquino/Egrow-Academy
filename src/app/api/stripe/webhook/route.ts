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

    // Actualizar usuario con stripeCustomerId
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: session.customer as string,
      },
    });

    console.log(`Usuario ${userId} suscrito al plan ${planId}`);
  } catch (error) {
    console.error('Error manejando checkout session completed:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    const planId = subscription.metadata?.planId;

    if (!userId || !planId) {
      console.error('Metadata faltante en subscription:', subscription.id);
      return;
    }

    // Crear o actualizar suscripción en la base de datos
    const price = await prisma.price.findFirst({
      where: { stripePriceId: subscription.items.data[0].price.id }
    });

    if (price) {
      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        update: {
          status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          stripeSubscriptionId: subscription.id,
          status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          userId: userId,
          priceId: price.id,
        },
      });
    }

    console.log(`Suscripción creada para usuario ${userId}`);
  } catch (error) {
    console.error('Error manejando subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Metadata faltante en subscription update:', subscription.id);
      return;
    }

    // Actualizar estado de suscripción
    await prisma.subscription.updateMany({
      where: { 
        stripeSubscriptionId: subscription.id,
        userId: userId 
      },
      data: {
        status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    console.log(`Suscripción actualizada para usuario ${userId}`);
  } catch (error) {
    console.error('Error manejando subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('Metadata faltante en subscription deleted:', subscription.id);
      return;
    }

    // Cancelar suscripción del usuario
    await prisma.subscription.updateMany({
      where: { 
        stripeSubscriptionId: subscription.id,
        userId: userId 
      },
      data: {
        status: 'CANCELLED',
        canceledAt: new Date(subscription.canceled_at! * 1000),
      },
    });

    console.log(`Suscripción cancelada para usuario ${userId}`);
  } catch (error) {
    console.error('Error manejando subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const userId = subscription.metadata?.userId;

      if (userId) {
        // Actualizar fecha de renovación
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionEndDate: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`Pago exitoso para usuario ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error manejando invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      const userId = subscription.metadata?.userId;

      if (userId) {
        // Marcar suscripción como inactiva
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'PAST_DUE',
          },
        });

        console.log(`Pago fallido para usuario ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error manejando invoice payment failed:', error);
  }
} 