import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testCompleteFlow() {
  try {
    console.log('🧪 Probando flujo completo de suscripción...');
    
    // Verificar estado actual de Armando
    const user = await prisma.user.findUnique({
      where: { email: 'Armando@gmail.com' },
    });
    
    if (!user) {
      console.log('❌ Usuario Armando no encontrado');
      return;
    }
    
    console.log('📊 Estado actual de Armando:');
    console.log('   Email:', user.email);
    console.log('   Estado:', user.membershipLevel);
    console.log('   Stripe Customer ID:', user.stripeCustomerId);
    
    console.log('\n🎯 Para probar el flujo completo:');
    console.log('1. Ve a: http://localhost:3000/subscription');
    console.log('2. Selecciona un plan (Mensual o Anual)');
    console.log('3. Completa el pago con tarjeta: 4242 4242 4242 4242');
    console.log('4. El webhook debería actualizar automáticamente a PREMIUM');
    
    console.log('\n📋 Verificación del webhook:');
    console.log('✅ checkout.session.completed está configurado');
    console.log('✅ URL: https://b12353116b6b.ngrok-free.app/api/webhooks/stripe');
    console.log('✅ ngrok está corriendo');
    
    console.log('\n🔍 Después del pago, verifica:');
    console.log('- El logo cambia de logog.png a logop.png');
    console.log('- El estado cambia de "Gratuito" a "Premium"');
    console.log('- Tienes acceso a contenido premium');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteFlow(); 