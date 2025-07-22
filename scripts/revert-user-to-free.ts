import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function revertUserToFree() {
  try {
    const targetEmail = 'Armando@gmail.com';
    
    console.log(`🔄 Revertiendo usuario: ${targetEmail} a estado FREE`);
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
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
      console.log(`❌ Usuario ${targetEmail} no encontrado`);
      return;
    }
    
    console.log(`📊 Estado actual:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Estado: ${user.membershipLevel}`);
    console.log(`   Stripe Customer ID: ${user.stripeCustomerId || 'No configurado'}`);
    
    // Revertir a FREE y limpiar stripeCustomerId
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        membershipLevel: 'FREE',
        stripeCustomerId: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
      },
    });
    
    console.log(`\n✅ Usuario revertido exitosamente:`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Nuevo estado: ${updatedUser.membershipLevel}`);
    console.log(`   Stripe Customer ID: ${updatedUser.stripeCustomerId || 'Limpiado'}`);
    
    console.log(`\n🎯 Ahora puedes hacer un pago real para probar el flujo completo`);
    
  } catch (error) {
    console.error('❌ Error revirtiendo usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

revertUserToFree(); 