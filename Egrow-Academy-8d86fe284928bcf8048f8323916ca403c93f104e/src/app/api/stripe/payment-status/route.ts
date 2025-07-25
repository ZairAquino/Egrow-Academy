import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const paymentIntent = searchParams.get('payment_intent');

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'ID de pago requerido' },
        { status: 400 }
      );
    }

    // Buscar el pago en la base de datos
    const payment = await prisma.payment.findUnique({
      where: { stripePaymentId: paymentIntent },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        subscription: {
          select: {
            id: true,
            status: true,
            currentPeriodEnd: true,
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Pago no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el usuario autenticado es el propietario del pago
    if (payment.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    // Verificar si el usuario está inscrito en el curso (si aplica)
    let enrollment = null;
    if (payment.courseId) {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: payment.userId,
            courseId: payment.courseId,
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        stripePaymentId: payment.stripePaymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
      course: payment.course,
      subscription: payment.subscription,
      enrollment: enrollment ? {
        id: enrollment.id,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt,
        progressPercentage: enrollment.progressPercentage,
      } : null,
    });

  } catch (error) {
    console.error('Error verificando estado del pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 