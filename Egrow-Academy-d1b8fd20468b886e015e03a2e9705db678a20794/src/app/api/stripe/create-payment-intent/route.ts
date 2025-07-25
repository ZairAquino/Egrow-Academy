import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, createOrRetrieveCustomer } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { CreatePaymentIntentRequest } from '@/types/stripe';

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

    const body: CreatePaymentIntentRequest = await request.json();
    const { amount, currency = 'usd', courseId, subscriptionId, metadata = {} } = body;

    // Validar datos requeridos
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Monto inválido' },
        { status: 400 }
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

    // Crear o recuperar cliente de Stripe
    const customer = await createOrRetrieveCustomer(user.email, user.id);

    // Agregar metadatos adicionales
    const paymentMetadata = {
      ...metadata,
      userId: user.id,
      userEmail: user.email,
      ...(courseId && { courseId }),
      ...(subscriptionId && { subscriptionId }),
    };

    // Crear PaymentIntent
    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      customerId: customer.id,
      metadata: paymentMetadata,
    });

    // Guardar el pago en la base de datos
    const payment = await prisma.payment.create({
      data: {
        stripePaymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'PENDING',
        description: metadata.description || 'Pago de curso',
        metadata: paymentMetadata,
        userId: user.id,
        courseId: courseId || null,
        subscriptionId: subscriptionId || null,
      },
    });

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 