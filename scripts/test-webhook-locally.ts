import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testWebhookLocally() {
  try {
    console.log('🧪 Probando webhook localmente...');
    
    // Buscar el usuario Armando
    const user = await prisma.user.findUnique({
      where: { email: 'Armando@gmail.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
      },
    });
    
    if (!user) {
      console.log('❌ Usuario Armando@gmail.com no encontrado');
      return;
    }
    
    console.log(`📊 Estado actual del usuario:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Estado: ${user.membershipLevel}`);
    console.log(`   Stripe Customer ID: ${user.stripeCustomerId || 'No configurado'}`);
    
    console.log('\n🎯 Para probar el flujo completo:');
    console.log('1. Asegúrate de que ngrok esté corriendo: ngrok http 3000');
    console.log('2. Configura el webhook en Stripe con la URL de ngrok');
    console.log('3. Ve a: http://localhost:3000/subscription');
    console.log('4. Selecciona un plan y completa el pago');
    console.log('5. Verifica que el usuario se actualice a PREMIUM automáticamente');
    
    console.log('\n📋 Tarjetas de prueba:');
    console.log('   ✅ Exitoso: 4242 4242 4242 4242');
    console.log('   ❌ Fallido: 4000 0000 0000 0002');
    console.log('   💰 Fondos insuficientes: 4000 0000 0000 9995');
    
  } catch (error) {
    console.error('❌ Error probando webhook:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWebhookLocally(); 