import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function updateArmandoToPremium() {
  try {
    console.log('🔧 Actualizando Armando a PREMIUM...');
    
    // Buscar a Armando
    const user = await prisma.user.findUnique({
      where: { email: 'Armando@gmail.com' },
    });
    
    if (!user) {
      console.log('❌ Usuario Armando no encontrado');
      return;
    }
    
    console.log('📊 Usuario encontrado:', user.email);
    console.log('📊 Estado actual:', user.membershipLevel);
    console.log('📊 Stripe Customer ID:', user.stripeCustomerId);
    
    // Actualizar a PREMIUM
    const updatedUser = await prisma.user.update({
      where: { email: 'Armando@gmail.com' },
      data: { membershipLevel: 'PREMIUM' },
    });
    
    console.log('✅ Usuario actualizado exitosamente');
    console.log('📊 Nuevo estado:', updatedUser.membershipLevel);
    
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateArmandoToPremium(); 