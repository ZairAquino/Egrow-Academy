import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function revertArmandoToFree() {
  try {
    console.log('🔧 Revertiendo Armando a FREE...');
    
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
    
    // Revertir a FREE
    const updatedUser = await prisma.user.update({
      where: { email: 'Armando@gmail.com' },
      data: { membershipLevel: 'FREE' },
    });
    
    console.log('✅ Usuario revertido exitosamente');
    console.log('📊 Nuevo estado:', updatedUser.membershipLevel);
    
  } catch (error) {
    console.error('❌ Error revirtiendo usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

revertArmandoToFree(); 