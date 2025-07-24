import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  console.log('🎫 [COUPON] Validando cupón...');
  
  try {
    // Verificar autenticación
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { couponCode } = await request.json();
    console.log('🎫 [COUPON] Código recibido:', couponCode);

    if (!couponCode) {
      return NextResponse.json({ error: 'Código de cupón requerido' }, { status: 400 });
    }

    // Validar cupón en Stripe
    try {
      const coupon = await stripe.coupons.retrieve(couponCode);
      console.log('🎫 [COUPON] Cupón encontrado:', coupon.id);

      // Verificar si el cupón está activo
      if (!coupon.valid) {
        return NextResponse.json({ error: 'Cupón no válido o expirado' }, { status: 400 });
      }

      // Verificar si se ha agotado
      if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
        return NextResponse.json({ error: 'Cupón agotado' }, { status: 400 });
      }

      // Verificar si está restringido a un email específico
      if (coupon.metadata?.user_email) {
        // Aquí podrías verificar el email del usuario actual
        // Por ahora permitimos cualquier usuario
        console.log('🎫 [COUPON] Cupón restringido a:', coupon.metadata.user_email);
      }

      return NextResponse.json({
        success: true,
        coupon: {
          id: coupon.id,
          name: coupon.name,
          percent_off: coupon.percent_off,
          amount_off: coupon.amount_off,
          currency: coupon.currency,
          duration: coupon.duration,
          valid: coupon.valid
        }
      });

    } catch (stripeError: any) {
      console.error('🎫 [COUPON] Error de Stripe:', stripeError);
      
      if (stripeError.code === 'resource_missing') {
        return NextResponse.json({ error: 'Código de cupón no válido' }, { status: 400 });
      }
      
      return NextResponse.json({ error: 'Error al validar cupón' }, { status: 500 });
    }

  } catch (error) {
    console.error('🎫 [COUPON] Error general:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 