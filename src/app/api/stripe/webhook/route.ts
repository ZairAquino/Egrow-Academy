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
      return NextResponse.json(
        { error: 'Firma de webhook no encontrada' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Error verificando webhook:', err);
      return NextResponse.json(
        { error: 'Firma de webhook inválida' },
        { status: 400 }
      );
    }

    console.log('Webhook recibido:', event.type);

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
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

      default:
        console.log(`Evento no manejado: ${event.type}`);
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

// Manejadores de eventos
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Actualizar el pago en la base de datos
    await prisma.payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'SUCCEEDED',
        paymentMethod: paymentIntent.payment_method as string,
        updatedAt: new Date(),
      },
    });

    // Si el pago está relacionado con un curso, inscribir al usuario
    if (paymentIntent.metadata?.courseId) {
      const payment = await prisma.payment.findUnique({
        where: { stripePaymentId: paymentIntent.id },
        include: { user: true }
      });

      if (payment) {
        await prisma.enrollment.create({
          data: {
            userId: payment.userId,
            courseId: paymentIntent.metadata.courseId,
            status: 'ACTIVE',
          },
        });
      }
    }

    console.log(`Pago exitoso: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error manejando payment_intent.succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    await prisma.payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'FAILED',
        updatedAt: new Date(),
      },
    });

    console.log(`Pago fallido: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error manejando payment_intent.payment_failed:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const invoiceAny = invoice as any;
    if (invoiceAny.subscription) {
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: invoiceAny.subscription as string },
        include: { user: true }
      });

      if (subscription) {
        // Actualizar el estado de la suscripción
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'ACTIVE',
            updatedAt: new Date(),
          },
        });

        // Actualizar el nivel de membresía del usuario
        await prisma.user.update({
          where: { id: subscription.userId },
          data: { membershipLevel: 'PREMIUM' }
        });
      }
    }

    console.log(`Factura pagada exitosamente: ${invoice.id}`);
  } catch (error) {
    console.error('Error manejando invoice.payment_succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const invoiceAny = invoice as any;
    if (invoiceAny.subscription) {
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: invoiceAny.subscription as string },
        data: {
          status: 'PAST_DUE',
          updatedAt: new Date(),
        },
      });
    }

    console.log(`Factura con pago fallido: ${invoice.id}`);
  } catch (error) {
    console.error('Error manejando invoice.payment_failed:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const subscriptionAny = subscription as any;
    
    // Mapear el status de Stripe al enum de Prisma
    const mapStripeStatusToPrisma = (stripeStatus: string): string => {
      const statusMap: { [key: string]: string } = {
        'active': 'ACTIVE',
        'trialing': 'TRIALING',
        'canceled': 'CANCELED',
        'incomplete': 'INCOMPLETE',
        'incomplete_expired': 'INCOMPLETE_EXPIRED',
        'past_due': 'PAST_DUE',
        'unpaid': 'UNPAID'
      };
      return statusMap[stripeStatus] || 'ACTIVE';
    };

    // La suscripción ya debería estar creada en la base de datos
    // Solo actualizar si es necesario
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: mapStripeStatusToPrisma(subscription.status),
        currentPeriodStart: new Date(subscriptionAny.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionAny.current_period_end * 1000),
        cancelAtPeriodEnd: subscriptionAny.cancel_at_period_end,
        trialStart: subscriptionAny.trial_start ? new Date(subscriptionAny.trial_start * 1000) : null,
        trialEnd: subscriptionAny.trial_end ? new Date(subscriptionAny.trial_end * 1000) : null,
        updatedAt: new Date(),
      },
    });

    console.log(`Suscripción creada: ${subscription.id}`);
  } catch (error) {
    console.error('Error manejando customer.subscription.created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const subscriptionAny = subscription as any;
    
    // Mapear el status de Stripe al enum de Prisma
    const mapStripeStatusToPrisma = (stripeStatus: string): string => {
      const statusMap: { [key: string]: string } = {
        'active': 'ACTIVE',
        'trialing': 'TRIALING',
        'canceled': 'CANCELED',
        'incomplete': 'INCOMPLETE',
        'incomplete_expired': 'INCOMPLETE_EXPIRED',
        'past_due': 'PAST_DUE',
        'unpaid': 'UNPAID'
      };
      return statusMap[stripeStatus] || 'ACTIVE';
    };

    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
      include: { user: true }
    });

    if (dbSubscription) {
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: mapStripeStatusToPrisma(subscription.status),
          currentPeriodStart: new Date(subscriptionAny.current_period_start * 1000),
          currentPeriodEnd: new Date(subscriptionAny.current_period_end * 1000),
          cancelAtPeriodEnd: subscriptionAny.cancel_at_period_end,
          canceledAt: subscriptionAny.canceled_at ? new Date(subscriptionAny.canceled_at * 1000) : null,
          endedAt: subscriptionAny.ended_at ? new Date(subscriptionAny.ended_at * 1000) : null,
          trialStart: subscriptionAny.trial_start ? new Date(subscriptionAny.trial_start * 1000) : null,
          trialEnd: subscriptionAny.trial_end ? new Date(subscriptionAny.trial_end * 1000) : null,
          updatedAt: new Date(),
        },
      });

      // Actualizar el nivel de membresía del usuario
      const membershipLevel = (subscription.status === 'active' || subscription.status === 'trialing') 
        ? 'PREMIUM' 
        : 'FREE';

      await prisma.user.update({
        where: { id: dbSubscription.userId },
        data: { membershipLevel }
      });
    }

    console.log(`Suscripción actualizada: ${subscription.id}`);
  } catch (error) {
    console.error('Error manejando customer.subscription.updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
      include: { user: true }
    });

    if (dbSubscription) {
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: 'CANCELED',
          endedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Revertir el nivel de membresía del usuario
      await prisma.user.update({
        where: { id: dbSubscription.userId },
        data: { membershipLevel: 'FREE' }
      });
    }

    console.log(`Suscripción cancelada: ${subscription.id}`);
  } catch (error) {
    console.error('Error manejando customer.subscription.deleted:', error);
  }
} 