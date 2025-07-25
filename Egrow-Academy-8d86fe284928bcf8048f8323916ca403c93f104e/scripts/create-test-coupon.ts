import 'dotenv/config';
import { stripe } from '../src/lib/stripe';

async function createTestCoupon() {
  console.log('🎫 Creando cupón de prueba para testing en producción...\n');

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Error: STRIPE_SECRET_KEY no está configurada');
      process.exit(1);
    }

    // Verificar que estamos en modo live
    const isLiveMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_');
    if (!isLiveMode) {
      console.error('❌ Error: Este script debe ejecutarse en modo LIVE');
      process.exit(1);
    }

    console.log('✅ Modo LIVE detectado - Creando cupón real\n');

    // Crear cupón de descuento del 99.86% (reduce $6.99 a $0.01)
    const coupon = await stripe.coupons.create({
      id: 'TEST_1CENT_MONTHLY',
      name: 'Prueba 1 Centavo - Plan Mensual',
      percent_off: 99.86, // Reduce el precio en 99.86%
      duration: 'once', // Solo se puede usar una vez
      max_redemptions: 1, // Máximo 1 uso
      metadata: {
        purpose: 'testing',
        user_email: 'aquinozair3@gmail.com',
        plan: 'monthly'
      }
    });

    console.log('✅ Cupón creado exitosamente:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎫 ID del cupón: ${coupon.id}`);
    console.log(`📝 Nombre: ${coupon.name}`);
    console.log(`💰 Descuento: ${coupon.percent_off}%`);
    console.log(`⏱️  Duración: ${coupon.duration}`);
    console.log(`🔢 Usos máximos: ${coupon.max_redemptions}`);
    console.log(`📧 Usuario: aquinozair3@gmail.com`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Crear también un cupón de descuento fijo como alternativa
    const fixedCoupon = await stripe.coupons.create({
      id: 'TEST_1CENT_FIXED',
      name: 'Prueba 1 Centavo - Descuento Fijo',
      amount_off: 698, // $6.98 de descuento (deja $0.01)
      currency: 'usd',
      duration: 'once',
      max_redemptions: 1,
      metadata: {
        purpose: 'testing',
        user_email: 'aquinozair3@gmail.com',
        plan: 'monthly',
        type: 'fixed_amount'
      }
    });

    console.log('✅ Cupón de descuento fijo creado:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎫 ID del cupón: ${fixedCoupon.id}`);
    console.log(`📝 Nombre: ${fixedCoupon.name}`);
    console.log(`💰 Descuento: $${(fixedCoupon.amount_off! / 100).toFixed(2)} USD`);
    console.log(`⏱️  Duración: ${fixedCoupon.duration}`);
    console.log(`🔢 Usos máximos: ${fixedCoupon.max_redemptions}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎯 Instrucciones para usar el cupón:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Ve a: https://egrowacademy.com/subscription');
    console.log('2. Selecciona el Plan Mensual ($6.99)');
    console.log('3. En el formulario de pago, busca la opción "Cupón" o "Código de descuento"');
    console.log('4. Ingresa uno de estos códigos:');
    console.log(`   • ${coupon.id} (descuento porcentual)`);
    console.log(`   • ${fixedCoupon.id} (descuento fijo)`);
    console.log('5. El precio se reducirá a $0.01 USD');
    console.log('6. Completa el pago con una tarjeta real');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('⚠️  IMPORTANTE:');
    console.log('• Este cupón solo se puede usar UNA VEZ');
    console.log('• Está configurado específicamente para testing');
    console.log('• El cargo será real pero mínimo ($0.01 USD)');
    console.log('• Después de la prueba, puedes cancelar la suscripción\n');

    console.log('✅ Cupones de prueba creados exitosamente');

  } catch (error) {
    console.error('❌ Error creando cupón:', error);
    process.exit(1);
  }
}

createTestCoupon(); 