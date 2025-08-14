import { NextRequest, NextResponse } from 'next/server';
import { stripe, createOrRetrieveCustomer } from '@/lib/stripe';
import { getCoursePriceId } from '@/lib/pricing-server';
import { prisma } from '@/lib/prisma';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Autenticación: cookie 'session' o header Authorization
    const token =
      request.cookies.get('session')?.value ||
      request.cookies.get('auth-token')?.value ||
      extractTokenFromHeader(request);

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { courseId, successUrl, cancelUrl, currency } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: 'courseId requerido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const customer = await createOrRetrieveCustomer(user.email, user.id);

    const origin = request.nextUrl.origin;
    const cookieCurrency = request.cookies.get('currency')?.value;
    const resolvedCurrency = ((currency || cookieCurrency || 'usd') as string).toLowerCase();
    const priceId = await getCoursePriceId(resolvedCurrency);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          userId: user.id,
          courseId,
          description: 'Pago de curso individual',
          purpose: 'course_one_time',
          currency: resolvedCurrency,
        },
      },
      success_url: successUrl || `${origin}/payment/success?type=course&courseId=${encodeURIComponent(courseId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/curso/${encodeURIComponent(courseId)}`,
      allow_promotion_codes: false,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creando checkout session de curso:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}


