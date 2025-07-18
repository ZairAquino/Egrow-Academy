import { NextRequest, NextResponse } from 'next/server';
import { createSubscription, createOrRetrieveCustomer } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { CreateSubscriptionRequest } from '@/types/stripe';

export async function POST(request: NextRequest) {
  try {
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

    const body: CreateSubscriptionRequest = await request.json();
    const { priceId, courseId, trialPeriodDays, metadata = {} } = body;

    // Validar datos requeridos
    if (!priceId) {
      return NextResponse.json(
        { error: 'ID de precio requerido' },
        { status: 400 }
      );
    }

    // Verificar que el precio existe
    const price = await prisma.price.findUnique({
      where: { stripePriceId: priceId },
      include: { product: true }
    });

    if (!price) {
      return NextResponse.json(
        { error: 'Precio no encontrado' },
        { status: 404 }
      );
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya tiene una suscripción activa
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['ACTIVE', 'TRIALING'] }
      }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Ya tienes una suscripción activa' },
        { status: 400 }
      );
    }

    // Crear o recuperar cliente de Stripe
    const customer = await createOrRetrieveCustomer(user.email, user.id);

    // Agregar metadatos adicionales
    const subscriptionMetadata = {
      ...metadata,
      userId: user.id,
      userEmail: user.email,
      ...(courseId && { courseId }),
    };

    // Crear suscripción en Stripe
    const stripeSubscription = await createSubscription({
      customerId: customer.id,
      priceId,
      metadata: subscriptionMetadata,
      trialPeriodDays,
    });

    // Guardar la suscripción en la base de datos
    const subscription = await prisma.subscription.create({
      data: {
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
        endedAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
        trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
        metadata: subscriptionMetadata,
        userId: user.id,
        priceId: price.id,
      },
    });

    // Actualizar el nivel de membresía del usuario si la suscripción está activa
    if (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing') {
      await prisma.user.update({
        where: { id: user.id },
        data: { membershipLevel: 'PREMIUM' }
      });
    }

    // Obtener el client secret del payment intent si existe
    const clientSecret = stripeSubscription.latest_invoice?.payment_intent?.client_secret;

    return NextResponse.json({
      success: true,
      subscriptionId: stripeSubscription.id,
      clientSecret,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 