import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function updateSpecificUser() {
  try {
    const targetEmail = 'Armando@gmail.com'; // Usuario que quieres actualizar
    
    console.log(`🎯 Actualizando usuario: ${targetEmail}`);
    
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
    console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
    console.log(`   Estado: ${user.membershipLevel}`);
    console.log(`   Stripe Customer ID: ${user.stripeCustomerId || 'No configurado'}`);
    
    // Actualizar a premium
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        membershipLevel: 'PREMIUM',
        stripeCustomerId: 'cus_test_manual_update_' + Date.now(), // Simular customer ID
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
    
    console.log(`\n✅ Usuario actualizado exitosamente:`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Nombre: ${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log(`   Nuevo estado: ${updatedUser.membershipLevel}`);
    console.log(`   Nuevo Stripe Customer ID: ${updatedUser.stripeCustomerId}`);
    
    console.log(`\n🔄 Ahora recarga la página para ver el logo premium`);
    
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSpecificUser(); 